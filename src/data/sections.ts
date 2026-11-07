// Section copy that the owner dashboard can edit. These values are the built-in defaults
// (and the seed for the database); the live site prefers whatever the API returns.

// Headline lines use *asterisks* around a word to set it in italic.
export const problem = {
  titleLines: ["A school ERP", "looks like *CRUD*", "until June."],
  lead: "On paper it's students, classes and payments. In production it's a school group with several branches, hundreds of permission rules and an academic year that has to end cleanly every summer.",
  note: "I've spent this year on the backend of the Salam Schools ERP. These are the three places where systems like this break when they grow.",
  faults: [
    {
      title: "Permissions",
      body: "Ten roles become forty. Principals, accountants, bus supervisors and HR each need a different slice of the same student, and only for their branch. Fixed role checks stop working, so I moved Salam to dynamic RBAC + ABAC with scopes, grants and delegation.",
    },
    {
      title: "Time",
      body: "Every year the whole school moves up a grade. Classes, fees, bus seats and open balances all have to roll over at once, without losing last year. The year transition is validated, scheduled and snapshots the ledger before it runs.",
    },
    {
      title: "Money & legacy data",
      body: "Parents pay online through cards, valU and Fawry, receipts go to the Egyptian Tax Authority, and years of records come from an old system. Each of those needs rules that the database enforces, not the screen.",
    },
  ],
}

// The nine diagram nodes keep fixed positions in ChArchitecture; only their text is editable.
export const architectureNodeIds = ["web", "desktop", "parent", "site", "api", "pg", "redis", "pay", "eta"] as const
export type ArchNodeId = (typeof architectureNodeIds)[number]

export const architecture = {
  titleLines: ["How Salam", "is *wired*"],
  lead: "Four clients, one modular API, and two outside systems that move real money. Select any part to see what it does and which parts I built.",
  url: "api.salamacademy.edu.eg",
  counterValue: 683,
  counterLabel: "API endpoints",
  apiBoxSub: "Prisma · Swagger · Zod",
  modules: ["Control", "Attendance", "Finance", "Logistics", "HR", "Payments", "Authorization", "Admissions"],
  nodes: {
    web: { label: "ERP web", sub: "React · TanStack Query", desc: "The staff console: admissions, student files, attendance, grades, finance and reports. Pages appear or hide based on the signed-in user's effective permissions." },
    desktop: { label: "Desktop app", sub: "Tauri v2", desc: "The same ERP packaged as a desktop app with auto-update, built in CI. I set up the Tauri build and the release workflow." },
    parent: { label: "Parent portal", sub: "React · i18n", desc: "Parents follow their children, enroll them in the next stage, reserve bus seats and pay fees online." },
    site: { label: "Public site", sub: "Admissions · news", desc: "The school's public website. Registration requests from it land directly in the ERP's admissions pipeline." },
    api: { label: "NestJS API", sub: "683 endpoints · 219 test files", desc: "One modular NestJS API on Prisma. I own the Control (exams and grades), Attendance, ETA e-receipts, HR, Logistics and Payments modules, plus the legacy data import." },
    pg: { label: "PostgreSQL", sub: "Prisma 7 · 200+ models", desc: "Students, enrollments, ledgers, receipts, buses, HR and permissions. Year transitions snapshot the ledger before they run." },
    redis: { label: "Redis", sub: "Upstash", desc: "Caches each user's effective permissions and pages, with targeted invalidation when a role changes, and holds short-lived tickets for the live SSE streams." },
    pay: { label: "Fawaterak", sub: "Cards · valU · Fawry", desc: "Online parent payments. The API checks eligibility (bus reservation, installment, purpose) before it creates a payment, then settles it into the ledger." },
    eta: { label: "Tax Authority", sub: "ETA e-receipts", desc: "Every receipt is signed and submitted to the Egyptian Tax Authority. The API handles the callbacks and keeps the receipt chain state." },
  } as Record<ArchNodeId, { label: string; sub: string; desc: string }>,
}

export type ProblemContent = typeof problem
export type ArchitectureContent = typeof architecture

export const heroChips =["NestJS", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.IO", "Flutter", "React"]

export const principles = [
  {
    title: "Money is a ledger, not a column.",
    body: "Wallets, settlements and refunds in The Ride are double-entry ledger lines, and POS stock moves only through an append-only ledger. Balances are something you can rebuild, never something you overwrite.",
    where: "The Ride · POS Desktop",
  },
  {
    title: "Write the side effect in the same transaction.",
    body: "Emails, cache purges and sync events go into an outbox table inside the same database transaction, then a worker delivers them with retries and a dead-letter state. Nothing gets lost between commit and send.",
    where: "Orlen · The Ride · POS Desktop",
  },
  {
    title: "Anything a person can double-click must be idempotent.",
    body: "Trip requests, refunds and order commits carry idempotency keys. A retry or a nervous click can't charge twice.",
    where: "The Ride · El-Azhar",
  },
  {
    title: "Deny by default.",
    body: "Every route needs a token unless it is explicitly public. Roles are read from the database on each request, so a demotion takes effect immediately.",
    where: "El-Azhar",
  },
  {
    title: "Offline is a feature.",
    body: "A shop can't stop selling because the internet dropped. The POS keeps its own database and syncs when the connection comes back.",
    where: "POS Desktop",
  },
]

export const howModes = [
  { title: "Remote, full-time", body: "Backend or full-stack roles on a product team. I'm comfortable owning modules end to end." },
  { title: "Freelance projects", body: "APIs, admin consoles, mobile apps or a complete product, from the contract to the deploy." },
  { title: "Technical rescue", body: "A backend that's slow, insecure or hard to change: audit first, then fix it in small, tested steps." },
]

export const howSteps = [
  { t: "Contract first", b: "An API contract or OpenAPI spec the frontend and backend both build against." },
  { t: "Small slices", b: "Features shipped in phases, each one deployable and reviewed." },
  { t: "Tests and CI", b: "Unit and integration tests, typechecks and automated deploys." },
  { t: "Handover", b: "READMEs, runbooks and environment templates so the next person isn't guessing." },
]
