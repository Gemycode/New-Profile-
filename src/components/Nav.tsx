import { useEffect, useState } from "react"
import { site } from "../data/site"
import { scrollToId } from "../lib/motion"
import { Logo } from "./Logo"
import styles from "./Nav.module.css"

const items = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
]

export function Nav() {
  const [onAccent, setOnAccent] = useState(false)

  // Switch to dark text while an accent-colored chapter sits under the bar.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setOnAccent((e.target as HTMLElement).dataset.theme === "accent")),
      { rootMargin: "0px 0px -94% 0px" },
    )
    document.querySelectorAll("[data-theme]").forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <header className={`${styles.nav} ${onAccent ? styles.onAccent : ""}`}>
      <a href="#top" className={styles.brand} onClick={(e) => (e.preventDefault(), scrollToId("top"))}>
        <Logo size={30} />
        <span>{site.name}</span>
      </a>
      <nav aria-label="Main">
        <ul className={styles.links}>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} onClick={(e) => (e.preventDefault(), scrollToId(it.id))}>
                {it.label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.cv} target="_blank" rel="noopener" className={styles.cv}>
              CV
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
