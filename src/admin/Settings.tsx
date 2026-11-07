import { useEffect, useRef, useState, type ReactNode } from "react"
import { architectureNodeIds, type ArchNodeId } from "../data/sections"
import { staticContent } from "../lib/content"
import { ApiError, api } from "./api"
import { useToast, useUnsavedGuard } from "./feedback"
import { Area, Chips, Lines, Text } from "./fields"
import s from "./admin.module.css"

type FieldDef = { key: string; label: string; type?: "text" | "area" | "number" | "select"; options?: string[]; max?: number }
type Obj = Record<string, string | number>

const NODE_PLACES: Record<ArchNodeId, string> = {
  web: "Left 1 (client)",
  desktop: "Left 2 (client)",
  parent: "Left 3 (client)",
  site: "Left 4 (client)",
  api: "Center (API box)",
  pg: "Right 1 (data)",
  redis: "Right 2 (data)",
  pay: "Right 3 (integration)",
  eta: "Right 4 (integration)",
}

const defaults = () => {
  const c = staticContent.contact
  return structuredClone({
    contact: { email: c.email, phone: c.phone, title: c.title, location: c.location, timezone: c.timezone, links: [...c.links], cv: c.cv },
    metrics: staticContent.metrics.map((m) => ({ ...m })),
    heroChips: staticContent.heroChips,
    problem: staticContent.problem,
    architecture: staticContent.architecture,
    stack: staticContent.stack,
    principles: staticContent.principles,
    howModes: staticContent.howModes,
    howSteps: staticContent.howSteps,
  })
}
type All = ReturnType<typeof defaults>
type Key = keyof All

