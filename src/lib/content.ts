import { useEffect, useState } from "react"
import { featured, more, small, type Project, type ProjectImage, type SmallProject } from "../data/projects"
import { architecture, heroChips, howModes, howSteps, principles, problem, type ArchitectureContent, type ProblemContent } from "../data/sections"
import { metrics, site } from "../data/site"
import { stack, type StackItem } from "../data/stack"

export type ReviewSource = "khamsat" | "mostaql" | "upwork" | "other"
export type Review = {
  id: number
  source: ReviewSource
  sourceLabel: string
  clientName: string
  rating: number | null
  text: string
  reviewUrl: string
  date: string
  image: ProjectImage | null
}

export type Contact = {
  name: string
  fullName: string
  title: string
  location: string
  timezone: string
  email: string
  phone: string
  cv: string
  links: ReadonlyArray<{ label: string; href: string }>
}

export type Content = {
  featured: Project[]
  more: Project[]
  small: SmallProject[]
  reviews: Review[]
  contact: Contact
  metrics: ReadonlyArray<{ value: number; label: string; note: string }>
  heroChips: string[]
  stack: StackItem[]
  principles: Array<{ title: string; body: string; where: string }>
  howModes: Array<{ title: string; body: string }>
  howSteps: Array<{ t: string; b: string }>
  problem: ProblemContent
  architecture: ArchitectureContent
}

/** Built-in content: shown first, and kept if the API can't be reached. */
export const staticContent: Content = {
  featured,
  more,
  small,
  reviews: [],
  contact: {
    name: site.name,
    fullName: site.fullName,
    title: site.title,
    location: site.location,
    timezone: site.timezone,
    email: site.email,
    phone: site.phone.display,
    cv: site.cv,
    links: site.links,
  },
  metrics,
  heroChips,
  stack,
  principles,
  howModes,
  howSteps,
  problem,
  architecture,
}

// Empty string disables the API. `import.meta.env` is undefined when this module runs in the prerender step under Node.
export const API_BASE: string = import.meta.env?.VITE_API_BASE ?? "https://api.eng-abdullahgamal.site"

type ApiProject = Project & { tier: string }
export type ApiContent = {
  projects: { featured: ApiProject[]; more: ApiProject[]; small: ApiProject[] }
  reviews: Review[]
  settings: Partial<Pick<Content, "metrics" | "heroChips" | "stack" | "principles" | "howModes" | "howSteps" | "problem" | "architecture">> & {
    contact?: Omit<Contact, "name" | "fullName">
  }
}

/** Turns the API response into site content; anything the API doesn't have keeps its built-in value. */
export function merge(api: ApiContent): Content {
  const s = api.settings ?? {}
  const pick = <T,>(list: T[] | undefined, fallback: T[]) => (list && list.length ? list : fallback)
  return {
    featured: pick(api.projects?.featured, staticContent.featured),
    more: pick(api.projects?.more, staticContent.more),
    small: pick(
      api.projects?.small?.map((p) => ({ name: p.name, what: p.tagline, stack: p.stack.join(" · "), cover: p.cover })),
      staticContent.small,
    ),
    reviews: api.reviews ?? [],
    contact: s.contact ? { ...staticContent.contact, ...s.contact } : staticContent.contact,
    metrics: s.metrics?.length === 4 ? s.metrics : staticContent.metrics,
    heroChips: pick(s.heroChips, staticContent.heroChips),
    stack: pick(s.stack, staticContent.stack),
    principles: pick(s.principles, staticContent.principles),
    howModes: pick(s.howModes, staticContent.howModes),
    howSteps: pick(s.howSteps, staticContent.howSteps),
    problem: s.problem?.faults?.length ? s.problem : staticContent.problem,
    // Merge node by node so the diagram always has all nine nodes.
    architecture: s.architecture
      ? { ...s.architecture, nodes: { ...staticContent.architecture.nodes, ...s.architecture.nodes } }
      : staticContent.architecture,
  }
}

/**
 * Starts with `initial` (the content the page was prerendered with, or the built-in content),
 * then swaps in the published content from the API.
 */
export function useContent(initial: Content = staticContent): Content {
  const [content, setContent] = useState<Content>(initial)
  useEffect(() => {
    if (!API_BASE) return
    const ctrl = new AbortController()
    const load = () =>
      fetch(`${API_BASE}/content`, { signal: ctrl.signal })
        .then((r) => (r.ok ? (r.json() as Promise<ApiContent>) : Promise.reject(new Error(String(r.status)))))
        .then((api) => setContent(merge(api)))
        .catch(() => {
          /* offline or API down: keep the built-in content */
        })
    // The built-in content paints first; fetch the live copy once the page has loaded and the
    // main thread is idle, so it never competes with fonts, scripts or the hero.
    let idle = 0
    const hasIdle = typeof window.requestIdleCallback === "function"
    const schedule = () => {
      idle = hasIdle ? window.requestIdleCallback(load, { timeout: 2000 }) : window.setTimeout(load, 200)
    }
    if (document.readyState === "complete") schedule()
    else window.addEventListener("load", schedule, { once: true })
    return () => {
      ctrl.abort()
      window.removeEventListener("load", schedule)
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])
  return content
}

/** "+20 102 835 8352" -> "tel:+201028358352" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`
