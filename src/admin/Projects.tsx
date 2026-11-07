import { useCallback, useEffect, useState } from "react"
import { ApiError, api, type ProjectRecord, type Tier } from "./api"
import { confirmLeave, useToast } from "./feedback"
import { Area, Chips, ImageInput, Lines, Text, Toggle } from "./fields"
import { useEditor } from "./useEditor"
import { useReorder } from "./useReorder"
import s from "./admin.module.css"

type Row = ProjectRecord & { id: number; sort: number }
const TIERS: Array<{ id: Tier; label: string; hint: string }> = [
  { id: "featured", label: "Featured (numbered rows)", hint: "Numbered rows 01, 02, … at the top of Selected work. Five reads best." },
  { id: "more", label: "More shipped this year (grid)", hint: "Cards in the grid under the numbered rows." },
  { id: "small", label: "Smaller builds", hint: "Compact cards: name, tagline and stack." },
]

const empty = (tier: Tier): ProjectRecord => ({
  slug: "",
  tier,
  published: false,
  name: "",
  kind: "",
  tagline: "",
  summary: "",
  role: "",
  period: "",
  stack: [],
  highlights: [],
  live: "",
  cover: { key: "", alt: "" },
  features: [],
})

const errorText = (e: unknown) => (e instanceof ApiError ? e.message : "Can't reach the API. Check your connection.")

