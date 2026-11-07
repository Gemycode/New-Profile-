// Copies the site's current built-in content into D1 and its images into R2.
//
//   node scripts/seed.mjs            # local D1/R2 (wrangler dev)
//   node scripts/seed.mjs --remote   # your Cloudflare account (after `wrangler login`)
//   add --skip-media to only write the database
//
// Safe to re-run: projects are inserted by slug and settings by key only when missing,
// and each Mostaql review draft is skipped if a review already uses its screenshot.
// Needs Node 22.18+ (it imports the site's TypeScript data files directly).
import { spawn } from "node:child_process"
import { mkdtemp, readdir, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const workerDir = path.resolve(here, "..")
const root = path.resolve(workerDir, "..")
const remote = process.argv.includes("--remote")
const skipMedia = process.argv.includes("--skip-media")
const target = remote ? "--remote" : "--local"
const wrangler = path.join(workerDir, "node_modules/.bin/wrangler")

const { featured, more, small } = await import(path.join(root, "src/data/projects.ts"))
const { site, metrics } = await import(path.join(root, "src/data/site.ts"))
const { stack } = await import(path.join(root, "src/data/stack.ts"))
const { heroChips, principles, howModes, howSteps, problem, architecture } = await import(path.join(root, "src/data/sections.ts"))

const run = (args) =>
  new Promise((resolve, reject) => {
    const p = spawn(wrangler, args, { cwd: workerDir, stdio: ["ignore", "pipe", "pipe"] })
    let err = ""
    p.stderr.on("data", (d) => (err += d))
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`wrangler ${args.slice(0, 3).join(" ")} failed:\n${err}`))))
  })

const sql = (v) => `'${String(v).replace(/'/g, "''")}'`
const img = (i) => ({ key: `work/${i.base}`, alt: i.alt })

// ------------------------------------------------------------- projects
const rows = [
  ...featured.map((p, i) => ({ p, tier: "featured", sort: i })),
  ...more.map((p, i) => ({ p, tier: "more", sort: i })),
  ...small.map((s, i) => ({
    p: { slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name: s.name, tagline: s.what, stack: s.stack.split(" · "), cover: s.cover, features: [], highlights: [] },
    tier: "small",
    sort: i,
  })),
]
const statements = rows.map(({ p, tier, sort }) => {
  const data = {
    name: p.name,
    kind: p.kind ?? "",
    tagline: p.tagline ?? "",
    summary: p.summary ?? "",
    role: p.role ?? "",
    period: p.period ?? "",
    stack: p.stack ?? [],
    highlights: p.highlights ?? [],
    live: p.live ?? "",
    cover: img(p.cover),
    features: (p.features ?? []).map(img),
  }
  return `INSERT OR IGNORE INTO projects (slug, tier, sort, published, data) VALUES (${sql(p.slug)}, ${sql(tier)}, ${sort}, 1, ${sql(JSON.stringify(data))});`
})

// ------------------------------------------------------------- settings
const settings = {
  contact: { email: site.email, phone: site.phone.display, title: site.title, location: site.location, timezone: site.timezone, links: site.links, cv: site.cv },
  metrics,
  heroChips,
  stack,
  principles,
  howModes,
  howSteps,
  problem,
  architecture,
}
for (const [key, value] of Object.entries(settings)) {
  statements.push(`INSERT OR IGNORE INTO settings (key, value) VALUES (${sql(key)}, ${sql(JSON.stringify(value))});`)
}

// ------------------------------------------------------------- Mostaql screenshots → review drafts
const shotsDir = path.join(root, "public/assets/images/clients pic")
const shots = (await readdir(shotsDir).catch(() => [])).filter((f) => f.endsWith(".png")).sort()
const reviewKeys = shots.map((_, i) => `reviews/seed-mostaql-${i + 1}`)
reviewKeys.forEach((key, i) => {
  const data = { sourceLabel: "", clientName: "", rating: 5, text: "", projectSlug: "", reviewUrl: "", date: "", image: { key, alt: `Client review on Mostaql (${i + 1})` } }
  // One statement per draft, skipped if a review already uses this screenshot.
  statements.push(
    `INSERT INTO reviews (source, sort, published, data) SELECT 'mostaql', ${i}, 0, ${sql(JSON.stringify(data))} WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE json_extract(data, '$.image.key') = ${sql(key)});`,
  )
})

const tmp = await mkdtemp(path.join(tmpdir(), "portfolio-seed-"))
const sqlFile = path.join(tmp, "seed.sql")
await writeFile(sqlFile, statements.join("\n") + "\n")
console.log(`Database (${remote ? "remote" : "local"}): ${rows.length} projects, ${Object.keys(settings).length} settings, ${shots.length} review drafts`)
await run(["d1", "execute", "portfolio-db", target, "--file", sqlFile, "--yes"])

// ------------------------------------------------------------- media
if (!skipMedia) {
  const sharp = (await import(path.join(root, "node_modules/sharp/lib/index.js"))).default
  const uploads = []
  const workDir = path.join(root, "public/work")
  for (const f of (await readdir(workDir)).filter((f) => f.endsWith(".webp"))) uploads.push({ key: `work/${f}`, file: path.join(workDir, f) })
  for (const [i, f] of shots.entries()) {
    for (const w of [800, 1600]) {
      const out = path.join(tmp, `review-${i + 1}-${w}.webp`)
      await sharp(path.join(shotsDir, f)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 85 }).toFile(out)
      uploads.push({ key: `${reviewKeys[i]}-${w}.webp`, file: out })
    }
  }
  console.log(`Uploading ${uploads.length} files to R2 (${remote ? "remote" : "local"})…`)
  let done = 0
  const worker = async () => {
    while (uploads.length) {
      const u = uploads.shift()
      await run(["r2", "object", "put", `portfolio-images/${u.key}`, "--file", u.file, "--content-type", "image/webp", "--cache-control", "public, max-age=31536000, immutable", target])
      if (++done % 10 === 0) console.log(`  ${done} uploaded`)
    }
  }
  // Local R2 storage can't take parallel writes; the real bucket can.
  await Promise.all(Array.from({ length: remote ? 6 : 1 }, worker))
  console.log(`  ${done} uploaded`)
}
console.log("Seed finished.")
