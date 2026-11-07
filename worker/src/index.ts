import { Hono, type Context, type MiddlewareHandler } from "hono"
import { bodyLimit } from "hono/body-limit"
import { cors } from "hono/cors"
import type { z } from "zod"
import { clearFailures, isLockedOut, issueToken, recordFailure, verifyPassword, verifyToken } from "./auth"
import { projectInput, reorderInput, reviewInput, settingsKeys, settingsSchemas, type SettingsKey } from "./schemas"

type AppEnv = { Bindings: Env; Variables: { owner: string } }
const app = new Hono<AppEnv>()

// ---------------------------------------------------------------- CORS + headers
const PREVIEW_ORIGIN = /^https:\/\/my-portofolio-9d70c--[a-z0-9-]+\.web\.app$/
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/
app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowed = c.env.ALLOWED_ORIGINS.split(",").map((s: string) => s.trim())
      return allowed.includes(origin) || PREVIEW_ORIGIN.test(origin) || LOCAL_ORIGIN.test(origin) ? origin : null
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  }),
)

app.use("*", async (c, next) => {
  await next()
  c.header("X-Content-Type-Options", "nosniff")
  c.header("Referrer-Policy", "no-referrer")
  c.header("X-Frame-Options", "DENY")
  if (!c.req.path.startsWith("/media/")) c.header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
  // Owner responses carry drafts; never let a browser or proxy cache them.
  if (c.req.path.startsWith("/admin/") || c.req.path.startsWith("/auth/")) c.header("Cache-Control", "no-store")
})

// ---------------------------------------------------------------- helpers
type ErrStatus = 400 | 401 | 404 | 409 | 413 | 415 | 429
const fail = (c: Context, status: ErrStatus, message: string, details?: unknown) => c.json({ error: message, details }, status)

const jsonLimit = bodyLimit({ maxSize: 256 * 1024, onError: (c) => fail(c, 413, "Request body is too large") })
const uploadLimit = bodyLimit({ maxSize: 10 * 1024 * 1024, onError: (c) => fail(c, 413, "Upload is too large") })

async function parseBody<T extends z.ZodType>(c: Context, schema: T): Promise<z.infer<T> | Response> {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return fail(c, 400, "Body must be JSON")
  }
  const result = schema.safeParse(body)
  if (!result.success) return fail(c, 400, "Validation failed", result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })))
  return result.data
}

/** Optimistic concurrency: the client sends the `updatedAt` it loaded; a mismatch means it changed elsewhere. */
async function expectedVersion(c: Context): Promise<string | undefined> {
  try {
    const v = ((await c.req.json()) as { updatedAt?: unknown }).updatedAt
    return typeof v === "string" ? v : undefined
  } catch {
    return undefined
  }
}

const idParam = (c: Context) => {
  const id = Number(c.req.param("id"))
  return Number.isInteger(id) && id > 0 ? id : null
}

const mediaBase = (c: Context<AppEnv>) => c.env.MEDIA_BASE_URL

type Img = { key: string; alt: string }
type Row = { id: number; sort: number; published: number; data: string; updated_at: string; [k: string]: unknown }
const rowToProject = (r: Row) => ({ id: r.id, slug: r.slug as string, tier: r.tier as string, sort: r.sort, published: !!r.published, updatedAt: r.updated_at, ...JSON.parse(r.data) })
const rowToReview = (r: Row) => ({ id: r.id, source: r.source as string, sort: r.sort, published: !!r.published, updatedAt: r.updated_at, ...JSON.parse(r.data) })
const projectImages = (p: { cover?: Img; features?: Img[] }) => [p.cover, ...(p.features ?? [])]

// ---------------------------------------------------------------- public
app.get("/health", (c) => c.json({ ok: true }))

/** Everything the public site renders: published items only, in display order, with absolute image URLs. */
app.get("/content", async (c) => {
  const [projects, reviews, settings] = await c.env.DB.batch([
    c.env.DB.prepare("SELECT * FROM projects WHERE published = 1 ORDER BY tier, sort, id"),
    c.env.DB.prepare("SELECT * FROM reviews WHERE published = 1 ORDER BY sort, id"),
    c.env.DB.prepare("SELECT key, value FROM settings"),
  ])
  const base = mediaBase(c)
  const img = (i: Img | null) => (i ? { base: base + i.key, alt: i.alt } : null)

  const byTier: Record<string, unknown[]> = { featured: [], more: [], small: [] }
  for (const r of projects.results as Row[]) {
    const { updatedAt: _u, ...p } = rowToProject(r)
    byTier[p.tier]?.push({ ...p, cover: img(p.cover), features: (p.features ?? []).map(img) })
  }
  const settingsObj: Record<string, unknown> = {}
  for (const s of settings.results as { key: string; value: string }[]) settingsObj[s.key] = JSON.parse(s.value)

  c.header("Cache-Control", "public, max-age=30, stale-while-revalidate=300")
  return c.json({
    projects: byTier,
    reviews: (reviews.results as Row[]).map((r) => {
      const { updatedAt: _u, projectSlug: _p, ...v } = rowToReview(r)
      return { ...v, image: img(v.image) }
    }),
    settings: settingsObj,
  })
})