export function Projects({ mediaBase }: { mediaBase: string }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [editing, setEditing] = useState<ProjectRecord | null>(null)
  const [loadError, setLoadError] = useState("")
  const [busyId, setBusyId] = useState<number | null>(null)
  const toast = useToast()

  const load = useCallback(() => {
    setLoadError("")
    return api
      .projects()
      .then(setRows)
      .catch((e) => setLoadError(errorText(e)))
  }, [])
  useEffect(() => {
    void load()
  }, [load])

  const reorder = useReorder<Row>(async (ids) => {
    try {
      await api.reorderProjects(ids)
      toast("Order saved")
    } catch (e) {
      toast(errorText(e), "error")
    }
    await load()
  })

  if (editing)
    return (
      <ProjectEditor
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
      <p>Loading projects…</p>
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

  return (
    <section>
      <div className={s.pageHead}>
        <h1>Projects</h1>
        <button className={s.primary} onClick={() => setEditing(empty("featured"))}>
          + New project
        </button>
      </div>
      <p className={s.note}>
        {rows.filter((r) => r.published).length} of {rows.length} published. Drag rows or use ↑ ↓ to change the order on the site.
      </p>
      {TIERS.map((t) => {
        const list = rows.filter((r) => r.tier === t.id)
        return (
          <div key={t.id} className={s.group}>
            <h2>
              {t.label} <span>{list.length}</span>
            </h2>
            <p className={s.hint}>{t.hint}</p>
            <ol className={s.list}>
              {list.map((r, i) => (
                <li key={r.id} className={`${s.item} ${busyId === r.id ? s.busy : ""}`} {...reorder.itemProps(list, i)}>
                  <span className={s.handle} aria-hidden="true">
                    ⋮⋮
                  </span>
                  <img src={`${mediaBase}${r.cover.key}-800.webp`} alt="" className={s.thumb} loading="lazy" />
                  <div className={s.itemText}>
                    <strong>{r.name}</strong>
                    <span>{r.kind || r.tagline}</span>
                  </div>
                  <span className={r.published ? s.live : s.draft}>{r.published ? "Published" : "Draft"}</span>
                  <div className={s.actions}>
                    <button onClick={() => reorder.move(list, i, -1)} disabled={i === 0} aria-label={`Move ${r.name} up`}>
                      ↑
                    </button>
                    <button onClick={() => reorder.move(list, i, 1)} disabled={i === list.length - 1} aria-label={`Move ${r.name} down`}>
                      ↓
                    </button>
                    <button onClick={() => act(r, () => api.updateProject(r.id, { ...r, published: !r.published }), r.published ? `“${r.name}” hidden` : `“${r.name}” published`)}>
                      {r.published ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => setEditing(r)}>Edit</button>
                    <button
                      className={s.danger}
                      onClick={() =>
                        confirm(`Delete “${r.name}”? Its uploaded images are deleted too. This can't be undone.`) &&
                        act(r, () => api.deleteProject(r.id), `“${r.name}” deleted`)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {!list.length && <li className={s.emptyRow}>Nothing here yet.</li>}
            </ol>
          </div>
        )
      })}
    </section>
  )
}

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

function ProjectEditor({ initial, mediaBase, onClose }: { initial: ProjectRecord; mediaBase: string; onClose: (saved: boolean) => void }) {
  const { value: p, setValue: setP, dirty, trackUpload, discardUploads } = useEditor<ProjectRecord>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const set = <K extends keyof ProjectRecord>(k: K, v: ProjectRecord[K]) => setP((x) => ({ ...x, [k]: v }))
  const isNew = !initial.id

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
      if (!p.cover.key) throw new ApiError(400, "Upload a cover image first", [{ path: "cover", message: "Upload a cover image" }])
      const payload = { ...p, features: p.features.filter((f) => f.key) } // skip empty image slots
      if (initial.id) await api.updateProject(initial.id, payload)
      else await api.createProject(payload)
      await discardUploads([payload.cover.key, ...payload.features.map((f) => f.key)])
      toast(isNew ? `“${p.name}” created` : `“${p.name}” saved`)
      setP(payload)
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
        <h1>{isNew ? "New project" : `Edit · ${initial.name}`}</h1>
        {dirty && <span className={s.draft}>Unsaved changes</span>}
      </div>
      {message && (
        <p className={s.error} role="alert">
          {message}
        </p>
      )}

      <div className={s.cols}>
        <div className={s.stackForm}>
          <Text label="Name" value={p.name} error={errors.name} onChange={(v) => setP((x) => ({ ...x, name: v, slug: isNew && (!x.slug || x.slug === slugify(x.name)) ? slugify(v) : x.slug }))} />
          <Text label="Slug" hint="Used in links. Lowercase letters, numbers and dashes." value={p.slug} error={errors.slug} onChange={(v) => set("slug", v)} />
          <div className={s.row}>
            <label className={s.select}>
              Section
              <select value={p.tier} onChange={(e) => set("tier", e.target.value as Tier)}>
                {TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <Toggle label="Published on the site" checked={p.published} onChange={(v) => set("published", v)} />
          </div>
          <Text label="Kind" hint="e.g. Ride-hailing platform" value={p.kind} error={errors.kind} onChange={(v) => set("kind", v)} />
          <Text label="Tagline" hint="One sentence shown on cards and at the top of the details." value={p.tagline} error={errors.tagline} onChange={(v) => set("tagline", v)} />
          <Area label="Summary" value={p.summary} error={errors.summary} onChange={(v) => set("summary", v)} />
          <div className={s.row}>
            <Text label="Role" value={p.role} error={errors.role} onChange={(v) => set("role", v)} />
            <Text label="Period" hint="e.g. Jul → Nov 2026" value={p.period} error={errors.period} onChange={(v) => set("period", v)} />
          </div>
          <Text label="Live URL" type="url" placeholder="https://" value={p.live} error={errors.live} onChange={(v) => set("live", v)} />
          <Chips label="Stack" value={p.stack} onChange={(v) => set("stack", v)} />
          <Lines label="Highlights" value={p.highlights} onChange={(v) => set("highlights", v)} />
        </div>

        <div className={s.stackForm}>
          <ImageInput label="Cover" required folder="projects" mediaBase={mediaBase} value={p.cover.key ? p.cover : null} onUploaded={trackUpload} onChange={(v) => v && set("cover", v)} />
          {(errors.cover || errors["cover.alt"] || errors["cover.key"]) && <small className={s.error}>Cover: {errors.cover || errors["cover.alt"] || errors["cover.key"]}</small>}
          {p.features.map((f, i) => (
            <ImageInput
              key={f.key || `slot-${i}`}
              label={`Feature image ${i + 1}`}
              folder="projects"
              mediaBase={mediaBase}
              value={f.key ? f : null}
              onUploaded={trackUpload}
              onChange={(v) => set("features", v ? p.features.map((x, j) => (j === i ? v : x)) : p.features.filter((_, j) => j !== i))}
            />
          ))}
          {Object.entries(errors)
            .filter(([k]) => k.startsWith("features"))
            .map(([k, m]) => (
              <small key={k} className={s.error}>
                Feature image {Number(k.split(".")[1]) + 1}: {m}
              </small>
            ))}
          {p.features.length < 6 && (
            <button type="button" className={s.ghost} onClick={() => set("features", [...p.features, { key: "", alt: "" }])}>
              + Add feature image
            </button>
          )}
        </div>
      </div>

      <div className={s.saveBar}>
        <button className={s.ghost} onClick={cancel} disabled={busy}>
          {dirty ? "Discard" : "Back"}
        </button>
        <button className={s.primary} onClick={save} disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create project" : "Save changes"}
        </button>
      </div>
    </section>
  )
}
