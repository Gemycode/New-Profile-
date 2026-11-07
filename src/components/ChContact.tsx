import { useEffect, useRef, useState } from "react"
import { telHref, type Contact } from "../lib/content"
import { prefersReducedMotion } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Logo } from "./Logo"
import { Reveal } from "./Reveal"
import { mountRays } from "./rays"
import styles from "./ChContact.module.css"

export function ChContact({ number, contact }: { number: number; contact: Contact }) {
  const raysRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || !raysRef.current) return
    return mountRays(raysRef.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <Chapter id="contact" number={number} about="getting in touch" theme="dark" labelledBy="contact-title" className={styles.wrap}>
      <canvas ref={raysRef} className={styles.rays} aria-hidden="true" />
      <div className={styles.mark} aria-hidden="true">
        <Logo size={120} title="" />
      </div>

      <Reveal id="contact-title" className={styles.title} lines={["Let's build", "something *solid*"]} />

      <div className={styles.emailRow}>
        <a href={`mailto:${contact.email}`} className={styles.email}>
          {contact.email}
        </a>
        <button className={styles.copy} onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
        <span className="visually-hidden" aria-live="polite">
          {copied ? "Email address copied" : ""}
        </span>
      </div>

      {contact.phone && (
        <a href={telHref(contact.phone)} className={styles.phone}>
          {contact.phone}
        </a>
      )}

      <ul className={styles.links}>
        {contact.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener me">
              {l.label} ↗
            </a>
          </li>
        ))}
        <li>
          <a href={contact.cv} target="_blank" rel="noopener">
            Download CV ↓
          </a>
        </li>
      </ul>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {contact.fullName}
        </span>
        <span>{contact.title} · {contact.location}</span>
      </footer>
    </Chapter>
  )
}
