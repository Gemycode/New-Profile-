import { API_BASE } from "../lib/content"

const TOKEN_KEY = "owner-token"

export type Img = { key: string; alt: string }
export type Tier = "featured" | "more" | "small"
export type ProjectRecord = {
  id?: number
  updatedAt?: string
  slug: string
  tier: Tier
  published: boolean
  name: string
  kind: string
  tagline: string
  summary: string
  role: string
  period: string
  stack: string[]
  highlights: string[]
  live: string
  cover: Img
  features: Img[]
}
export type Source = "khamsat" | "mostaql" | "upwork" | "other"
export type ReviewRecord = {
  id?: number
  updatedAt?: string
  source: Source
  sourceLabel: string
  published: boolean
  clientName: string
  rating: number | null
  text: string
  projectSlug: string
  reviewUrl: string
  date: string
  image: Img | null
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Array<{ path: string; message: string }>,
  ) {
    super(message)
  }
}

export const session = {
  get: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (t: string) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, t)
    } catch {
      /* storage blocked: the session lasts until reload */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
  },
}

let onUnauthorized: () => void = () => {}
export const setUnauthorizedHandler = (fn: () => void) => (onUnauthorized = fn)

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = session.get()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json")
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (res.status === 204) return undefined as T
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && path !== "/auth/login") {
      session.clear()
      onUnauthorized()
    }
    throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`, body.details)
  }
  return body as T
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) })

export const api = {
  login: (email: string, password: string) => request<{ token: string; expiresAt: number }>("/auth/login", json("POST", { email, password })),
  me: () => request<{ email: string; mediaBase: string }>("/admin/me"),

  projects: () => request<Array<ProjectRecord & { id: number; sort: number }>>("/admin/projects"),
  createProject: (p: ProjectRecord) => request<ProjectRecord & { id: number }>("/admin/projects", json("POST", p)),
  updateProject: (id: number, p: ProjectRecord) => request<ProjectRecord & { id: number }>(`/admin/projects/${id}`, json("PUT", p)),
  deleteProject: (id: number) => request<void>(`/admin/projects/${id}`, { method: "DELETE" }),
  reorderProjects: (ids: number[]) => request<void>("/admin/projects/reorder", json("PATCH", { ids })),

  reviews: () => request<Array<ReviewRecord & { id: number; sort: number }>>("/admin/reviews"),
  createReview: (r: ReviewRecord) => request<ReviewRecord & { id: number }>("/admin/reviews", json("POST", r)),
  updateReview: (id: number, r: ReviewRecord) => request<ReviewRecord & { id: number }>(`/admin/reviews/${id}`, json("PUT", r)),
  deleteReview: (id: number) => request<void>(`/admin/reviews/${id}`, { method: "DELETE" }),
  reorderReviews: (ids: number[]) => request<void>("/admin/reviews/reorder", json("PATCH", { ids })),

  settings: () => request<Record<string, unknown>>("/admin/settings"),
  saveSetting: (key: string, value: unknown) => request<unknown>(`/admin/settings/${key}`, json("PUT", value)),

  uploadImage: (folder: "projects" | "reviews", w800: Blob, w1600: Blob) => {
    const form = new FormData()
    form.set("folder", folder)
    form.set("w800", new File([w800], "w800.webp", { type: "image/webp" }))
    form.set("w1600", new File([w1600], "w1600.webp", { type: "image/webp" }))
    return request<{ key: string; base: string }>("/admin/media", { method: "POST", body: form })
  },
  deleteImage: (key: string) => request<void>(`/admin/media?key=${encodeURIComponent(key)}`, { method: "DELETE" }),
  uploadCv: (file: File) => {
    const form = new FormData()
    form.set("file", file)
    return request<{ url: string }>("/admin/cv", { method: "POST", body: form })
  },
}
