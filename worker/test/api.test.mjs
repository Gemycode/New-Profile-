// API tests (security, validation, data integrity). Run against `npm run dev`:
//   node --test test/api.test.mjs
// Uses the local owner from .dev.vars. Every test cleans up what it creates.
// The lockout test runs last because it locks the login for this IP for 15 minutes;
// afterwards it clears the lock with `wrangler d1 execute --local`.
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { after, before, describe, test } from "node:test"

const API = process.env.API ?? "http://localhost:8787"
const EMAIL = process.env.OWNER_EMAIL ?? "owner@local.test"
const PASSWORD = process.env.OWNER_PASSWORD ?? "local-dev-password"

let token = ""
const auth = (extra = {}) => ({ Authorization: `Bearer ${token}`, ...extra })
const json = (method, body, headers = auth()) => ({ method, headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) })
const call = (path, init) => fetch(`${API}${path}`, init)

// Smallest valid WebP (1×1, lossless) for upload tests.
const WEBP = Buffer.from("UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "base64")
const upload = async (folder = "projects", files = { w800: WEBP, w1600: WEBP }, type = "image/webp") => {
  const form = new FormData()
  form.set("folder", folder)
  for (const [k, v] of Object.entries(files)) form.set(k, new File([v], `${k}.webp`, { type }))
  return call("/admin/media", { method: "POST", headers: auth(), body: form })
}
const project = (over = {}) => ({
  slug: `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  tier: "small",
  published: false,
  name: "API test project",
  cover: { key: "work/01-the-ride-cover", alt: "Test cover" },
  ...over,
})
const mediaExists = async (key) => (await call(`/media/${key}-800.webp`)).status === 200

before(async () => {
  const r = await call("/auth/login", json("POST", { email: EMAIL, password: PASSWORD }, {}))
  assert.equal(r.status, 200, "owner login must work (is wrangler dev running with .dev.vars?)")
  token = (await r.json()).token
})

describe("authentication", () => {
  test("wrong password → 401 with a generic message", async () => {
    const r = await call("/auth/login", json("POST", { email: EMAIL, password: "nope" }, {}))
    assert.equal(r.status, 401)
    assert.equal((await r.json()).error, "Wrong email or password")
  })
  test("wrong email with the right password → 401", async () => {
    const r = await call("/auth/login", json("POST", { email: "someone@else.test", password: PASSWORD }, {}))
    assert.equal(r.status, 401)
  })
  test("email is case-insensitive", async () => {
    const r = await call("/auth/login", json("POST", { email: EMAIL.toUpperCase(), password: PASSWORD }, {}))
    assert.equal(r.status, 200)
  })
  test("every owner endpoint needs a token", async () => {
    for (const [m, p] of [["GET", "/admin/me"], ["GET", "/admin/projects"], ["POST", "/admin/projects"], ["PUT", "/admin/projects/1"], ["DELETE", "/admin/projects/1"], ["PATCH", "/admin/projects/reorder"], ["GET", "/admin/reviews"], ["GET", "/admin/settings"], ["PUT", "/admin/settings/contact"], ["POST", "/admin/media"], ["DELETE", "/admin/media?key=x"], ["POST", "/admin/cv"]]) {
      const r = await call(p, { method: m })
      assert.equal(r.status, 401, `${m} ${p}`)
    }
  })
  test("tampered, malformed and expired tokens are rejected", async () => {
    const [payload, sig] = token.split(".")
    const forged = Buffer.from(JSON.stringify({ sub: EMAIL, exp: 9999999999 })).toString("base64url")
    const expired = Buffer.from(JSON.stringify({ sub: EMAIL, exp: 1 })).toString("base64url")
    for (const bad of [`${forged}.${sig}`, `${payload}.${sig.slice(0, -2)}AA`, "garbage", `${expired}.${sig}`, `${payload}.`]) {
      const r = await call("/admin/me", { headers: { Authorization: `Bearer ${bad}` } })
      assert.equal(r.status, 401, bad)
    }
  })
})

describe("headers and CORS", () => {
  test("security headers on API responses", async () => {
    const r = await call("/content")
    assert.equal(r.headers.get("x-content-type-options"), "nosniff")
    assert.equal(r.headers.get("x-frame-options"), "DENY")
    assert.match(r.headers.get("content-security-policy") ?? "", /default-src 'none'/)
  })
  test("owner responses are not cacheable", async () => {
    const r = await call("/admin/projects", { headers: auth() })
    assert.equal(r.headers.get("cache-control"), "no-store")
  })
  test("CORS allows the site, previews and localhost, not other origins", async () => {
    const pre = (origin) => call("/content", { method: "OPTIONS", headers: { Origin: origin, "Access-Control-Request-Method": "GET" } })
    for (const ok of ["https://eng-abdullahgamal.site", "https://my-portofolio-9d70c--pr1-abc.web.app", "http://localhost:3000"]) {
      assert.equal((await pre(ok)).headers.get("access-control-allow-origin"), ok)
    }
    for (const bad of ["https://evil.example", "https://my-portofolio-9d70c--x.web.app.evil.example", "https://other-project--pr1.web.app"]) {
      assert.equal((await pre(bad)).headers.get("access-control-allow-origin"), null, bad)
    }
  })
})

describe("validation", () => {
  test("javascript:, data: and protocol-relative links are rejected everywhere", async () => {
    for (const live of ["javascript:alert(1)", "data:text/html,x", "//evil.example", "JaVaScRiPt:alert(1)"]) {
      const r = await call("/admin/projects", json("POST", project({ live })))
      assert.equal(r.status, 400, live)
    }
    const review = { source: "upwork", text: "ok", reviewUrl: "javascript:alert(1)" }
    assert.equal((await call("/admin/reviews", json("POST", review))).status, 400)
    const settings = await (await call("/admin/settings", { headers: auth() })).json()
    const contact = settings.contact
    for (const bad of [{ ...contact, cv: "javascript:alert(1)" }, { ...contact, cv: "//evil.example/cv.pdf" }, { ...contact, links: [{ label: "x", href: "javascript:alert(1)" }] }]) {
      assert.equal((await call("/admin/settings/contact", json("PUT", bad))).status, 400)
    }
  })
  test("image keys must be our own uploads (no arbitrary or traversal keys)", async () => {
    for (const key of ["../secret", "cv/abc", "projects/not-a-uuid", "https://evil.example/x", "work/../../x"]) {
      const r = await call("/admin/projects", json("POST", project({ cover: { key, alt: "x x x" } })))
      assert.equal(r.status, 400, key)
    }
  })
  test("field errors come back with paths", async () => {
    const r = await call("/admin/projects", json("POST", project({ slug: "Bad Slug", cover: { key: "work/01-the-ride-cover", alt: "" } })))
    const body = await r.json()
    const paths = body.details.map((d) => d.path)
    assert.ok(paths.includes("slug") && paths.includes("cover.alt"), JSON.stringify(paths))
  })
  test("a review needs a screenshot or text, and 'other' needs a platform name", async () => {
    assert.equal((await call("/admin/reviews", json("POST", { source: "mostaql" }))).status, 400)
    assert.equal((await call("/admin/reviews", json("POST", { source: "other", text: "hi" }))).status, 400)
  })
  test("diagram text is length-limited so it fits the SVG", async () => {
    const s = await (await call("/admin/settings", { headers: auth() })).json()
    const arch = structuredClone(s.architecture)
    arch.nodes.web.label = "x".repeat(19)
    assert.equal((await call("/admin/settings/architecture", json("PUT", arch))).status, 400)
    const arch2 = structuredClone(s.architecture)
    arch2.modules = [...arch2.modules, "Ninth"]
    assert.equal((await call("/admin/settings/architecture", json("PUT", arch2))).status, 400)
  })
  test("unknown setting → 404, oversized body → 413, non-JSON → 400", async () => {
    assert.equal((await call("/admin/settings/evil", json("PUT", {}))).status, 404)
    assert.equal((await call("/admin/projects", json("POST", project({ summary: "x".repeat(300_000) })))).status, 413)
    assert.equal((await call("/admin/projects", { method: "POST", headers: auth({ "content-type": "application/json" }), body: "{not json" })).status, 400)
  })
  test("reorder rejects duplicate ids", async () => {
    assert.equal((await call("/admin/projects/reorder", json("PATCH", { ids: [1, 1] }))).status, 400)
  })
})

describe("uploads", () => {
  test("valid WebP upload is stored at both sizes", async () => {
    const r = await upload()
    assert.equal(r.status, 201)
    const { key } = await r.json()
    assert.match(key, /^projects\/[0-9a-f-]{36}$/)
    assert.ok(await mediaExists(key))
    assert.equal((await call(`/admin/media?key=${key}`, { method: "DELETE", headers: auth() })).status, 204)
    assert.equal(await mediaExists(key), false)
  })
  test("non-WebP bytes are refused even with an image/webp type", async () => {
    const png = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex")
    assert.equal((await upload("projects", { w800: png, w1600: png })).status, 415)
    const html = Buffer.from("<html><script>alert(1)</script></html>")
    assert.equal((await upload("projects", { w800: html, w1600: html })).status, 415)
  })
  test("unknown folder and missing files are refused", async () => {
    assert.equal((await upload("cv")).status, 400)
    assert.equal((await upload("projects", { w800: WEBP })).status, 400)
  })
  test("images over 3 MB are refused", async () => {
    const big = Buffer.concat([WEBP, Buffer.alloc(3 * 1024 * 1024 + 10)])
    assert.equal((await upload("projects", { w800: big, w1600: WEBP })).status, 413)
  })
  test("CV must be a real PDF", async () => {
    const form = new FormData()
    form.set("file", new File([Buffer.from("not a pdf")], "cv.pdf", { type: "application/pdf" }))
    assert.equal((await call("/admin/cv", { method: "POST", headers: auth(), body: form })).status, 415)
  })
  test("media URLs can't reach outside the allowed folders", async () => {
    for (const p of ["/media/..%2F..%2Fsecret", "/media/%E0%A4%A", "/media/other/x.webp", "/media/work/../x"]) {
      assert.equal((await call(p)).status, 404, p)
    }
  })
})

describe("data integrity", () => {
  const created = []
  after(async () => {
    for (const id of created) await call(`/admin/projects/${id}`, { method: "DELETE", headers: auth() })
  })

  test("drafts never appear in public content", async () => {
    const r = await call("/admin/projects", json("POST", project({ name: "Secret draft" })))
    const p = await r.json()
    created.push(p.id)
    const content = await (await call("/content")).json()
    assert.ok(!JSON.stringify(content).includes("Secret draft"))
  })
  test("duplicate slug → 409", async () => {
    const p = project()
    const a = await (await call("/admin/projects", json("POST", p))).json()
    created.push(a.id)
    assert.equal((await call("/admin/projects", json("POST", p))).status, 409)
  })
  test("stale edit (changed elsewhere) → 409, fresh edit → 200", async () => {
    const a = await (await call("/admin/projects", json("POST", project()))).json()
    created.push(a.id)
    const first = await call(`/admin/projects/${a.id}`, json("PUT", { ...a, name: "Edit 1" }))
    assert.equal(first.status, 200)
    const fresh = await first.json()
    // SQLite datetime has 1 s resolution; make sure the next write gets a new version.
    await new Promise((r) => setTimeout(r, 1100))
    assert.equal((await call(`/admin/projects/${a.id}`, json("PUT", { ...fresh, name: "Edit 2" }))).status, 200)
    assert.equal((await call(`/admin/projects/${a.id}`, json("PUT", { ...fresh, name: "Stale edit" }))).status, 409)
  })
  test("replacing an uploaded image deletes the old file; seeded images are never deleted", async () => {
    const k1 = (await (await upload()).json()).key
    const k2 = (await (await upload()).json()).key
    const a = await (await call("/admin/projects", json("POST", project({ cover: { key: k1, alt: "First" }, features: [{ key: "work/01-the-ride-feature-1", alt: "Seeded" }] })))).json()
    created.push(a.id)
    // An image in use can't be deleted through the media endpoint.
    assert.equal((await call(`/admin/media?key=${k1}`, { method: "DELETE", headers: auth() })).status, 409)
    await call(`/admin/projects/${a.id}`, json("PUT", { ...a, cover: { key: k2, alt: "Second" }, features: [] }))
    assert.equal(await mediaExists(k1), false, "old upload removed")
    assert.equal(await mediaExists(k2), true, "new upload kept")
    assert.equal(await mediaExists("work/01-the-ride-feature-1"), true, "seeded image kept")
  })
  test("deleting a project deletes its uploaded images", async () => {
    const k = (await (await upload()).json()).key
    const a = await (await call("/admin/projects", json("POST", project({ cover: { key: k, alt: "Gone soon" } })))).json()
    assert.equal((await call(`/admin/projects/${a.id}`, { method: "DELETE", headers: auth() })).status, 204)
    assert.equal(await mediaExists(k), false)
  })
  test("moving a project to another section puts it last there", async () => {
    const a = await (await call("/admin/projects", json("POST", project({ tier: "small" })))).json()
    created.push(a.id)
    const moved = await (await call(`/admin/projects/${a.id}`, json("PUT", { ...a, tier: "more" }))).json()
    const more = (await (await call("/admin/projects", { headers: auth() })).json()).filter((p) => p.tier === "more")
    assert.equal(moved.sort, Math.max(...more.map((p) => p.sort)))
  })
  test("reorder changes only the order", async () => {
    const before = (await (await call("/admin/projects", { headers: auth() })).json()).filter((p) => p.tier === "featured")
    const ids = before.map((p) => p.id)
    await call("/admin/projects/reorder", json("PATCH", { ids: [...ids].reverse() }))
    const reversed = (await (await call("/admin/projects", { headers: auth() })).json()).filter((p) => p.tier === "featured")
    assert.deepEqual(reversed.map((p) => p.id), [...ids].reverse())
    await call("/admin/projects/reorder", json("PATCH", { ids }))
    const restored = (await (await call("/admin/projects", { headers: auth() })).json()).filter((p) => p.tier === "featured")
    assert.deepEqual(restored.map(({ id, name, sort }) => ({ id, name, sort })), before.map(({ id, name, sort }) => ({ id, name, sort })))
  })
  test("public content hides internal fields", async () => {
    const c = await (await call("/content")).json()
    const sample = c.projects.featured[0]
    assert.equal(sample.updatedAt, undefined)
    for (const r of c.reviews) assert.equal(r.projectSlug, undefined)
  })
})

describe("login lockout (runs last)", () => {
  after(() => {
    execFileSync("npx", ["wrangler", "d1", "execute", "portfolio-db", "--local", "--command", "DELETE FROM login_attempts"], { stdio: "ignore" })
  })
  test("5 failures lock the login, even for the right password", async () => {
    await call("/auth/login", json("POST", { email: EMAIL, password: PASSWORD }, {})) // clears earlier failures
    let last
    for (let i = 0; i < 5; i++) last = await call("/auth/login", json("POST", { email: EMAIL, password: "wrong" }, {}))
    assert.equal(last.status, 401)
    const locked = await call("/auth/login", json("POST", { email: EMAIL, password: PASSWORD }, {}))
    assert.equal(locked.status, 429)
    assert.equal(locked.headers.get("retry-after"), "900")
  })
})
