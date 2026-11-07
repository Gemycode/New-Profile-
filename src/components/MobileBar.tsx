import { useEffect, useState, type ReactNode } from "react"
import { scrollToId } from "../lib/motion"
import styles from "./MobileBar.module.css"

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

const items = [
  { id: "top", label: "Home", icon: icon(<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />) },
  { id: "work", label: "Work", icon: icon(<><rect x="3.5" y="7" width="17" height="12.5" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /></>) },
  { id: "stack", label: "Stack", icon: icon(<><path d="m12 4 8.5 4.5L12 13 3.5 8.5z" /><path d="m3.5 12.5 8.5 4.5 8.5-4.5" /></>) },
  { id: "contact", label: "Hire me", icon: icon(<><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></>), primary: true },
]

// Sections that belong to each tab, so the right tab lights up while scrolling.
const owner: Record<string, string> = {
  top: "top",
  problem: "top",
  architecture: "top",
  work: "work",
  voice: "work",
  stack: "stack",
  impact: "stack",
  reviews: "contact",
  how: "contact",
  contact: "contact",
}

/** App-style glass tab bar for phones. Replaces the top links and the floating pill below 768px. */
export function MobileBar({ cv }: { cv: string }) {
  const [active, setActive] = useState("top")
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          setActive(owner[el.id] ?? "top")
          setTheme(el.dataset.theme ?? "dark")
        }),
      { rootMargin: "-50% 0px -49% 0px" },
    )
    document.querySelectorAll("main [data-theme]").forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <nav className={`${styles.bar} ${styles[theme] ?? ""}`} aria-label="Sections">
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`${styles.item} ${active === it.id ? styles.on : ""} ${it.primary ? styles.primary : ""}`}
              aria-current={active === it.id ? "true" : undefined}
              onClick={(e) => (e.preventDefault(), scrollToId(it.id))}
            >
              {it.icon}
              <span>{it.label}</span>
            </a>
          </li>
        ))}
        <li>
          <a href={cv} target="_blank" rel="noopener" className={styles.item}>
            {icon(<><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5A.5.5 0 0 1 6.5 20V4a.5.5 0 0 1 .5-.5z" /><path d="M12 10v6m-2.5-2.5L12 16l2.5-2.5" /></>)}
            <span>CV</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}
