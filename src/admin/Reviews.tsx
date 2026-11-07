import { useCallback, useEffect, useState } from "react"
import { ApiError, api, type ReviewRecord, type Source } from "./api"
import { confirmLeave, useToast } from "./feedback"
import { Area, ImageInput, Text, Toggle } from "./fields"
import { useEditor } from "./useEditor"
import { useReorder } from "./useReorder"
import s from "./admin.module.css"

type Row = ReviewRecord & { id: number; sort: number }
const SOURCES: Array<{ id: Source; label: string }> = [
  { id: "khamsat", label: "Khamsat (خمسات)" },
  { id: "mostaql", label: "Mostaql (مستقل)" },
  { id: "upwork", label: "Upwork" },
  { id: "other", label: "Other…" },
]
const sourceName = (r: ReviewRecord) => (r.source === "other" ? r.sourceLabel || "Other" : SOURCES.find((x) => x.id === r.source)!.label)
const errorText = (e: unknown) => (e instanceof ApiError ? e.message : "Can't reach the API. Check your connection.")

const empty = (): ReviewRecord => ({
  source: "mostaql",
  sourceLabel: "",
  published: false,
  clientName: "",
  rating: 5,
  text: "",
  projectSlug: "",
  reviewUrl: "",
  date: "",
  image: null,
})

