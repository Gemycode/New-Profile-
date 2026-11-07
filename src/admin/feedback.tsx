import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import s from "./admin.module.css"

// ---------------------------------------------------------------- toasts
type Toast = { id: number; text: string; kind: "ok" | "error" }
const ToastCtx = createContext<(text: string, kind?: Toast["kind"]) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const next = useRef(0)
  const push = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    const id = ++next.current
    setToasts((t) => [...t, { id, text, kind }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className={s.toasts} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={t.kind === "error" ? s.toastError : s.toast}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

// ---------------------------------------------------------------- unsaved changes
// One editor is open at a time, so a module-level flag is enough.
let dirty = false
const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (!dirty) return
  e.preventDefault()
  e.returnValue = ""
}
if (typeof window !== "undefined") window.addEventListener("beforeunload", onBeforeUnload)

/** Marks the page as having unsaved changes while `isDirty` is true. */
export function useUnsavedGuard(isDirty: boolean) {
  useEffect(() => {
    dirty = isDirty
    return () => {
      dirty = false
    }
  }, [isDirty])
}

/** Asks before discarding unsaved changes. Returns true when it's fine to leave. */
export function confirmLeave() {
  if (!dirty) return true
  const ok = window.confirm("You have unsaved changes. Leave without saving?")
  if (ok) dirty = false
  return ok
}
