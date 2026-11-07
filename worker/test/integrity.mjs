// Data-integrity check, run against a running API (local or deployed):
//   node test/integrity.mjs [apiBase] [ownerEmail] [ownerPassword]
// 1. Every stored project, review and setting passes the API's own validation, so editing
//    any existing item in the dashboard can't fail on data the seed wrote.
// 2. The published content equals the site's built-in content (same projects, same order,
//    same fields and images), i.e. the seed changed nothing visible.
// 3. Every image the content references exists in storage.
// Needs Node 22.18+ (imports TypeScript directly).
import assert from "node:assert/strict"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "../..")
const API = process.argv[2] ?? "http://localhost:8787"
const EMAIL = process.argv[3] ?? "owner@local.test"
const PASSWORD = process.argv[4] ?? "local-dev-password"

const { projectInput, reviewInput, settingsSchemas } = await import(path.join(here, "../src/schemas.ts"))
const site = await import(path.join(root, "src/data/projects.ts"))
const sections = await import(path.join(root, "src/data/sections.ts"))
const siteInfo = await import(path.join(root, "src/data/site.ts"))
const stackData = await import(path.join(root, "src/data/stack.ts"))

let failures = 0
const check = (name, fn) =>
  Promise.resolve()
    .then(fn)
    .then(() => console.log(`PASS  ${name}`))
    .catch((e) => {
      failures++
      console.log(`FAIL  ${name}\n      ${String(e.message).split("\n").slice(0, 6).join("\n      ")}`)
    })

const login = await fetch(`${API}/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) })
assert.equal(login.status, 200, "login failed")
const { token } = await login.json()
const get = (p) => fetch(`${API}${p}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())

const [projects, reviews, settings, content] = await Promise.all([get("/admin/projects"), get("/admin/reviews"), get("/admin/settings"), fetch(`${API}/content`).then((r) => r.json())])

// 1 ------------------------------------------------------------ stored data is valid
await check(`all ${projects.length} projects pass validation`, () => {
  for (const p of projects) {
    const r = projectInput.safeParse(p)
    assert.ok(r.success, `${p.slug}: ${JSON.stringify(r.error?.issues)}`)
  }
})
await check(`all ${reviews.length} reviews pass validation`, () => {
  for (const v of reviews) {
    const r = reviewInput.safeParse(v)
    assert.ok(r.success, `review ${v.id}: ${JSON.stringify(r.error?.issues)}`)
  }
})
await check(`all ${Object.keys(settings).length} settings pass validation`, () => {
  for (const [k, v] of Object.entries(settings)) {
    const r = settingsSchemas[k].safeParse(v)
    assert.ok(r.success, `${k}: ${JSON.stringify(r.error?.issues)}`)
  }
})

// 2 ------------------------------------------------------------ published content == built-in content
const strip = (img) => ({ base: img.base.replace(/^.*\/media\/work\//, ""), alt: img.alt })
const normProject = (p) => ({
  slug: p.slug,
  name: p.name,
  kind: p.kind ?? "",
  tagline: p.tagline ?? "",
  summary: p.summary ?? "",
  role: p.role ?? "",
  period: p.period ?? "",
  stack: p.stack ?? [],
  highlights: p.highlights ?? [],
  live: p.live ?? "",
  cover: strip(p.cover),
  features: (p.features ?? []).map(strip),
})
for (const tier of ["featured", "more"]) {
  await check(`"${tier}" projects identical to the site (content, order, images)`, () => {
    assert.deepEqual(content.projects[tier].map(normProject), site[tier].map((p) => normProject({ ...p, cover: { ...p.cover, base: p.cover.base }, features: p.features })))
  })
}
await check(`"small" projects identical to the site`, () => {
  const api = content.projects.small.map((p) => ({ name: p.name, what: p.tagline, stack: p.stack.join(" · "), cover: strip(p.cover) }))
  assert.deepEqual(api, site.small.map((s) => ({ name: s.name, what: s.what, stack: s.stack, cover: s.cover })))
})
await check("settings identical to the built-in section content", () => {
  assert.deepEqual(content.settings.problem, sections.problem)
  assert.deepEqual(content.settings.architecture, sections.architecture)
  assert.deepEqual(content.settings.principles, sections.principles)
  assert.deepEqual(content.settings.howModes, sections.howModes)
  assert.deepEqual(content.settings.howSteps, sections.howSteps)
  assert.deepEqual(content.settings.heroChips, sections.heroChips)
  assert.deepEqual(content.settings.stack, stackData.stack)
  assert.deepEqual(content.settings.metrics, siteInfo.metrics)
  const c = siteInfo.site
  assert.deepEqual(content.settings.contact, { email: c.email, phone: c.phone.display, title: c.title, location: c.location, timezone: c.timezone, links: c.links, cv: c.cv })
})
await check("no reviews are published by the seed (section stays hidden)", () => assert.equal(content.reviews.length, 0))

// 3 ------------------------------------------------------------ every referenced image exists
await check("every referenced image exists in storage (800 and 1600)", async () => {
  const bases = [
    ...Object.values(content.projects).flat().flatMap((p) => [p.cover, ...p.features].map((i) => i.base)),
    ...reviews.filter((r) => r.image).map((r) => `${API}/media/${r.image.key}`),
  ]
  const missing = []
  await Promise.all(
    bases.flatMap((b) =>
      [800, 1600].map(async (w) => {
        const r = await fetch(`${b}-${w}.webp`, { method: "GET" })
        if (r.status !== 200 || r.headers.get("content-type") !== "image/webp") missing.push(`${b}-${w}.webp (${r.status})`)
      }),
    ),
  )
  assert.equal(missing.length, 0, `missing: ${missing.slice(0, 5).join(", ")}`)
})

console.log(failures ? `\n${failures} check(s) failed` : "\nAll integrity checks passed")
process.exit(failures ? 1 : 0)