export function Settings() {
  const [data, setData] = useState<All | null>(null)
  const [saved, setSaved] = useState<All | null>(null)
  const [stored, setStored] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")

  const load = () => {
    setError("")
    api
      .settings()
      .then((fromApi) => {
        const merged = { ...defaults(), ...(fromApi as Partial<All>) }
        // Older saved copies may miss diagram nodes; fill them from the defaults.
        merged.architecture = { ...defaults().architecture, ...merged.architecture, nodes: { ...defaults().architecture.nodes, ...merged.architecture.nodes } }
        setData(merged)
        setSaved(structuredClone(merged))
        setStored(new Set(Object.keys(fromApi)))
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Can't reach the API."))
  }
  useEffect(load, [])

  const changed = (k: Key) => !!data && !!saved && JSON.stringify(data[k]) !== JSON.stringify(saved[k])
  const anyChanged = !!data && (Object.keys(data) as Key[]).some(changed)
  useUnsavedGuard(anyChanged)

  if (error)
    return (
      <div className={s.emptyRow}>
        <p className={s.error}>{error}</p>
        <button className={s.ghost} onClick={load}>
          Try again
        </button>
      </div>
    )
  if (!data) return <p>Loading settings…</p>

  const set = <K extends Key>(k: K, v: All[K]) => setData((d) => (d ? { ...d, [k]: v } : d))
  const blockProps = (k: Key) => ({
    k,
    value: data[k],
    isDefault: !stored.has(k),
    isChanged: changed(k),
    onSaved: () => {
      setSaved((sv) => (sv ? { ...sv, [k]: structuredClone(data[k]) } : sv))
      setStored((st) => new Set(st).add(k))
    },
    onReset: () => setData((d) => (d && saved ? { ...d, [k]: structuredClone(saved[k]) } : d)),
  })

  const arch = data.architecture
  const nodesList = architectureNodeIds.map((id) => ({ id, ...arch.nodes[id] }))

  return (
    <section className={s.settings}>
      <div className={s.pageHead}>
        <h1>Settings</h1>
      </div>
      <p className={s.note}>Each block saves on its own. Blocks marked “default” still use the text built into the site until you save them.</p>
      <nav className={s.jump} aria-label="Jump to a block">
        {(
          [
            ["contact", "Contact"],
            ["metrics", "Numbers"],
            ["heroChips", "Hero"],
            ["problem", "Problem"],
            ["architecture", "Architecture"],
            ["stack", "Stack"],
            ["principles", "Principles"],
            ["howModes", "How I work"],
          ] as Array<[Key, string]>
        ).map(([k, l]) => (
          <a key={k} href={`#set-${k}`} onClick={(e) => (e.preventDefault(), document.getElementById(`set-${k}`)?.scrollIntoView({ behavior: "smooth" }))}>
            {l}
            {changed(k) && " •"}
          </a>
        ))}
      </nav>

      <Block title="Contact & links" {...blockProps("contact")}>
        <div className={s.row}>
          <Text label="Email" type="email" value={data.contact.email} onChange={(v) => set("contact", { ...data.contact, email: v })} />
          <Text label="Phone" value={data.contact.phone} onChange={(v) => set("contact", { ...data.contact, phone: v })} />
        </div>
        <Text label="Title" value={data.contact.title} onChange={(v) => set("contact", { ...data.contact, title: v })} />
        <div className={s.row}>
          <Text label="Location" value={data.contact.location} onChange={(v) => set("contact", { ...data.contact, location: v })} />
          <Text label="Timezone" value={data.contact.timezone} onChange={(v) => set("contact", { ...data.contact, timezone: v })} />
        </div>
        <ObjectList
          label="Links"
          fields={[
            { key: "label", label: "Label", max: 40 },
            { key: "href", label: "URL (https://…)", max: 300 },
          ]}
          value={data.contact.links as Obj[]}
          onChange={(v) => set("contact", { ...data.contact, links: v as Array<{ label: string; href: string }> })}
          blank={{ label: "", href: "https://" }}
        />
        <CvUpload value={data.contact.cv} onChange={(cv) => set("contact", { ...data.contact, cv })} />
      </Block>

      <Block title="Impact numbers (exactly 4)" {...blockProps("metrics")}>
        <ObjectList
          label="Metrics"
          fixed
          fields={[
            { key: "value", label: "Number", type: "number" },
            { key: "label", label: "Label", max: 40 },
            { key: "note", label: "Note", max: 80 },
          ]}
          value={data.metrics as Obj[]}
          onChange={(v) => set("metrics", v as All["metrics"])}
        />
      </Block>

      <Block title="Hero stack chips" {...blockProps("heroChips")}>
        <Chips label="Chips" value={data.heroChips} onChange={(v) => set("heroChips", v)} />
      </Block>

      <Block title="Chapter: The problem" {...blockProps("problem")}>
        <Lines label="Headline lines (1–4, max 40 characters each; wrap a word in *asterisks* for italic)" value={data.problem.titleLines} onChange={(v) => set("problem", { ...data.problem, titleLines: v })} />
        <Area label="Intro" value={data.problem.lead} onChange={(v) => set("problem", { ...data.problem, lead: v })} />
        <Area label="Second paragraph (optional)" rows={3} value={data.problem.note} onChange={(v) => set("problem", { ...data.problem, note: v })} />
        <ObjectList
          label="Fault lines (up to 3, shown as columns 01–03)"
          fields={[
            { key: "title", label: "Title", max: 60 },
            { key: "body", label: "Text", type: "area", max: 600 },
          ]}
          value={data.problem.faults}
          onChange={(v) => set("problem", { ...data.problem, faults: v as All["problem"]["faults"] })}
          blank={{ title: "", body: "" }}
          maxItems={3}
        />
      </Block>

      <Block title="Chapter: Architecture diagram" {...blockProps("architecture")}>
        <Lines label="Headline lines (1–4; *word* for italic)" value={arch.titleLines} onChange={(v) => set("architecture", { ...arch, titleLines: v })} />
        <Area label="Intro" rows={3} value={arch.lead} onChange={(v) => set("architecture", { ...arch, lead: v })} />
        <div className={s.row}>
          <Text label="Browser address" hint="Shown in the mockup's address bar" value={arch.url} onChange={(v) => set("architecture", { ...arch, url: v.slice(0, 40) })} />
          <Text label="API box subtitle" value={arch.apiBoxSub} onChange={(v) => set("architecture", { ...arch, apiBoxSub: v.slice(0, 32) })} />
        </div>
        <div className={s.row}>
          <Text label="Big counter number" type="number" value={String(arch.counterValue)} onChange={(v) => set("architecture", { ...arch, counterValue: Math.max(0, Math.min(99999, Math.round(Number(v) || 0))) })} />
          <Text label="Counter label" value={arch.counterLabel} onChange={(v) => set("architecture", { ...arch, counterLabel: v.slice(0, 30) })} />
        </div>
        <Chips label="Module chips inside the API box (up to 8, max 13 characters each)" value={arch.modules} onChange={(v) => set("architecture", { ...arch, modules: v.slice(0, 8).map((m) => m.slice(0, 13)) })} />
        <ObjectList
          label="Diagram parts (positions are fixed; edit the text)"
          fixed
          captions={nodesList.map((n) => NODE_PLACES[n.id])}
          fields={[
            { key: "label", label: "Name (max 18)", max: 18 },
            { key: "sub", label: "Subtitle (max 32)", max: 32 },
            { key: "desc", label: "Details shown when selected", type: "area", max: 400 },
          ]}
          value={nodesList as unknown as Obj[]}
          onChange={(list) =>
            set("architecture", {
              ...arch,
              nodes: Object.fromEntries((list as unknown as Array<{ id: ArchNodeId; label: string; sub: string; desc: string }>).map(({ id, ...n }) => [id, n])) as All["architecture"]["nodes"],
            })
          }
        />
      </Block>

      <Block title="Chapter: Stack selector" {...blockProps("stack")}>
        <ObjectList
          label="Technologies"
          fields={[
            { key: "id", label: "Id (unique)", max: 30 },
            { key: "pill", label: "Pill text", max: 30 },
            { key: "title", label: "Big title", max: 80 },
            { key: "body", label: "Text", type: "area", max: 500 },
            { key: "usedIn", label: "Used in", max: 200 },
            { key: "shape", label: "Illustration", type: "select", options: ["layers", "grid", "orbit", "wave", "stack", "phone", "window", "pipeline"] },
          ]}
          value={data.stack as unknown as Obj[]}
          onChange={(v) => set("stack", v as unknown as All["stack"])}
          blank={{ id: "", pill: "", title: "", body: "", usedIn: "", shape: "layers" }}
        />
      </Block>

      <Block title="Chapter: Engineering principles" {...blockProps("principles")}>
        <ObjectList
          label="Principles"
          fields={[
            { key: "title", label: "Title", max: 120 },
            { key: "body", label: "Text", type: "area", max: 600 },
            { key: "where", label: "Where it's used", max: 120 },
          ]}
          value={data.principles}
          onChange={(v) => set("principles", v as All["principles"])}
          blank={{ title: "", body: "", where: "" }}
        />
      </Block>

      <Block title="Chapter: How I work · ways to work together" {...blockProps("howModes")}>
        <ObjectList
          label="Modes"
          fields={[
            { key: "title", label: "Title", max: 60 },
            { key: "body", label: "Text", type: "area", max: 300 },
          ]}
          value={data.howModes}
          onChange={(v) => set("howModes", v as All["howModes"])}
          blank={{ title: "", body: "" }}
        />
      </Block>

      <Block title="Chapter: How I work · process steps" {...blockProps("howSteps")}>
        <ObjectList
          label="Steps"
          fields={[
            { key: "t", label: "Step", max: 60 },
            { key: "b", label: "Text", type: "area", max: 300 },
          ]}
          value={data.howSteps}
          onChange={(v) => set("howSteps", v as All["howSteps"])}
          blank={{ t: "", b: "" }}
        />
      </Block>
    </section>
  )
}

type BlockProps = { title: string; k: Key; value: unknown; isDefault: boolean; isChanged: boolean; onSaved: () => void; onReset: () => void; children: ReactNode }

function Block({ title, k, value, isDefault, isChanged, onSaved, onReset, children }: BlockProps) {
  const [errors, setErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const save = async () => {
    setBusy(true)
    setErrors([])
    try {
      await api.saveSetting(k, value)
      onSaved()
      toast(`${title} saved`)
    } catch (e) {
      if (e instanceof ApiError) setErrors(e.details?.length ? e.details.map((d) => `${d.path ? `${d.path}: ` : ""}${d.message}`) : [e.message])
      else setErrors(["Can't reach the API. Your changes are still here; try again."])
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className={`${s.block} ${isChanged ? s.blockChanged : ""}`} id={`set-${k}`}>
      <div className={s.blockHead}>
        <h2>
          {title} {isDefault && !isChanged && <span className={s.draft}>default</span>}
          {isChanged && <span className={s.unsaved}>unsaved</span>}
        </h2>
        <div className={s.row}>
          {isChanged && (
            <button className={s.ghost} onClick={onReset} disabled={busy}>
              Undo changes
            </button>
          )}
          <button className={s.primary} onClick={save} disabled={busy || (!isChanged && !isDefault)}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      {errors.length > 0 && (
        <ul className={s.errorList} role="alert">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <div className={s.stackForm}>{children}</div>
    </div>
  )
}

type ObjectListProps = { label: string; fields: FieldDef[]; value: Obj[]; onChange: (v: Obj[]) => void; blank?: Obj; fixed?: boolean; captions?: string[]; maxItems?: number }

function ObjectList({ label, fields, value, onChange, blank, fixed, captions, maxItems = 20 }: ObjectListProps) {
  const update = (i: number, key: string, v: string | number) => onChange(value.map((x, j) => (j === i ? { ...x, [key]: v } : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <fieldset className={s.objList}>
      <legend>{label}</legend>
      {value.map((item, i) => (
        <div key={i} className={s.objItem}>
          {captions?.[i] && <span className={s.caption}>{captions[i]}</span>}
          <div className={s.objFields}>
            {fields.map((f) => (
              <label key={f.key} className={f.type === "area" ? s.wide : ""}>
                {f.label}
                {f.type === "area" ? (
                  <textarea rows={3} dir="auto" maxLength={f.max} value={String(item[f.key] ?? "")} onChange={(e) => update(i, f.key, e.target.value)} />
                ) : f.type === "select" ? (
                  <select value={String(item[f.key] ?? "")} onChange={(e) => update(i, f.key, e.target.value)}>
                    {f.options!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    dir="auto"
                    maxLength={f.max}
                    value={String(item[f.key] ?? "")}
                    onChange={(e) => update(i, f.key, f.type === "number" ? Math.max(0, Math.round(Number(e.target.value) || 0)) : e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          {!fixed && (
            <div className={s.actions}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">
                ↓
              </button>
              <button type="button" className={s.danger} onClick={() => onChange(value.filter((_, j) => j !== i))} disabled={value.length <= 1}>
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
      {!fixed && blank && value.length < maxItems && (
        <button type="button" className={s.ghost} onClick={() => onChange([...value, { ...blank }])}>
          + Add
        </button>
      )}
    </fieldset>
  )
}

function CvUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const upload = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setErr("")
    try {
      const { url } = await api.uploadCv(file)
      onChange(url)
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ""
    }
  }
  return (
    <div className={s.cv}>
      <strong>CV (PDF, max 8 MB)</strong>
      <a href={value} target="_blank" rel="noopener">
        {value.replace(/^https?:\/\//, "")}
      </a>
      <input ref={ref} type="file" accept="application/pdf" hidden onChange={(e) => upload(e.target.files?.[0])} />
      <button type="button" className={s.ghost} onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? "Uploading…" : "Upload new CV"}
      </button>
      <small className={s.hint}>After uploading, press Save on this block to use it on the site.</small>
      {err && <small className={s.error}>{err}</small>}
    </div>
  )
}
