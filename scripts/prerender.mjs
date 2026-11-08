// Prerenders the public pages after `vite build` so crawlers get real HTML:
//   /                    home (full portfolio)
//   /projects/<slug>     one case study per featured/"more" project
//   /404.html            not-found page (noindex, served with HTTP 404 by Firebase)
//   /admin.html          empty dashboard shell (noindex)
// and writes sitemap.xml. Content comes from the published API when it's reachable at build
// time (so dashboard edits reach crawlers on the next deploy), otherwise from the built-in data.
//
// Env: VITE_API_BASE (default https://api.eng-abdullahgamal.site, "" = built-in content only)
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

const ORIGIN = "https://eng-abdullahgamal.site"
const DIST = path.resolve("dist")
const PERSON_ID = `${ORIGIN}/#person`
const WEBSITE_ID = `${ORIGIN}/#website`
// Verified identity data. Only add facts that are true and publicly confirmable.
const ARABIC_NAME = "عبدالله جمال"
const ALT_NAMES = ["Abdallah Gamal", "Abdullah Jamal", "Abdallah Jamal", "Abdullah Jamal Abdul Muttalib", ARABIC_NAME, "عبد الله جمال"]

const ssr = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href)
const template = await readFile(path.join(DIST, "index.html"), "utf8")

// ------------------------------------------------------------- content
const API = process.env.VITE_API_BASE ?? "https://api.eng-abdullahgamal.site"
let content = ssr.staticContent
let source = "built-in content"
if (API) {
  try {
    const res = await fetch(`${API}/content`, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    content = ssr.merge(await res.json())
    source = `published content from ${API}`
  } catch (e) {
    console.warn(`prerender: API not reachable (${e.message}); using built-in content`)
  }
}

// ------------------------------------------------------------- helpers
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const json = (v) => JSON.stringify(v).replace(/</g, "\\u003c") // safe inside <script>
const abs = (u) => (/^https?:\/\//.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? "" : "/"}${u}`)
const imgUrl = (base, w = 1600) => abs(ssr.imgSrc(base, w))
const clip = (s, max) => {
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:·—-]\s*$/, "")}…`
}
const c = content.contact
const knowsAbout = [...new Set(["NestJS", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.IO", "REST APIs", "React", "Next.js", "Flutter", "Electron", "Tauri", "Cloudflare Workers", "Docker"])]

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: c.name,
  alternateName: ALT_NAMES,
  url: `${ORIGIN}/`,
  image: { "@type": "ImageObject", url: `${ORIGIN}/img/abdullah.webp`, width: 720, height: 720 },
  jobTitle: c.title,
  description: `${c.name} (${ARABIC_NAME}) is a ${c.title.toLowerCase()} based in ${c.location}, building backend APIs, admin dashboards, web apps and Flutter mobile apps with NestJS, Node.js, PostgreSQL, React and Flutter.`,
  email: `mailto:${c.email}`,
  address: { "@type": "PostalAddress", addressCountry: "EG" },
  knowsLanguage: ["en", "ar"],
  knowsAbout,
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Aswan University" },
    { "@type": "EducationalOrganization", name: "Information Technology Institute (ITI)" },
  ],
  sameAs: c.links.map((l) => l.href),
}
const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${ORIGIN}/`,
  name: c.name,
  alternateName: [`${c.name} Portfolio`, ARABIC_NAME],
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
}

function head({ title, description, canonical, ogType = "website", image, imageAlt, imageW, imageH, robots = "index, follow, max-image-preview:large", graph }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    canonical ? `<link rel="canonical" href="${canonical}" />` : "",
    `<meta property="og:site_name" content="${esc(c.name)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:locale" content="en_US" />`,
    canonical ? `<meta property="og:url" content="${canonical}" />` : "",
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    image ? `<meta property="og:image" content="${image}" />` : "",
    image ? `<meta property="og:image:width" content="${imageW}" />` : "",
    image ? `<meta property="og:image:height" content="${imageH}" />` : "",
    image ? `<meta property="og:image:alt" content="${esc(imageAlt)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    image ? `<meta name="twitter:image" content="${image}" />` : "",
    image ? `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />` : "",
    graph ? `<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": graph })}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n    ")
}

function page({ seo, body, keepBoot = false, embed = true }) {
  let html = template.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, seo)
  if (!keepBoot) html = html.replace(/<!--boot-->[\s\S]*?<!--\/boot-->/, "")
  const data = embed ? `<script type="application/json" id="__content">${json(content)}</script>` : ""
  return html.replace("<!--app-->", body).replace('<div id="root">', `${data}<div id="root">`)
}

async function write(rel, html) {
  const file = path.join(DIST, rel)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, html)
}