/** Public media from R2 (images and the CV). Keys are unique per upload, so they cache forever. */
app.get("/media/*", async (c) => {
  let key: string
  try {
    key = decodeURIComponent(new URL(c.req.url).pathname.slice("/media/".length))
  } catch {
    return fail(c, 404, "Not found")
  }
  if (!/^(work|projects|reviews|cv)\/[A-Za-z0-9._-]+$/.test(key)) return fail(c, 404, "Not found")
  const obj = await c.env.MEDIA.get(key)
  if (!obj) return fail(c, 404, "Not found")
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set("etag", obj.httpEtag)
  headers.set("Cache-Control", "public, max-age=31536000, immutable")
  return new Response(obj.body, { headers })
})

// ---------------------------------------------------------------- auth
// Until all three secrets are set (e.g. right after the first deploy) owner access stays closed.
const authConfigured = (env: Env) => !!(env.OWNER_EMAIL && env.OWNER_PASSWORD_HASH && env.TOKEN_SECRET && env.TOKEN_SECRET.length >= 32)
app.use("/auth/*", async (c, next) => (authConfigured(c.env) ? next() : c.json({ error: "Sign-in isn't configured yet" }, 503)))
app.use("/admin/*", async (c, next) => (authConfigured(c.env) ? next() : c.json({ error: "Sign-in isn't configured yet" }, 503)))

app.post("/auth/login", jsonLimit, async (c) => {
  const ip = c.req.header("cf-connecting-ip") ?? "local"
  if (await isLockedOut(c.env.DB, ip)) {
    c.header("Retry-After", "900")
    return fail(c, 429, "Too many attempts. Try again in 15 minutes.")
  }
  const body = (await c.req.json().catch(() => null)) as { email?: unknown; password?: unknown } | null
  const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 200)
  const password = String(body?.password ?? "").slice(0, 200)
  // Always run the hash so a wrong email takes as long as a wrong password.
  const passwordOk = await verifyPassword(password, c.env.OWNER_PASSWORD_HASH)
  if (!passwordOk || email !== c.env.OWNER_EMAIL.trim().toLowerCase()) {
    await recordFailure(c.env.DB, ip)
    return fail(c, 401, "Wrong email or password")
  }
  await clearFailures(c.env.DB, ip)
  return c.json(await issueToken(email, c.env.TOKEN_SECRET))
})

const ownerOnly: MiddlewareHandler<AppEnv> = async (c, next) => {
  const header = c.req.header("Authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  const sub = token ? await verifyToken(token, c.env.TOKEN_SECRET) : null
  if (!sub || sub !== c.env.OWNER_EMAIL.trim().toLowerCase()) return fail(c, 401, "Sign in again")
  c.set("owner", sub)
  await next()
}
app.use("/admin/*", ownerOnly)

app.get("/admin/me", (c) => c.json({ email: c.get("owner"), mediaBase: mediaBase(c) }))

// ---------------------------------------------------------------- projects
app.get("/admin/projects", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM projects ORDER BY tier, sort, id").all<Row>()
  return c.json(results.map(rowToProject))
})

const projectData = ({ slug: _s, tier: _t, published: _p, ...rest }: z.infer<typeof projectInput>) => JSON.stringify(rest)

app.post("/admin/projects", jsonLimit, async (c) => {
  const input = await parseBody(c, projectInput)
  if (input instanceof Response) return input
  try {
    // New items go to the end of their section.
    const row = await c.env.DB.prepare(
      "INSERT INTO projects (slug, tier, sort, published, data) VALUES (?1, ?2, (SELECT COALESCE(MAX(sort), -1) + 1 FROM projects WHERE tier = ?2), ?3, ?4) RETURNING *",
    )
      .bind(input.slug, input.tier, input.published ? 1 : 0, projectData(input))
      .first<Row>()
    return c.json(rowToProject(row!), 201)
  } catch (e) {
    if (String(e).includes("UNIQUE")) return fail(c, 409, "Another project already uses this slug", [{ path: "slug", message: "Already used" }])
    throw e
  }
})

