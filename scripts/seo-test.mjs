// SEO checks on the production build, served the way Firebase Hosting serves it
// (cleanUrls, trailingSlash, rewrites, 404.html, headers from firebase.json).
//
//   npm run build && node scripts/seo-test.mjs
//
// Everything is checked on the raw HTML a crawler downloads (no JavaScript).

const ORIGIN = "https://eng-abdullahgamal.site"

import { startServer } from "./serve.mjs"

const server = await startServer(0)
const LOCAL = `http://localhost:${server.address().port}`
const get = (p) => fetch(LOCAL + p, { redirect: "manual" })

// ------------------------------------------------------------- helpers
let failures = 0
const results = []
const check = (name, ok, detail = "") => {
  if (!ok) failures++
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`)
}
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1]
const meta = (html, key) => {
  const tag = html.match(new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*>`, "i"))?.[0]
  return tag ? attr(tag, "content") : undefined
}
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
const textOf = (html) =>
  decode(
    html
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim()
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => JSON.parse(m[1]))
const nodes = (ld) => ld.flatMap((d) => d["@graph"] ?? [d])

// ------------------------------------------------------------- robots + sitemap
const robots = await (await get("/robots.txt")).text()
check("robots.txt disallows /admin", /Disallow:\s*\/admin\b/.test(robots))
check("robots.txt does not block the site", !/^Disallow:\s*\/\s*$/m.test(robots))
check("robots.txt points to the sitemap", robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`))

const sitemapRes = await get("/sitemap.xml")
const sitemap = await sitemapRes.text()
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const pageLocs = locs.filter((l) => !/\.(webp|png|jpg)$/.test(l))
check("sitemap.xml served with 200", sitemapRes.status === 200)
check("sitemap URLs are absolute https on the canonical host", pageLocs.length > 0 && pageLocs.every((l) => l.startsWith(`${ORIGIN}/`)), `${pageLocs.length} URLs`)
check("sitemap has no /admin or API URLs", !locs.some((l) => /\/admin|api\./.test(l)))
check("sitemap URLs have no trailing slash (except home)", pageLocs.every((l) => l === `${ORIGIN}/` || !l.endsWith("/")))

// ------------------------------------------------------------- every indexable page
const titles = new Map()
const descriptions = new Map()
const internalLinks = new Set()
for (const loc of pageLocs) {
  const p = loc.slice(ORIGIN.length) || "/"
  const res = await get(p)
  const html = await res.text()
  const label = p
  check(`${label}: 200`, res.status === 200, String(res.status))
  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "")
  const desc = decode(meta(html, "description") ?? "")
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]
  check(`${label}: title present (${title.length} chars)`, title.length >= 20 && title.length <= 70, title)
  check(`${label}: meta description present (${desc.length} chars)`, desc.length >= 70 && desc.length <= 180)
  titles.set(title, [...(titles.get(title) ?? []), p])
  descriptions.set(desc, [...(descriptions.get(desc) ?? []), p])
  check(`${label}: canonical equals the sitemap URL`, canonical === loc, canonical)
  const robotsMeta = meta(html, "robots") ?? ""
  const xRobots = res.headers.get("x-robots-tag") ?? ""
  check(`${label}: indexable (no noindex)`, !/noindex/i.test(robotsMeta + xRobots))
  check(`${label}: <html lang="en">`, /<html[^>]+lang="en"/i.test(html))
  const h1s = [...html.replace(/<noscript[\s\S]*?<\/noscript>/gi, "").matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textOf(m[1]))
  check(`${label}: exactly one <h1> in the initial HTML`, h1s.length === 1, h1s.join(" | ").slice(0, 80))
  const text = textOf(html)
  check(`${label}: meaningful text in the initial HTML (${text.length} chars)`, text.length > 800)
  check(`${label}: names "Abdullah Gamal" in the initial HTML`, text.includes("Abdullah Gamal"))
  for (const k of ["og:title", "og:description", "og:url", "og:image", "og:type", "twitter:card"]) check(`${label}: ${k}`, !!meta(html, k))
  check(`${label}: og:url equals canonical`, meta(html, "og:url") === canonical)
  let ld = []
  try {
    ld = jsonLd(html)
    check(`${label}: JSON-LD parses`, ld.length > 0)
  } catch (e) {
    check(`${label}: JSON-LD parses`, false, e.message)
  }
  const graph = nodes(ld)
  const person = graph.find((n) => n["@type"] === "Person")
  const personRefs = JSON.stringify(ld).match(/"@id":"https:\/\/eng-abdullahgamal\.site\/#person"/g) ?? []
  check(`${label}: Person entity referenced by the stable @id`, personRefs.length > 0)
  if (person) {
    check(`${label}: Person name/url/sameAs`, person.name === "Abdullah Gamal" && person.url === `${ORIGIN}/` && Array.isArray(person.sameAs) && person.sameAs.length >= 2)
    check(`${label}: Person alternateName includes Arabic`, [].concat(person.alternateName ?? []).some((n) => /[؀-ۿ]/.test(n)))
  }
  check(`${label}: no Review/AggregateRating markup`, !/"(Review|AggregateRating)"/.test(JSON.stringify(ld)))
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
  check(`${label}: every <img> has an alt attribute`, imgs.every((i) => /\balt="/.test(i)), `${imgs.length} images`)
  check(`${label}: every <img> has width and height`, imgs.every((i) => /\bwidth="/.test(i) && /\bheight="/.test(i)))
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)/gi)) internalLinks.add(m[1])
}
for (const [t, ps] of titles) check(`title unique: "${t.slice(0, 50)}…"`, ps.length === 1, ps.join(", "))
for (const [d, ps] of descriptions) check(`description unique: "${d.slice(0, 40)}…"`, ps.length === 1, ps.join(", "))

// ------------------------------------------------------------- links, statuses, special routes
const broken = []
for (const href of internalLinks) {
  const r = await get(href)
  if (![200].includes(r.status)) broken.push(`${href} → ${r.status}`)
}
check(`internal links resolve (${internalLinks.size} checked)`, broken.length === 0, broken.slice(0, 5).join(", "))

const missing = await get("/this-page-does-not-exist")
const missingHtml = await missing.text()
check("unknown URL returns 404 (no soft 404)", missing.status === 404, String(missing.status))
check("404 page is noindex", /noindex/i.test((meta(missingHtml, "robots") ?? "") + (missing.headers.get("x-robots-tag") ?? "")))

const admin = await get("/admin")
const adminHtml = await admin.text()
check("/admin loads the dashboard shell (200)", admin.status === 200)
check("/admin is noindex", /noindex/i.test((meta(adminHtml, "robots") ?? "") + (admin.headers.get("x-robots-tag") ?? "")))
check("/admin has no prerendered portfolio content", !textOf(adminHtml).includes("Selected work"))

const slash = await get("/projects/the-ride/")
check("trailing slash redirects to the canonical URL", [301, 308].includes(slash.status) && slash.headers.get("location") === "/projects/the-ride", `${slash.status} → ${slash.headers.get("location")}`)

server.close()
console.log(results.join("\n"))
console.log(failures ? `\n${failures} SEO check(s) failed` : "\nAll SEO checks passed")
process.exit(failures ? 1 : 0)
