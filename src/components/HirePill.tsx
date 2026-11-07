import { useEffect, useState } from "react"
import { scrollToId } from "../lib/motion"
import { Logo } from "./Logo"
import styles from "./HirePill.module.css"

/** Glass CTA pinned to the bottom; its colors follow the section underneath it. */
export function HirePill() {
  const [theme, setTheme] = useState("dark")
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const t = (e.target as HTMLElement).dataset.theme ?? "dark"
          setTheme(t)
          setHidden((e.target as HTMLElement).id === "contact")
        })
      },
      { rootMargin: "-88% 0px -6% 0px" },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <a
      href="#contact"
      className={`${styles.pill} ${styles[theme] ?? ""} ${hidden ? styles.hidden : ""}`}
      onClick={(e) => (e.preventDefault(), scrollToId("contact"))}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <Logo size={26} title="" />
      <span>Hire me</span>
      <span className={styles.dot} aria-hidden="true" />
    </a>
  )
}