export function Reviews({ mediaBase }: { mediaBase: string }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [editing, setEditing] = useState<ReviewRecord | null>(null)
  const [filter, setFilter] = useState<Source | "all">("all")
  const [loadError, setLoadError] = useState("")
  const [busyId, setBusyId] = useState<number | null>(null)
  const toast = useToast()

  const load = useCallback(() => {
    setLoadError("")
    return api
      .reviews()
      .then(setRows)
      .catch((e) => setLoadError(errorText(e)))
  }, [])
  useEffect(() => {
    void load()
  }, [load])
  const reorder = useReorder<Row>(async (ids) => {
    try {
      await api.reorderReviews(ids)
      toast("Order saved")
    } catch (e) {
      toast(errorText(e), "error")
    }
    await load()
  })

  if (editing)
    return (
      <ReviewEditor
        initial={editing}
        mediaBase={mediaBase}
        onClose={(saved) => {
          setEditing(null)
          if (saved) void load()
        }}
      />
    )
  if (!rows)
    return loadError ? (
      <div className={s.emptyRow}>
        <p className={s.error}>{loadError}</p>
        <button className={s.ghost} onClick={() => void load()}>
          Try again
        </button>
      </div>
    ) : (
      <p>Loading reviews…</p>
    )

  const act = async (r: Row, fn: () => Promise<unknown>, done: string) => {
    setBusyId(r.id)
    try {
      await fn()
      toast(done)
    } catch (e) {
      toast(errorText(e), "error")
    } finally {
      setBusyId(null)
      await load()
    }
  }

  const published = rows.filter((r) => r.published).length
  const list = filter === "all" ? rows : rows.filter((r) => r.source === filter)

  return (
    <section>
      <div className={s.pageHead}>
        <h1>Reviews</h1>
        <button className={s.primary} onClick={() => setEditing(empty())}>
          + New review
        </button>
      </div>
      <p className={published ? s.note : s.warn}>
        {published
          ? `${published} published. The Client reviews section is visible on the site.`
          : "No published reviews, so the Client reviews section is hidden on the site."}
      </p>
      <div className={s.tabs} role="group" aria-label="Filter by platform">
        {[{ id: "all" as const, label: "All" }, ...SOURCES].map((x) => (
          <button key={x.id} className={filter === x.id ? s.tabOn : ""} aria-pressed={filter === x.id} onClick={() => setFilter(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      {filter !== "all" && <p className={s.hint}>Switch to “All” to change the order.</p>}
      <ol className={s.list}>
        {list.map((r, i) => (
          <li key={r.id} className={`${s.item} ${busyId === r.id ? s.busy : ""}`} {...(filter === "all" ? reorder.itemProps(list, i) : {})}>
            <span className={s.handle} aria-hidden="true">
              ⋮⋮
            </span>
            {r.image ? <img src={`${mediaBase}${r.image.key}-800.webp`} alt="" className={s.thumb} loading="lazy" /> : <span className={s.thumb} />}
            <div className={s.itemText}>
              <strong dir="auto">
                {sourceName(r)}
                {r.clientName ? ` · ${r.clientName}` : ""}
                {r.rating ? ` · ${"★".repeat(r.rating)}` : ""}
              </strong>
              <span dir="auto">{r.text || (r.image ? "Screenshot only" : "No text or image yet")}</span>
            </div>
            <span className={r.published ? s.live : s.draft}>{r.published ? "Published" : "Draft"}</span>
            <div className={s.actions}>
              {filter === "all" && (
                <>
                  <button onClick={() => reorder.move(list, i, -1)} disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                  <button onClick={() => reorder.move(list, i, 1)} disabled={i === list.length - 1} aria-label="Move down">
                    ↓
                  </button>
                </>
              )}
              <button onClick={() => act(r, () => api.updateReview(r.id, { ...r, published: !r.published }), r.published ? "Review hidden" : "Review published")}>
                {r.published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => setEditing(r)}>Edit</button>
              <button
                className={s.danger}
                onClick={() => confirm("Delete this review and its screenshot? This can't be undone.") && act(r, () => api.deleteReview(r.id), "Review deleted")}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {!list.length && <li className={s.emptyRow}>No reviews here yet.</li>}
      </ol>
    </section>
  )
}

function ReviewEditor({ initial, mediaBase, onClose }: { initial: ReviewRecord; mediaBase: string; onClose: (saved: boolean) => void }) {
  const { value: r, setValue: setR, dirty, trackUpload, discardUploads } = useEditor<ReviewRecord>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const set = <K extends keyof ReviewRecord>(k: K, v: ReviewRecord[K]) => setR((x) => ({ ...x, [k]: v }))

  const cancel = async () => {
    if (!confirmLeave()) return
    await discardUploads()
    onClose(false)
  }

  const save = async () => {
    setBusy(true)
    setErrors({})
    setMessage("")
    try {
      if (initial.id) await api.updateReview(initial.id, r)
      else await api.createReview(r)
      await discardUploads([r.image?.key])
      toast(initial.id ? "Review saved" : "Review created")
      onClose(true)
    } catch (e) {
      if (e instanceof ApiError) {
        setMessage(e.status === 401 ? "Your session expired. Sign in, then press Save again." : e.message)
        setErrors(Object.fromEntries((e.details ?? []).map((d) => [d.path, d.message])))
      } else setMessage("Can't reach the API. Your changes are still here; try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={s.editor}>
      <div className={s.pageHead}>
        <h1>{initial.id ? "Edit review" : "New review"}</h1>
        {dirty && <span className={s.draft}>Unsaved changes</span>}
      </div>
      {message && (
        <p className={s.error} role="alert">
          {message}
        </p>
      )}
      <div className={s.cols}>
        <div className={s.stackForm}>
          <div className={s.row}>
            <label className={s.select}>
              Platform
              <select value={r.source} onChange={(e) => set("source", e.target.value as Source)}>
                {SOURCES.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label}
                  </option>
                ))}
              </select>
            </label>
            {r.source === "other" && <Text label="Platform name" value={r.sourceLabel} error={errors.sourceLabel} onChange={(v) => set("sourceLabel", v)} />}
          </div>
          <Toggle label="Published on the site" checked={r.published} onChange={(v) => set("published", v)} />
          <Text label="Client name" hint="Optional. Leave empty to keep it anonymous." value={r.clientName} dir="auto" error={errors.clientName} onChange={(v) => set("clientName", v)} />
          <label className={s.select}>
            Rating
            <select value={r.rating ?? ""} onChange={(e) => set("rating", e.target.value ? Number(e.target.value) : null)}>
              <option value="">No rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
          </label>
          <Area label="Review text" hint="Optional if you upload a screenshot. Arabic is fine." value={r.text} error={errors.text} onChange={(v) => set("text", v)} />
          <div className={s.row}>
            <Text label="Date" placeholder="Jul 2025" value={r.date} error={errors.date} onChange={(v) => set("date", v)} />
            <Text label="Project slug" hint="Optional, for your own reference" value={r.projectSlug} onChange={(v) => set("projectSlug", v)} />
          </div>
          <Text label="Review link" type="url" placeholder="https://mostaql.com/…" value={r.reviewUrl} error={errors.reviewUrl} onChange={(v) => set("reviewUrl", v)} />
        </div>
        <div className={s.stackForm}>
          <ImageInput label="Review screenshot" folder="reviews" mediaBase={mediaBase} value={r.image} onUploaded={trackUpload} onChange={(v) => set("image", v)} />
          {(errors["image.alt"] || errors["image.key"]) && <small className={s.error}>Screenshot: {errors["image.alt"] || errors["image.key"]}</small>}
        </div>
      </div>
      <div className={s.saveBar}>
        <button className={s.ghost} onClick={cancel} disabled={busy}>
          {dirty ? "Discard" : "Back"}
        </button>
        <button className={s.primary} onClick={save} disabled={busy}>
          {busy ? "Saving…" : initial.id ? "Save changes" : "Create review"}
        </button>
      </div>
    </section>
  )
}
