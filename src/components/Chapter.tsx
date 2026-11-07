import { useEffect, useRef, type ReactNode } from "react"
import { gsap, prefersReducedMotion } from "../lib/motion"
import styles from "./Chapter.module.css"

type Props = {
  id: string
  number: number
  about: string
  theme: "dark" | "card" | "accent"
  labelledBy: string
  children: ReactNode
  className?: string
  /** Rotated sheet that straightens as it slides over the previous chapter. */
  sheet?: boolean
}

export function Chapter({ id, number, about, theme, labelledBy, children, className = "", sheet = true }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sheet || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sheetRef.current,
        { rotate: 3.2, yPercent: 6, transformOrigin: "12% 0%" },
        {
          rotate: 0,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top 30%", scrub: true },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [sheet])

  const chapter = String(number).padStart(2, "0")
  return (
    <section
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      data-theme={theme}
      data-chapter={chapter}
      aria-labelledby={labelledBy}
      className={`${styles.section} ${sheet ? styles.overlap : ""}`}
      style={{ zIndex: number + 1 }}
    >
      <div ref={sheetRef} className={`${styles.sheet} ${className}`}>
        <div className={styles.corners} aria-hidden="true">
          <span className="eyebrow">About {about}</span>
          <span className="eyebrow">Chapter {chapter}</span>
        </div>
        {children}
      </div>
    </section>
  )
}
