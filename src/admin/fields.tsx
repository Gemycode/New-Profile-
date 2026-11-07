import { useId, useRef, useState, type ReactNode } from "react"
import { api, type Img } from "./api"
import { prepareImage } from "./image"
import s from "./admin.module.css"

type FieldProps = { label: string; hint?: string; error?: string; children: (id: string) => ReactNode }

export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && !error && <small className={s.hint}>{hint}</small>}
      {error && (
        <small className={s.error} role="alert">
          {error}
        </small>
      )}
    </div>
  )
}

export function Text({ label, value, onChange, hint, error, placeholder, type = "text", dir }: { label: string; value: string; onChange: (v: string) => void; hint?: string; error?: string; placeholder?: string; type?: string; dir?: "auto" | "ltr" | "rtl" }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(id) => <input id={id} type={type} value={value} placeholder={placeholder} dir={dir} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  )
}

export function Area({ label, value, onChange, hint, error, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; hint?: string; error?: string; rows?: number }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(id) => <textarea id={id} rows={rows} value={value} dir="auto" onChange={(e) => onChange(e.target.value)} />}
    </Field>
  )
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={s.toggle}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span aria-hidden="true" />
      {label}
    </label>
  )
}

/** Tags typed one at a time (Enter or comma adds one). */
export function Chips({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  const [draft, setDraft] = useState("")
  const add = () => {
    const v = draft.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setDraft("")
  }
  return (
    <Field label={label} hint={hint ?? "Press Enter to add"}>
      {(id) => (
        <div className={s.chips}>
          {value.map((v) => (
            <span key={v} className={s.chip}>
              {v}
              <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((x) => x !== v))}>
                ×
              </button>
            </span>
          ))}
          <input
            id={id}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                add()
              } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1))
            }}
            onBlur={add}
          />
        </div>
      )}
    </Field>
  )
}

/** A reorderable list of single-line entries (e.g. project highlights). */
export function Lines({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const set = (i: number, v: string) => onChange(value.map((x, j) => (j === i ? v : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <fieldset className={s.lines}>
      <legend>{label}</legend>
      {value.map((v, i) => (
        <div key={i} className={s.lineRow}>
          <input value={v} dir="auto" aria-label={`${label} ${i + 1}`} onChange={(e) => set(i, e.target.value)} />
          <button type="button" onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}>
            ↑
          </button>
          <button type="button" onClick={() => move(i, 1)} aria-label="Move down" disabled={i === value.length - 1}>
            ↓
          </button>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove">
            ×
          </button>
        </div>
      ))}
      <button type="button" className={s.ghost} onClick={() => onChange([...value, ""])}>
        + Add
      </button>
    </fieldset>
  )
}

/** Picks an image, resizes it to WebP 800/1600 in the browser and uploads both sizes. */
export function ImageInput({ label, value, onChange, folder, mediaBase, required, onUploaded }: { label: string; value: Img | null; onChange: (v: Img | null) => void; folder: "projects" | "reviews"; mediaBase: string; required?: boolean; onUploaded?: (key: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const preview = value ? `${mediaBase}${value.key}-800.webp` : ""

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setErr("")
    try {
      const { w800, w1600 } = await prepareImage(file)
      const { key } = await api.uploadImage(folder, w800, w1600)
      onUploaded?.(key)
      onChange({ key, alt: value?.alt ?? "" })
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className={s.image}>
      <div className={s.imageHead}>
        <strong>
          {label}
          {required && " *"}
        </strong>
        <div>
          <button type="button" className={s.ghost} onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && !required && (
            <button type="button" className={s.ghost} onClick={() => onChange(null)}>
              Remove
            </button>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {value ? (
        <>
          <img src={preview} alt="" className={s.preview} />
          <input
            aria-label={`${label} alt text`}
            placeholder="Describe the image (required, used by screen readers)"
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />
        </>
      ) : (
        <button type="button" className={s.drop} onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? "Resizing and uploading…" : "Choose an image (PNG, JPG or WebP). It's resized to 800 and 1600 px WebP automatically."}
        </button>
      )}
      {err && (
        <small className={s.error} role="alert">
          {err}
        </small>
      )}
    </div>
  )
}
