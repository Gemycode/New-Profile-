import { z } from "zod"

const text = (max: number) => z.string().trim().max(max)
const shortList = z.array(z.string().trim().min(1).max(200)).max(30)

/**
 * http(s) URLs only. z.string().url() also accepts `javascript:` and `data:` URLs, which would
 * run script when a visitor clicks a link rendered from saved content.
 */
const httpUrl = (max = 400) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => /^https?:\/\//i.test(v) && URL.canParse(v), "Use a full http(s) URL")

const optionalHttpUrl = (max = 400) => z.union([z.literal(""), httpUrl(max)]).default("")

/** A site path ("/file.pdf", not protocol-relative "//host") or an http(s) URL. */
const pathOrHttpUrl = z
  .string()
  .trim()
  .max(400)
  .refine((v) => (v.startsWith("/") && !v.startsWith("//")) || (/^https?:\/\//i.test(v) && URL.canParse(v)), "Use a site path (/file.pdf) or an http(s) URL")

// Uploaded image. `key` is the R2 key without the size suffix: files live at `${key}-800.webp` and `${key}-1600.webp`.
// Only our own key shapes are accepted, so saved content can't point at arbitrary objects.
const imageKey = z
  .string()
  .max(200)
  .regex(/^(work\/[a-z0-9-]+|projects\/[0-9a-f-]{36}|reviews\/([0-9a-f-]{36}|seed-[a-z]+-\d+))$/, "Upload the image again")

export const imageSchema = z.object({
  key: imageKey,
  alt: z.string().trim().min(3, "Alt text is required").max(300),
})

export const projectInput = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  tier: z.enum(["featured", "more", "small"]),
  published: z.boolean().default(false),
  name: text(80).min(1, "Name is required"),
  kind: text(120).default(""),
  tagline: text(300).default(""),
  summary: text(2000).default(""),
  role: text(80).default(""),
  period: text(60).default(""),
  stack: shortList.default([]),
  highlights: shortList.default([]),
  live: optionalHttpUrl(300),
  cover: imageSchema,
  features: z.array(imageSchema).max(6).default([]),
})
export type ProjectInput = z.infer<typeof projectInput>

export const reviewSources = ["khamsat", "mostaql", "upwork", "other"] as const

export const reviewInput = z
  .object({
    source: z.enum(reviewSources),
    sourceLabel: text(40).default(""), // shown when source is "other"
    published: z.boolean().default(false),
    clientName: text(80).default(""),
    rating: z.number().int().min(1).max(5).nullable().default(null),
    text: text(1500).default(""),
    projectSlug: text(60).default(""),
    reviewUrl: optionalHttpUrl(),
    date: text(20).default(""),
    image: imageSchema.nullable().default(null),
  })
  .refine((r) => r.image || r.text, { message: "Add a screenshot or the review text", path: ["text"] })
  .refine((r) => r.source !== "other" || r.sourceLabel, { message: "Name the platform", path: ["sourceLabel"] })
export type ReviewInput = z.infer<typeof reviewInput>

export const reorderInput = z.object({ ids: z.array(z.number().int().positive()).min(1).max(500) })

// Headline lines; *word* is rendered in italic.
const titleLines = z.array(text(40).min(1)).min(1).max(4)

// Editable site settings. Each key is stored as its own row.
const link = z.object({ label: text(40).min(1), href: httpUrl(300) })
const archNode = z.object({
  // Short limits: these strings are drawn inside fixed-size SVG boxes.
  label: text(18).min(1),
  sub: text(32).default(""),
  desc: text(400).min(1),
})

export const settingsSchemas = {
  contact: z.object({
    email: z.string().trim().email().max(120),
    phone: text(40).default(""),
    title: text(80).min(1),
    location: text(60).default(""),
    timezone: text(60).default(""),
    links: z.array(link).max(10),
    cv: pathOrHttpUrl,
  }),
  metrics: z
    .array(z.object({ value: z.number().int().min(0).max(1_000_000), label: text(40).min(1), note: text(80).default("") }))
    .length(4),
  heroChips: z.array(text(30).min(1)).max(12),
  stack: z
    .array(
      z.object({
        id: text(30).min(1),
        pill: text(30).min(1),
        title: text(80).min(1),
        body: text(500).min(1),
        usedIn: text(200).default(""),
        shape: z.enum(["layers", "grid", "orbit", "wave", "stack", "phone", "window", "pipeline"]),
      }),
    )
    .min(1)
    .max(12)
    .refine((list) => new Set(list.map((s) => s.id)).size === list.length, "Each technology needs a unique id"),
  principles: z
    .array(z.object({ title: text(120).min(1), body: text(600).min(1), where: text(120).default("") }))
    .min(1)
    .max(10),
  howModes: z.array(z.object({ title: text(60).min(1), body: text(300).min(1) })).min(1).max(6),
  howSteps: z.array(z.object({ t: text(60).min(1), b: text(300).min(1) })).min(1).max(6),
  problem: z.object({
    titleLines,
    lead: text(500).min(1),
    note: text(400).default(""),
    faults: z.array(z.object({ title: text(60).min(1), body: text(600).min(1) })).min(1).max(3),
  }),
  architecture: z.object({
    titleLines,
    lead: text(400).min(1),
    url: text(40).default(""),
    counterValue: z.number().int().min(0).max(99_999),
    counterLabel: text(30).default(""),
    apiBoxSub: text(32).default(""),
    modules: z.array(text(13).min(1)).min(1).max(8),
    nodes: z.object({
      web: archNode,
      desktop: archNode,
      parent: archNode,
      site: archNode,
      api: archNode,
      pg: archNode,
      redis: archNode,
      pay: archNode,
      eta: archNode,
    }),
  }),
} as const
export type SettingsKey = keyof typeof settingsSchemas
export const settingsKeys = Object.keys(settingsSchemas) as SettingsKey[]
