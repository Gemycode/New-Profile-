import { useEffect, useState } from "react"
import { prefersReducedMotion } from "../lib/motion"
import styles from "./Preloader.module.css"

/** Counts to 100 while fonts load, then lifts away. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.body.classList.add("is-loading")
    document.getElementById("boot")?.remove()
    const minTime = prefersReducedMotion() ? 0 : 1300
    const start = performance.now()
    // Load the display and body fonts up front so the hero doesn't shift when they swap in.
    let fontsReady = false
    const fonts = document.fonts
    if (fonts) {
      const loads = ['380 1em "Fraunces Variable"', 'italic 300 1em "Fraunces Variable"', '400 1em "Inter Variable"'].map((f) => fonts.load(f))
      const timeout = new Promise((r) => window.setTimeout(r, 1200))
      Promise.race([Promise.all(loads), timeout]).finally(() => (fontsReady = true))
    } else {
      fontsReady = true
    }
    let raf = 0
    const tick = (now: number) => {
      const t = minTime ? Math.min(1, (now - start) / minTime) : 1
      const target = fontsReady ? t : Math.min(t, 0.9)
      setCount(Math.round((1 - Math.pow(1 - target, 3)) * 100))
      if (target < 1) raf = requestAnimationFrame(tick)
      else {
        setLeaving(true)
        window.setTimeout(
          () => {
            document.body.classList.remove("is-loading")
            onDone()
          },
          prefersReducedMotion() ? 0 : 900,
        )
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`${styles.loader} ${leaving ? styles.leaving : ""}`} role="status" aria-live="polite">
      <span className="visually-hidden">Loading</span>
      <div className={styles.row} aria-hidden="true">
        <span className={`display ${styles.name}`}>
          Abdullah <em>Gamal</em>
        </span>
        <span className={styles.count}>{String(count).padStart(3, "0")}</span>
      </div>
      <div className={styles.bar} style={{ transform: `scaleX(${count / 100})` }} aria-hidden="true" />
    </div>
  )
}