app.put("/admin/projects/:id", jsonLimit, async (c) => {
  const id = idParam(c)
  if (!id) return fail(c, 404, "Not found")
  const input = await parseBody(c, projectInput)
  if (input instanceof Response) return input
  const version = await expectedVersion(c)
  const before = await c.env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first<Row>()
  if (!before) return fail(c, 404, "Not found")
  if (version && version !== before.updated_at) return fail(c, 409, "This project was changed somewhere else. Reload it before saving.")
  try {
    // Moving to another section puts the project at the end of that section.
    const row = await c.env.DB.prepare(
      `UPDATE projects SET slug = ?1, published = ?3, data = ?4, updated_at = datetime('now'),
         sort = CASE WHEN tier = ?2 THEN sort ELSE (SELECT COALESCE(MAX(sort), -1) + 1 FROM projects WHERE tier = ?2) END,
         tier = ?2
       WHERE id = ?5 RETURNING *`,
    )
      .bind(input.slug, input.tier, input.published ? 1 : 0, projectData(input), id)
      .first<Row>()
    if (!row) return fail(c, 404, "Not found")
    // Delete uploaded images this save stopped using.
    const keep = new Set(projectImages(input).map((i) => i?.key))
    await deleteImages(c.env, projectImages(rowToProject(before)).filter((i) => i && !keep.has(i.key)))
    return c.json(rowToProject(row))
  } catch (e) {
    if (String(e).includes("UNIQUE")) return fail(c, 409, "Another project already uses this slug", [{ path: "slug", message: "Already used" }])
    throw e
  }
})

app.delete("/admin/projects/:id", async (c) => {
  const id = idParam(c)
  if (!id) return fail(c, 404, "Not found")
  const row = await c.env.DB.prepare("DELETE FROM projects WHERE id = ? RETURNING *").bind(id).first<Row>()
  if (!row) return fail(c, 404, "Not found")
  await deleteImages(c.env, projectImages(rowToProject(row)))
  return c.body(null, 204)
})

app.patch("/admin/projects/reorder", jsonLimit, (c) => reorder(c, "projects"))

// ---------------------------------------------------------------- reviews
app.get("/admin/reviews", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM reviews ORDER BY sort, id").all<Row>()
  return c.json(results.map(rowToReview))
})

const reviewData = ({ source: _s, published: _p, ...rest }: z.infer<typeof reviewInput>) => JSON.stringify(rest)

app.post("/admin/reviews", jsonLimit, async (c) => {
  const input = await parseBody(c, reviewInput)
  if (input instanceof Response) return input
  const row = await c.env.DB.prepare(
    "INSERT INTO reviews (source, sort, published, data) VALUES (?, (SELECT COALESCE(MAX(sort), -1) + 1 FROM reviews), ?, ?) RETURNING *",
  )
    .bind(input.source, input.published ? 1 : 0, reviewData(input))
    .first<Row>()
  return c.json(rowToReview(row!), 201)
})

app.put("/admin/reviews/:id", jsonLimit, async (c) => {
  const id = idParam(c)
  if (!id) return fail(c, 404, "Not found")
  const input = await parseBody(c, reviewInput)
  if (input instanceof Response) return input
  const version = await expectedVersion(c)
  const before = await c.env.DB.prepare("SELECT * FROM reviews WHERE id = ?").bind(id).first<Row>()
  if (!before) return fail(c, 404, "Not found")
  if (version && version !== before.updated_at) return fail(c, 409, "This review was changed somewhere else. Reload it before saving.")
  const row = await c.env.DB.prepare("UPDATE reviews SET source = ?, published = ?, data = ?, updated_at = datetime('now') WHERE id = ? RETURNING *")
    .bind(input.source, input.published ? 1 : 0, reviewData(input), id)
    .first<Row>()
  if (!row) return fail(c, 404, "Not found")
  const old = rowToReview(before).image as Img | null
  if (old && old.key !== input.image?.key) await deleteImages(c.env, [old])
  return c.json(rowToReview(row))
})

app.delete("/admin/reviews/:id", async (c) => {
  const id = idParam(c)
  if (!id) return fail(c, 404, "Not found")
  const row = await c.env.DB.prepare("DELETE FROM reviews WHERE id = ? RETURNING *").bind(id).first<Row>()
  if (!row) return fail(c, 404, "Not found")
  await deleteImages(c.env, [rowToReview(row).image])
  return c.body(null, 204)
})

app.patch("/admin/reviews/reorder", jsonLimit, (c) => reorder(c, "reviews"))

