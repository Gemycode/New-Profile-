// Projects delivered Nov 2025 → Nov 2026. Source of truth: PROJECTS.md (private notes, not published).
// Only public-safe facts are here: no private repository names, no client-internal details.
// Images are concept visuals generated for the portfolio, not screenshots of the live products.

export type ProjectImage = { base: string; alt: string }

export type Project = {
  slug: string
  name: string
  kind: string
  tagline: string
  summary: string
  role: string
  period: string
  stack: string[]
  highlights: string[]
  live?: string
  cover: ProjectImage
  features: ProjectImage[]
}

const img = (base: string, alt: string): ProjectImage => ({ base, alt })

export const featured: Project[] = [
  {
    slug: "the-ride",
    name: "The Ride",
    kind: "Ride-hailing platform",
    tagline: "Backend, admin console, driver app and landing page for an Uber-style product.",
    summary:
      "A complete ride-hailing product. I built the NestJS backend, the admin and operations console and the landing page on my own, wrote most of the Flutter driver app, and built the maps, routing and chat features of the customer app.",
    role: "Lead developer",
    period: "Jul → Nov 2026",
    stack: ["NestJS", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.IO", "React", "Flutter"],
    highlights: [
      "178 REST endpoints, 2 WebSocket gateways, 80+ database models",
      "Trip dispatch and offers, live location pings, scheduled trips, stuck-trip detection",
      "Wallet with a double-entry ledger, settlements, cash-commission tracking and reconciliation",
      "Paymob and Fawaterak payments with HMAC-verified webhooks",
      "Admin console with RBAC, audit trail with before/after diff, TOTP MFA and idempotent refunds",
      "Driver documents scanned with ClamAV; Sentry, Docker and readiness checks",
    ],
    cover: img("01-the-ride-cover", "The Ride customer app showing a route on a phone, next to the admin dashboard on a laptop"),
    features: [
      img("01-the-ride-feature-1", "The Ride admin console with a live trip map and a trip intelligence side panel"),
      img("01-the-ride-feature-2", "The Ride driver app showing an incoming trip offer and the earnings wallet"),
    ],
  },
  {
    slug: "salam-erp",
    name: "Salam Schools ERP",
    kind: "School ERP · web, desktop, parent portal",
    tagline: "Admissions, attendance, grades, finance, buses and HR for a private school group.",
    summary:
      "An ERP running a multi-branch private school group, plus a parent portal and public website. I'm a core backend engineer on the team and own whole modules end to end; I also shipped the ERP as a desktop app.",
    role: "Core backend engineer",
    period: "Mar → Nov 2026",
    stack: ["NestJS", "PostgreSQL", "Prisma", "Redis", "Tauri", "React"],
    highlights: [
      "683 endpoints and 219 test files in the API I co-built",
      "Owned the exams and grades (Control) module and the attendance module end to end",
      "Egyptian Tax Authority e-receipt integration: signing, submission and callbacks",
      "Online parent payments through Fawaterak (cards, valU, Fawry) with eligibility rules",
      "Bus routes, assignments and seat reservations bridged to finance; HR and hiring module",
      "Dynamic RBAC + ABAC with branch scopes and delegation; academic-year transition and legacy data import",
      "Packaged the ERP as a Tauri desktop app with auto-update",
    ],
    live: "https://salamacademy.edu.eg",
    cover: img("02-salam-academy-cover", "Salam ERP dashboard on a laptop with students, attendance and finance charts"),
    features: [
      img("02-salam-academy-feature-1", "Salam ERP grade entry table with exam approvals"),
      img("02-salam-academy-feature-2", "Salam ERP desktop app on a monitor and the parent portal on a phone"),
    ],
  },
  {
    slug: "pos-desktop",
    name: "POS Desktop",
    kind: "Offline-first point of sale",
    tagline: "A desktop POS for Egyptian shops that keeps selling with no internet.",
    summary:
      "A point of sale for supermarkets, pharmacies, clothing and electronics shops. Arabic-first, offline-first, with tax-authority e-receipts, several tills on one network and optional cloud sync. I built it alone.",
    role: "Sole developer",
    period: "Oct 2026",
    stack: ["Electron", "React", "TypeScript", "SQLite", "Drizzle", "Fastify"],
    highlights: [
      "Inventory through an append-only stock ledger with FEFO batch allocation",
      "Checkout re-prices every line in the main process and rejects changed totals",
      "Roles, 35 permissions and supervisor override with PIN; full audit log",
      "Thermal ESC/POS and A4 printing, cash drawer, Egyptian Tax Authority e-receipts",
      "LAN multi-till mode over pinned HTTPS and outbox-based cloud sync",
      "140 unit tests and 16 end-to-end tests driving the real Electron app",
    ],
    cover: img("03-pos-desktop-cover", "POS Desktop checkout screen on a monitor with a receipt printer"),
    features: [
      img("03-pos-desktop-feature-1", "POS Desktop inventory screen with batches and the stock ledger"),
      img("03-pos-desktop-feature-2", "Diagram of three POS tills linked to a main terminal over LAN and syncing to the cloud"),
    ],
  },
  {
    slug: "infipeak",
    name: "Infipeak",
    kind: "B2B consulting marketplace",
    tagline: "Companies, services, bookings and live video consultations.",
    summary:
      "A marketplace where companies list consulting services and clients book and meet them over video. I led the backend and worked across the web app.",
    role: "Lead backend + frontend",
    period: "Jan → Jul 2026",
    stack: ["NestJS", "PostgreSQL", "Prisma", "BullMQ", "Socket.IO", "LiveKit", "React"],
    highlights: [
      "195 endpoints and 3 WebSocket gateways",
      "Bookings and rescheduling with full time-zone handling",
      "Video consultations with LiveKit: provisioning, sessions, logs and reminders",
      "Google sign-in, email OTP, real-time chat, reviews, disputes and support tickets",
      "CMS for blog, FAQs, mega menu and landing pages; granular admin permissions",
    ],
    live: "https://infipeak.co",
    cover: img("06-infipeak-cover", "Infipeak marketplace home with consulting service cards on a laptop"),
    features: [
      img("06-infipeak-feature-1", "Infipeak video consultation screen with two abstract participant tiles and chat"),
      img("06-infipeak-feature-2", "Infipeak booking calendar with time slots and time-zone selectors"),
    ],
  },
  {
    slug: "orlen",
    name: "Orlen Construction",
    kind: "Company website + CMS",
    tagline: "A construction company's site, CMS and inbox, built to a 72-operation API contract.",
    summary:
      "The public website, admin CMS and inbox for Orlen Construction. I built both the NestJS API and the React frontend.",
    role: "Sole developer",
    period: "Oct → Nov 2026",
    stack: ["NestJS", "PostgreSQL", "Prisma", "Zod", "React", "Cloudflare"],
    highlights: [
      "OpenAPI contract with 72 operations; 80 endpoints and 17 test files",
      "Transactional outbox for emails and cache purges, with retries and a dead-letter state",
      "Rotating refresh cookies, Argon2id, Turnstile-protected forms",
      "Images resized to WebP with sharp, stored on S3/R2; per-page SEO for crawlers",
    ],
    live: "https://orlen-eg.com",
    cover: img("05-orlen-construction-cover", "Orlen Construction website with architecture and a projects grid on a laptop"),
    features: [
      img("05-orlen-construction-feature-1", "Orlen Construction project detail page"),
      img("05-orlen-construction-feature-2", "Orlen CMS inbox with inquiries, applications, statuses and notes"),
    ],
  },
]

export const more: Project[] = [
  {
    slug: "el-azhar",
    name: "El-Azhar Agency",
    kind: "Storefront + Arabic admin",
    tagline: "Quote-based ordering for a 214-product catalog in 11 languages.",
    summary:
      "A storefront and Arabic admin. I built the NestJS API on my own and worked on the Next.js storefront's API integration and deployment.",
    role: "Backend owner",
    period: "Oct → Nov 2026",
    stack: ["NestJS", "PostgreSQL", "Prisma", "Socket.IO", "Next.js"],
    highlights: [
      "78 endpoints, integration tests against a real disposable database",
      "Quote flow with hidden prices; guest orders linked only after WhatsApp OTP",
      "Excel import with preview, validation and commit jobs",
      "Deny-by-default auth, rotating refresh tokens, idempotency keys",
    ],
    live: "https://elazhar-agency.io",
    cover: img("04-el-azhar-agency-cover", "El-Azhar storefront product catalog on a laptop and a phone"),
    features: [
      img("04-el-azhar-agency-feature-1", "El-Azhar quote ordering flow: cart, quote, confirm"),
      img("04-el-azhar-agency-feature-2", "El-Azhar admin with an Excel import preview and an orders table"),
    ],
  },
  {
    slug: "obeer-go",
    name: "OBEER GO",
    kind: "Ride-hailing on Firebase",
    tagline: "Customer and captain apps in Flutter with a Flutter Web admin.",
    summary:
      "A Firebase-based ride-hailing product. I started the customer app and worked across the captain app and dashboard.",
    role: "Mobile developer",
    period: "Jun → Oct 2026",
    stack: ["Flutter", "Firebase", "Cloud Functions", "Google Maps"],
    highlights: [
      "Firebase security rules with validation for users and trips",
      "Nearby-captain search on the map, phone auth, FCM notifications",
      "Google Places search, Crashlytics, release builds for both stores",
    ],
    cover: img("07-obeer-go-cover", "OBEER GO customer app map with nearby cars and the captain app"),
    features: [
      img("07-obeer-go-feature-1", "OBEER GO trip request with route and price estimate"),
      img("07-obeer-go-feature-2", "OBEER GO admin with captain review and a live tracking map"),
    ],
  },
  {
    slug: "bood",
    name: "Bood",
    kind: "Marketing agency site + CMS",
    tagline: "A bilingual agency website backed by a contract-first API.",
    summary:
      "I built the NestJS API on my own and integrated it into the Next.js site, so the frontend switched from mock data to the real API with no UI changes.",
    role: "Backend owner",
    period: "Sep → Oct 2026",
    stack: ["NestJS", "PostgreSQL", "Prisma", "Docker", "Next.js"],
    highlights: [
      "95 endpoints across 14 modules: services, projects, packages, influencers, articles",
      "Docker Compose setup that migrates, seeds and runs",
      "Contact form with email notifications",
    ],
    live: "https://boood.sa",
    cover: img("08-bood-cover", "Bood agency website with bold geometric artwork on a laptop"),
    features: [
      img("08-bood-feature-1", "Bood service package cards"),
      img("08-bood-feature-2", "Bood CMS article editor with media tiles"),
    ],
  },
  {
    slug: "asd",
    name: "ASD",
    kind: "Construction company platform",
    tagline: "Service requests, portfolio, blog and real-time chat.",
    summary: "A MERN platform for a construction company, built and deployed mostly by me.",
    role: "Main developer",
    period: "Oct 2025 → Apr 2026",
    stack: ["React", "Express", "MongoDB", "Socket.IO", "Cloudinary"],
    highlights: [
      "Service requests for construction, project management and interior design",
      "Real-time chat and notifications (Socket.IO + SSE)",
      "VPS deployment with GitHub Actions for frontend and backend",
    ],
    live: "https://asd.com.sa",
    cover: img("09-asd-cover", "ASD construction website with a service request form"),
    features: [
      img("09-asd-feature-1", "ASD project portfolio gallery"),
      img("09-asd-feature-2", "ASD admin requests dashboard with chat"),
    ],
  },
  {
    slug: "arabfilmdb",
    name: "ArabFilmDB",
    kind: "Arabic films database",
    tagline: "Films and series catalog with ratings, comments and favorites.",
    summary: "I built the Express backend and most of the React frontend.",
    role: "Backend owner",
    period: "Aug 2025 → Apr 2026",
    stack: ["Express", "MongoDB", "React", "Redux Toolkit"],
    highlights: [
      "Movie and series filters, ratings, comments and favorites",
      "Profiles with photo upload, advertisements system, email contact",
    ],
    live: "https://arabfilmdb.com",
    cover: img("10-arabfilmdb-cover", "ArabFilmDB catalog with abstract posters in a dark cinematic UI"),
    features: [
      img("10-arabfilmdb-feature-1", "ArabFilmDB film detail with rating stars and comments"),
      img("10-arabfilmdb-feature-2", "ArabFilmDB filter page with genre chips and a poster grid"),
    ],
  },
  {
    slug: "qr-restaurant",
    name: "QR Restaurant System",
    kind: "Ordering + kitchen display",
    tagline: "Scan the table, order, and the kitchen sees it live.",
    summary: "A multi-restaurant ordering platform with QR tables and a real-time kitchen display. Built alone.",
    role: "Sole developer",
    period: "Jul 2025 → Jun 2026",
    stack: ["Express", "TypeScript", "MongoDB", "Socket.IO", "React"],
    highlights: [
      "QR codes for tables, menus and payments; full order lifecycle",
      "Real-time kitchen display, loyalty, discounts and analytics",
      "Roles from super admin to staff; rate limiting and rotating logs",
    ],
    cover: img("11-qr-restaurant-system-cover", "Phone with a digital menu next to a table QR stand"),
    features: [
      img("11-qr-restaurant-system-feature-1", "Kitchen display with pending, preparing and ready order cards"),
      img("11-qr-restaurant-system-feature-2", "Restaurant owner analytics dashboard"),
    ],
  },
  {
    slug: "9pta",
    name: "Nine Pyramids Travel",
    kind: "Tour booking platform",
    tagline: "Tours, bookings, customer and admin dashboards.",
    summary: "A Next.js and Firebase tour booking site with customer and admin dashboards. Built alone.",
    role: "Sole developer",
    period: "Dec 2025 → Jan 2026",
    stack: ["Next.js", "Firebase", "Cloudinary", "Resend"],
    highlights: ["Tour programs with filters and detail pages", "Bookings with confirmation emails", "Admin for trips, bookings and customers"],
    cover: img("12-9pta-cover", "Travel website with a stylized pyramids illustration"),
    features: [
      img("12-9pta-feature-1", "Tour detail page with itinerary and booking calendar"),
      img("12-9pta-feature-2", "Admin booking table with trip cards"),
    ],
  },
  {
    slug: "golden-phoenix",
    name: "Golden Phoenix Travel",
    kind: "Tours website",
    tagline: "Tour listings and detail pages in Next.js.",
    summary: "Co-developed the Next.js tours site and handled its builds and deployment.",
    role: "Co-developer",
    period: "Jan → May 2026",
    stack: ["Next.js", "Tailwind", "Nginx"],
    highlights: ["Tour listing and detail pages", "Contact form, build and deployment fixes"],
    live: "https://goldenphoenixtravel.com",
    cover: img("13-golden-phoenix-travel-cover", "Tour listings website with a gold accent"),
    features: [
      img("13-golden-phoenix-travel-feature-1", "Tour detail page with itinerary"),
      img("13-golden-phoenix-travel-feature-2", "Tours list on two phones"),
    ],
  },
  {
    slug: "steel-pipes",
    name: "Steel Pipes",
    kind: "Industrial company website",
    tagline: "17 pages of products, coating systems and industries.",
    summary: "An industrial company website with smooth scrolling and motion. Built alone.",
    role: "Sole developer",
    period: "Dec 2025 → Jan 2026",
    stack: ["React", "Framer Motion", "Lenis", "Cloudflare"],
    highlights: ["Products, coating systems, testing, oil & gas and water infrastructure pages"],
    live: "https://steelpipes.sa",
    cover: img("14-steel-pipes-cover", "Industrial website with a steel pipe render"),
    features: [
      img("14-steel-pipes-feature-1", "Products and coating systems page with pipe cross-sections"),
      img("14-steel-pipes-feature-2", "Steel Pipes website on a tablet and a phone"),
    ],
  },
]

export type SmallProject = { name: string; what: string; stack: string; cover: ProjectImage }

export const small: SmallProject[] = [
  {
    name: "NestJS base template",
    what: "My production starter (ESM, Rspack, Vitest, Zod, Prisma 7), the base of four backends above",
    stack: "NestJS",
    cover: img("s-nestjs-base-template-cover", "NestJS base template with an API panel and module diagram"),
  },
  {
    name: "Al-Amir Gallery",
    what: "Wall-art store with WhatsApp ordering and an admin",
    stack: "React · Supabase",
    cover: img("s-al-amir-gallery-cover", "Wall art storefront with framed abstract art"),
  },
  {
    name: "Robbama Café",
    what: "Self-order kiosk with card/QR payment and a barista dashboard",
    stack: "React · Zustand",
    cover: img("s-robbama-cafe-cover", "Self-order kiosk with drink categories and a barista tablet"),
  },
  {
    name: "Nasam",
    what: "Backend for articles, consultations and volunteers",
    stack: "Express · MongoDB",
    cover: img("s-nasam-cover", "Backend API diagram with articles, consultations and volunteers modules"),
  },
  {
    name: "Travel booking",
    what: "Flights and cruises booking UI with an admin",
    stack: "Next.js",
    cover: img("s-travel-booking-cover", "Flight and cruise booking UI on a laptop"),
  },
]

export const imgSrc = (base: string, w: 800 | 1600 = 800) => `/work/${base}-${w}.webp`
export const imgSrcSet = (base: string) => `${imgSrc(base, 800)} 800w, ${imgSrc(base, 1600)} 1600w`
