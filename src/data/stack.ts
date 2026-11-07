export type StackItem = {
  id: string
  pill: string
  title: string
  body: string
  usedIn: string
  shape: "layers" | "grid" | "orbit" | "wave" | "stack" | "phone" | "window" | "pipeline"
}

export const stack: StackItem[] = [
  {
    id: "nestjs",
    pill: "NestJS",
    title: "Modules with clear edges",
    body: "Feature modules, Zod schemas as the single source for DTOs and Swagger, global guards that deny by default, and a consistent error envelope.",
    usedIn: "The Ride · Salam ERP · Infipeak · Orlen · El-Azhar · Bood",
    shape: "layers",
  },
  {
    id: "postgres",
    pill: "PostgreSQL + Prisma",
    title: "Schemas that carry the rules",
    body: "200+ model schemas, ledgers, soft deletes, trigram search and migrations that only run when asked. The database is where invariants live.",
    usedIn: "Salam ERP · The Ride · Orlen · El-Azhar",
    shape: "grid",
  },
  {
    id: "redis",
    pill: "Redis + BullMQ",
    title: "Work that happens later",
    body: "Scheduled trips, reminders, retries and a Redis adapter so Socket.IO scales past one process.",
    usedIn: "The Ride · Infipeak · Salam ERP",
    shape: "pipeline",
  },
  {
    id: "realtime",
    pill: "Socket.IO",
    title: "Things that happen now",
    body: "Rider–driver chat, live trip pings, kitchen displays and admin notifications, with auth on every connection.",
    usedIn: "The Ride · Infipeak · El-Azhar · QR Restaurant",
    shape: "orbit",
  },
  {
    id: "react",
    pill: "React + Next.js",
    title: "Consoles people work in all day",
    body: "Admin and operations dashboards with permission-aware navigation, TanStack Query and strict TypeScript.",
    usedIn: "The Ride dashboard · Infipeak · Orlen · Bood",
    shape: "window",
  },
  {
    id: "flutter",
    pill: "Flutter",
    title: "Apps on the road",
    body: "Driver and customer apps with BLoC, Google Maps routes, FCM, Firebase rules and store-ready release builds.",
    usedIn: "The Ride · OBEER GO",
    shape: "phone",
  },
  {
    id: "desktop",
    pill: "Electron + Tauri",
    title: "Software that works offline",
    body: "A point of sale on SQLite with typed IPC, LAN tills and outbox sync; a school ERP shipped as a desktop app with auto-update.",
    usedIn: "POS Desktop · Salam ERP",
    shape: "stack",
  },
  {
    id: "devops",
    pill: "DevOps",
    title: "Shipping without drama",
    body: "Docker, GitHub Actions, VPS with PM2/systemd and Nginx, Cloudflare Workers, Render and Firebase Hosting, plus health checks and runbooks.",
    usedIn: "Every project here",
    shape: "wave",
  },
]
