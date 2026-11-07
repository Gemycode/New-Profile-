import { useEffect, useState, type FormEvent } from "react"
import { API_BASE } from "../lib/content"
import { ApiError, api, session, setUnauthorizedHandler } from "./api"
import { ToastProvider, confirmLeave } from "./feedback"
import { Projects } from "./Projects"
import { Reviews } from "./Reviews"
import { Settings } from "./Settings"
import s from "./admin.module.css"

type Tab = "projects" | "reviews" | "settings"
type Me = { email: string; mediaBase: string }
const TABS: Array<{ id: Tab; label: string }> = [
  { id: "projects", label: "Projects" },
  { id: "reviews", label: "Reviews" },
  { id: "settings", label: "Settings" },
]
const tabFromHash = (): Tab => {
  const h = location.hash.slice(1)
  return h === "reviews" || h === "settings" ? h : "projects"
}

export default function AdminApp() {
  const [me, setMe] = useState<Me | null>(null)
  const [checking, setChecking] = useState(!!session.get())
  // When the session expires mid-edit we show the sign-in form over the page instead of
  // unmounting it, so unsaved work in an open editor survives.
  const [expired, setExpired] = useState(false)
  const [tab, setTab] = useState<Tab>(tabFromHash)

  useEffect(() => {
    setUnauthorizedHandler(() => setExpired(true))
    if (!session.get()) return
    api
      .me()
      .then(setMe)
      .catch(() => session.clear())
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    history.replaceState(null, "", `#${tab}`)
  }, [tab])

  if (!API_BASE) return <p className={s.center}>The API is turned off (VITE_API_BASE is empty).</p>
  if (checking) return <p className={s.center}>Loading…</p>
  if (!me) return <Login onDone={setMe} />

  const switchTab = (t: Tab) => {
    if (t !== tab && confirmLeave()) setTab(t)
  }
  const signOut = () => {
    if (!confirmLeave()) return
    session.clear()
    setMe(null)
  }

  return (
    <ToastProvider>
      <div className={s.shell}>
        <header className={s.top}>
          <strong className={s.brand}>Dashboard</strong>
          <nav aria-label="Dashboard sections" className={s.tabs}>
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? s.tabOn : ""} aria-current={tab === t.id ? "page" : undefined} onClick={() => switchTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          <div className={s.who}>
            <span className={s.email}>{me.email}</span>
            <a href="/" target="_blank" rel="noopener">
              View site ↗
            </a>
            <button className={s.ghost} onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>
        <main className={s.main}>
          {tab === "projects" && <Projects mediaBase={me.mediaBase} />}
          {tab === "reviews" && <Reviews mediaBase={me.mediaBase} />}
          {tab === "settings" && <Settings />}
        </main>
      </div>
      {expired && (
        <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Session expired">
          <Login
            title="Session expired"
            note="Sign in again to continue. Your unsaved changes are still here; press Save again after signing in."
            onDone={(m) => {
              setMe(m)
              setExpired(false)
            }}
          />
        </div>
      )}
    </ToastProvider>
  )
}

function Login({ onDone, title = "Owner sign in", note }: { onDone: (me: Me) => void; title?: string; note?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const { token } = await api.login(email, password)
      session.set(token)
      onDone(await api.me())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Can't reach the API. Check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className={s.loginWrap}>
      <form className={s.login} onSubmit={submit}>
        <h1 className="display">{title}</h1>
        {note && <p className={s.hint}>{note}</p>}
        <label>
          Email
          <input type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}
        <button className={s.primary} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  )
}
