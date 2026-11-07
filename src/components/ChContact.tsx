import { useEffect, useRef, useState } from "react"
import { site } from "../data/site"
import { prefersReducedMotion } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Logo } from "./Logo"
import { Reveal } from "./Reveal"
import { mountRays } from "./rays"
import styles from "./ChContact.module.css"

export function ChContact() {
  const raysRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || !raysRef.current) return
    return mountRays(raysRef.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <Chapter id="contact" number={8} about="getting in touch" theme="dark" labelledBy="contact-title" className={styles.wrap}>
      <canvas ref={raysRef} className={styles.rays} aria-hidden="true" />
      <div className={styles.mark} aria-hidden="true">
        <Logo size={120} title="" />
      </div>

      <Reveal id="contact-title" className={styles.title} lines={["Let's build", "something *solid*"]} />

      <div className={styles.emailRow}>
        <a href={`mailto:${site.email}`} className={styles.email}>
          {site.email}
        </a>
        <button className={styles.copy} onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
        <span className="visually-hidden" aria-live="polite">
          {copied ? "Email address copied" : ""}
        </span>
      </div>

      <a href={site.phone.href} className={styles.phone}>
        {site.phone.display}
      </a>

      <ul className={styles.links}>
        {site.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener me">
              {l.label} ↗
            </a>
          </li>
        ))}
        <li>
          <a href={site.cv} target="_blank" rel="noopener">
            Download CV ↓
          </a>
        </li>
      </ul>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {site.fullName}
        </span>
        <span>{site.title} · {site.location}</span>
      </footer>
    </Chapter>
  )
}
