# SEO: how the site is set up, what to target, and how to monitor it

Site: https://eng-abdullahgamal.site · Brand: **Abdullah Gamal** (عبدالله جمال)

## How crawlers see the site

The site is a React (Vite) app, **prerendered at build time** (`scripts/prerender.mjs`):

| URL | What's in the initial HTML |
|---|---|
| `/` | The whole portfolio (all chapters, all project names, contact), a `ProfilePage` + `Person` + `WebSite` JSON-LD graph |
| `/projects/<slug>` | One case study per featured/“more” project (14): overview, what was built, technologies, screens, links to every other project, `WebPage` + `CreativeWork` + `BreadcrumbList` JSON-LD |
| `/404.html` | Served with HTTP 404 for unknown URLs, `noindex` |
| `/admin` | Empty dashboard shell, `noindex` (meta + `X-Robots-Tag`), excluded from the sitemap, disallowed in robots.txt |
| `/sitemap.xml` | Home + case studies, with image entries |

Content comes from the published API at build time, so **dashboard edits reach crawlers on the next deploy** (any push to `main`). Drafts and unpublished reviews are never prerendered (tested). The small “smaller builds” stay on the home page only: they don't have enough material for a useful page of their own.

Checks: `npm run build && npm run test:seo` (389 checks on the built HTML, served like Firebase Hosting via `scripts/serve.mjs`).

## Identity

- Canonical name: **Abdullah Gamal**. Person `@id`: `https://eng-abdullahgamal.site/#person`, the same on every page.
- `alternateName`: Abdallah Gamal, Abdullah Jamal, Abdallah Jamal, Abdullah Jamal Abdul Muttalib, عبدالله جمال, عبد الله جمال.
- Visible Arabic name (marked `lang="ar" dir="rtl"`) in the hero `<h1>` and the footer. There is no Arabic page, so there is no `hreflang`.
- `sameAs`: GitHub (`Gemycode`) and LinkedIn (`abdullah-jamal0`). **Use the same name, photo and site link on both profiles**, and add the site URL to them; that link back is what lets search engines join the profiles to this site.
- `alumniOf` (Aswan University, ITI) comes from your CV. Nothing else (employers, awards, ratings) is claimed in structured data.

## Keyword strategy

No keyword tool was available, so there are **no search volumes or difficulty scores here**; priorities are based on intent and on what the site can credibly rank for.

| Group | Queries (examples) | Target page | Priority | Intent |
|---|---|---|---|---|
| Branded (EN) | Abdullah Gamal, Abdallah Gamal, Abdullah Jamal, Abdullah Gamal developer / software engineer / portfolio | `/` | **P1** | Find this person |
| Branded (AR) | عبدالله جمال, عبد الله جمال, عبدالله جمال مبرمج, عبدالله جمال مطور برمجيات | `/` | **P1** | Find this person |
| Branded + skill | Abdullah Gamal NestJS, Abdullah Gamal backend developer, Abdullah Gamal Egypt | `/` | P1 | Verify skills |
| Case study | “Salam Schools ERP”, “POS Desktop offline Egypt”, “The Ride ride-hailing NestJS” | `/projects/<slug>` | P2 | Learn about a project |
| Long-tail technical | NestJS ride-hailing backend, offline-first POS Electron SQLite, ETA e-receipt integration NestJS, Fawaterak NestJS integration, LiveKit consultation booking NestJS | matching case study | P2 | Research / hire for a niche |
| Service + geo (EN) | freelance NestJS developer Egypt, backend developer Egypt, full stack developer Egypt | `/` | P3 (competitive) | Hire |
| Service (AR) | مطور باك اند, مبرمج NestJS, مطور برمجيات في مصر, مطور تطبيقات Flutter | `/` | P3 (competitive, English page) | Hire |

Generic terms (“backend developer”, “React developer”) are dominated by job boards and large directories; a personal site realistically ranks for **branded and long-tail** queries first. Arabic service keywords would need real Arabic content to compete; adding an Arabic page is a separate decision (see below).

## Search Console and Bing (manual, needs your accounts)

**Google Search Console**
1. Add a **Domain property** for `eng-abdullahgamal.site` and verify with the **DNS TXT record** in Cloudflare (covers http/https and all subdomains, no file to keep).
2. Sitemaps → submit `https://eng-abdullahgamal.site/sitemap.xml`.
3. URL Inspection → test `/` and two case studies → “Request indexing” for `/`.
4. Run the homepage and a case study through the **Rich Results Test** (structured data should show Person/ProfilePage, BreadcrumbList without errors).
5. Watch: Pages (indexing), Sitemaps, Core Web Vitals, Performance → filter queries containing “abdullah”, “abdallah”, “جمال”.

**Bing Webmaster Tools**
1. Sign in and **Import from Google Search Console** (fastest), or add the site and verify with a DNS CNAME/TXT in Cloudflare.
2. Submit the same sitemap; use URL Submission for `/`.
3. Bing also feeds DuckDuckGo, Yahoo and Ecosia.

**Cloudflare (recommended)**
- `www.eng-abdullahgamal.site` doesn't resolve today. Add a proxied `www` record and a Redirect Rule `www → https://eng-abdullahgamal.site/$1` (301) so people typing www land on the site.
- Cloudflare's *managed robots.txt* is prepended to the site's robots.txt. It blocks AI training crawlers (fine) but also **Baiduspider and PetalBot (search engines)**. Google and Bing are not affected. Decide whether you want those two allowed.
- Firebase still serves the same site on `my-portofolio-9d70c.web.app` / `.firebaseapp.com`; every page's canonical points to the custom domain, which is what tells Google which copy to index.

## 30 / 60 / 90 days

Everything below is a plan; no results are observed yet.

- **Days 0–30:** deploy, verify GSC + Bing, submit the sitemap, request indexing for `/`. Update GitHub and LinkedIn to link the site and use the same name/photo. Check in GSC that 15 URLs are discovered and see which get indexed; fix anything in “Why pages aren't indexed”.
- **Days 30–60:** in GSC Performance, track impressions/clicks/CTR/position for branded queries in English and Arabic. If the snippet shows the wrong text, adjust the homepage description. Add real client reviews from the dashboard (they add genuine content). Consider a short write-up per project (architecture decisions) to deepen the strongest case studies.
- **Days 60–90:** compare branded impressions month over month; check Core Web Vitals field data (needs enough Chrome traffic to appear). Decide on an Arabic landing page based on whether Arabic queries show impressions. Earn real links: GitHub profile README, LinkedIn featured section, Mostaql/Khamsat/Upwork profiles linking to the site.

## Possible next steps (not done, need your decision)

- **Arabic landing page** (`/ar`) with a real Arabic introduction, then `hreflang` between `/` and `/ar`. Worth it if Arabic queries matter beyond your name.
- **Automatic rebuild after dashboard edits** (a “Publish” button that triggers the GitHub Actions deploy), so prerendered pages update without a code push.