async function reorder(c: Context<AppEnv>, table: "projects" | "reviews") {
  const input = await parseBody(c, reorderInput)
  if (input instanceof Response) return input
  if (new Set(input.ids).size !== input.ids.length) return fail(c, 400, "Duplicate ids")
  await c.env.DB.batch(input.ids.map((id, i) => c.env.DB.prepare(`UPDATE ${table} SET sort = ? WHERE id = ?`).bind(i, id)))
  return c.body(null, 204)
}

// ---------------------------------------------------------------- settings
app.get("/admin/settings", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>()
  return c.json(Object.fromEntries(results.map((r) => [r.key, JSON.parse(r.value)])))
})

app.put("/admin/settings/:key", jsonLimit, async (c) => {
  const key = c.req.param("key") as SettingsKey
  if (!settingsKeys.includes(key)) return fail(c, 404, "Unknown setting")
  const value = await parseBody(c, settingsSchemas[key])
  if (value instanceof Response) return value
  await c.env.DB.prepare(
    "INSERT INTO settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = datetime('now')",
  )
    .bind(key, JSON.stringify(value))
    .run()
  return c.json(value)
})

// ---------------------------------------------------------------- uploads
const MAX_IMAGE_BYTES = 3 * 1024 * 1024
const MAX_CV_BYTES = 8 * 1024 * 1024

async function isWebp(file: File) {
  if (file.size < 16) return false
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const tag = (from: number) => String.fromCharCode(...head.slice(from, from + 4))
  return tag(0) === "RIFF" && tag(8) === "WEBP"
}

/** Stores one image as two WebP sizes (resized in the browser) and returns its base key. */
app.post("/admin/media", uploadLimit, async (c) => {
  const form = await c.req.formData().catch(() => null)
  const folder = String(form?.get("folder") ?? "")
  const small = form?.get("w800")
  const large = form?.get("w1600")
  if (!["projects", "reviews"].includes(folder)) return fail(c, 400, "Unknown folder")
  if (!(small instanceof File) || !(large instanceof File)) return fail(c, 400, "Send w800 and w1600 files")
  for (const f of [small, large]) {
    if (f.size > MAX_IMAGE_BYTES) return fail(c, 413, "Image is larger than 3 MB after compression")
    if (!(await isWebp(f))) return fail(c, 415, "Images must be WebP")
  }
  const key = `${folder}/${crypto.randomUUID()}`
  const meta = { httpMetadata: { contentType: "image/webp" } }
  await Promise.all([c.env.MEDIA.put(`${key}-800.webp`, small, meta), c.env.MEDIA.put(`${key}-1600.webp`, large, meta)])
  return c.json({ key, base: mediaBase(c) + key }, 201)
})

/** Deletes an upload that was never saved (e.g. the editor was cancelled). Images still in use are kept. */
app.delete("/admin/media", async (c) => {
  const key = c.req.query("key") ?? ""
  if (!/^(projects|reviews)\/[0-9a-f-]{36}$/.test(key)) return fail(c, 400, "Only uploaded images can be deleted")
  const used = await c.env.DB.prepare(
    "SELECT 1 FROM projects WHERE data LIKE ?1 UNION ALL SELECT 1 FROM reviews WHERE data LIKE ?1 LIMIT 1",
  )
    .bind(`%"${key}"%`)
    .first()
  if (used) return fail(c, 409, "This image is still used by saved content")
  await deleteImages(c.env, [{ key }])
  return c.body(null, 204)
})

app.post("/admin/cv", uploadLimit, async (c) => {
  const form = await c.req.formData().catch(() => null)
  const file = form?.get("file")
  if (!(file instanceof File)) return fail(c, 400, "Send the PDF as 'file'")
  if (file.size > MAX_CV_BYTES) return fail(c, 413, "PDF is larger than 8 MB")
  const head = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer())
  if (head !== "%PDF-") return fail(c, 415, "The CV must be a PDF")
  const key = `cv/${crypto.randomUUID()}.pdf`
  await c.env.MEDIA.put(key, file, {
    httpMetadata: { contentType: "application/pdf", contentDisposition: 'inline; filename="abdullah-gamal-cv.pdf"' },
  })
  return c.json({ url: mediaBase(c) + key }, 201)
})

/** Deletes uploaded images (never the seeded `work/` files the static site also uses). */
async function deleteImages(env: Env, images: Array<{ key: string } | null | undefined>) {
  const keys = images
    .filter((i): i is { key: string } => !!i && /^(projects|reviews)\//.test(i.key))
    .flatMap((i) => [`${i.key}-800.webp`, `${i.key}-1600.webp`])
  if (keys.length) await env.MEDIA.delete(keys)
}

app.notFound((c) => fail(c, 404, "Not found"))
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: "Something went wrong" }, 500)
})

export default app