// ------------------------------------------------------------- home
const homeTitle = `${c.name} | Backend & Full-Stack Software Engineer`
const homeDescription = `${c.name} (${ARABIC_NAME}) is a backend-focused full-stack engineer in ${c.location} building NestJS, Node.js, React and Flutter systems: ERPs, ride-hailing apps and POS.`
const studies = ssr.caseStudies(content)
await write(
  "index.html",
  page({
    keepBoot: true,
    seo: head({
      title: homeTitle,
      description: homeDescription,
      canonical: `${ORIGIN}/`,
      image: `${ORIGIN}/og.png`,
      imageAlt: `${c.name}, ${c.title}`,
      imageW: 1200,
      imageH: 630,
      graph: [
        website,
        person,
        {
          "@type": "ProfilePage",
          "@id": `${ORIGIN}/#profilepage`,
          url: `${ORIGIN}/`,
          name: homeTitle,
          description: homeDescription,
          inLanguage: "en",
          isPartOf: { "@id": WEBSITE_ID },
          about: { "@id": PERSON_ID },
          mainEntity: { "@id": PERSON_ID },
          primaryImageOfPage: { "@type": "ImageObject", url: `${ORIGIN}/og.png`, width: 1200, height: 630 },
          hasPart: studies.map((p) => ({ "@id": `${ORIGIN}/projects/${p.slug}#project` })),
        },
      ],
    }),
    // With JavaScript, the home page shows the loading screen and React renders the page; the
    // prerendered copy stays in the HTML for crawlers but isn't laid out, painted or allowed to
    // start image downloads (it would compete with the first paint). Without JavaScript it shows.
    body: `<div class="ssr-home">${ssr.render("/", content)}</div>`,
  }),
)

// ------------------------------------------------------------- case studies
for (const p of studies) {
  const url = `${ORIGIN}/projects/${p.slug}`
  const long = `${p.name}: ${p.kind} | ${c.name}`
  const title = long.length <= 65 ? long : `${p.name} case study | ${c.name}`
  // States the actual role (several projects were team efforts), then the stack.
  const description = clip(`${p.tagline} ${c.name}'s role: ${p.role.toLowerCase()}. Stack: ${p.stack.slice(0, 4).join(", ")}.`, 170)
  const images = [p.cover, ...p.features].map((i) => ({ "@type": "ImageObject", url: imgUrl(i.base), width: 1600, height: 1000, caption: i.alt }))
  await write(
    `projects/${p.slug}.html`,
    page({
      seo: head({
        title,
        description,
        canonical: url,
        ogType: "article",
        image: imgUrl(p.cover.base),
        imageAlt: p.cover.alt,
        imageW: 1600,
        imageH: 1000,
        graph: [
          website,
          person, // the same entity and @id on every page
          {
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: title,
            description,
            inLanguage: "en",
            isPartOf: { "@id": WEBSITE_ID },
            about: { "@id": `${url}#project` },
            primaryImageOfPage: images[0],
            breadcrumb: { "@id": `${url}#breadcrumb` },
            author: { "@id": PERSON_ID },
          },
          {
            "@type": "CreativeWork",
            "@id": `${url}#project`,
            name: p.name,
            headline: p.tagline,
            description: p.summary,
            genre: p.kind,
            keywords: p.stack.join(", "),
            image: images,
            // "contributor", not "author": several of these were team projects (see the role).
            contributor: { "@id": PERSON_ID },
            ...(p.live ? { sameAs: p.live } : {}),
            mainEntityOfPage: { "@id": `${url}#webpage` },
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: c.name, item: `${ORIGIN}/` },
              { "@type": "ListItem", position: 2, name: p.name, item: url },
            ],
          },
        ],
      }),
      body: ssr.render(`/projects/${p.slug}`, content),
    }),
  )
}

// ------------------------------------------------------------- 404 + admin shell
await write(
  "404.html",
  page({
    seo: head({ title: `Page not found | ${c.name}`, description: `This page doesn't exist. Visit ${c.name}'s portfolio for projects and contact details.`, robots: "noindex, follow" }),
    body: ssr.render("/404", content),
  }),
)
await write(
  "admin.html",
  // No inline script here: the dashboard's CSP only allows scripts from the site's own files.
  page({ embed: false, seo: `<title>Dashboard · ${esc(c.name)}</title>\n    <meta name="robots" content="noindex, nofollow" />`, body: "" }).replace(/<!--jsflag-->[\s\S]*?<!--\/jsflag-->/, ""),
)

// ------------------------------------------------------------- sitemap (with images)
const urlEntry = (loc, images) =>
  [
    "  <url>",
    `    <loc>${loc}</loc>`,
    ...images.map((i) => `    <image:image><image:loc>${esc(i)}</image:loc></image:image>`),
    "  </url>",
  ].join("\n")
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  urlEntry(`${ORIGIN}/`, [`${ORIGIN}/og.png`, `${ORIGIN}/img/abdullah.webp`, ...studies.map((p) => imgUrl(p.cover.base))]),
  ...studies.map((p) => urlEntry(`${ORIGIN}/projects/${p.slug}`, [p.cover, ...p.features].map((i) => imgUrl(i.base)))),
  "</urlset>",
  "",
].join("\n")
await writeFile(path.join(DIST, "sitemap.xml"), sitemap)

console.log(`prerender: home, ${studies.length} case studies, 404, admin shell and sitemap from ${source}`)
