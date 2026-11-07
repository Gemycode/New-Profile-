import { useEffect, useRef, useState } from "react"
import { featured, imgSrc } from "../data/projects"
import { site } from "../data/site"
import { gsap, isCoarsePointer, isSmallScreen, prefersReducedMotion, scrollToId } from "../lib/motion"
import { Reveal } from "./Reveal"
import styles from "./Hero.module.css"

const covers = [...featured.map((p) => p.cover.base), "04-el-azhar-agency-cover"]
const stackChips = ["NestJS", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.IO", "Flutter", "React"]

export function Hero({ ready }: { ready: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLElement>(null)
  const [webgl, setWebgl] = useState(false)
  const [small] = useState(isSmallScreen)

  // Lazy-load three.js only on capable, motion-friendly desktops.
  useEffect(() => {
    if (!ready || prefersReducedMotion() || isCoarsePointer() || isSmallScreen()) return
    let dispose: (() => void) | undefined
    let cancelled = false
    import("./heroScene").then(({ mountHeroScene }) => {
      if (cancelled || !sceneRef.current) return
      try {
        dispose = mountHeroScene(sceneRef.current, covers.map((c) => imgSrc(c, 800)))
        setWebgl(true)
      } catch {
        setWebgl(false) // no WebGL: keep the CSS cards
      }
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [ready])

  // Goo blobs swell as the hero scrolls away.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(`.${styles.blob}`, {
        scale: (i: number) => 2.4 + i * 0.5,
        yPercent: (i: number) => -40 - i * 20,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="top" tabIndex={-1} data-theme="dark" className={styles.hero} aria-labelledby="hero-title">
      <svg className={styles.gooDefs} aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
        </filter>
      </svg>
      <div className={styles.goo} aria-hidden="true">
        <span className={styles.blob} />
        <span className={styles.blob} />
        <span className={styles.blob} />
      </div>

      <div ref={sceneRef} className={styles.scene} aria-hidden="true" />
      {!webgl && !small && (
        <div className={styles.cssCards} aria-hidden="true">
          {covers.slice(0, 4).map((c, i) => (
            <img key={c} src={imgSrc(c, 800)} alt="" width={800} height={500} decoding="async" className={styles.cssCard} style={{ ["--n" as string]: i }} />
          ))}
        </div>
      )}

      <div className={styles.corners} aria-hidden="true">
        <span className="eyebrow">About Abdullah</span>
        <span className="eyebrow">Chapter 00</span>
      </div>

      <div className={styles.content} style={ready ? undefined : { visibility: "hidden" }}>
        {ready && (
          <Reveal
            as="h1"
            id="hero-title"
            className={styles.title}
            lines={["I build", "*systems*", "that scale."]}
          />
        )}
        {!ready && (
          <h1 id="hero-title" className={`display ${styles.title}`} style={{ opacity: 0 }}>
            I build systems that scale.
          </h1>
        )}

        <div className={styles.bottom}>
          <p className={`${styles.role} fade-up ${ready ? "is-in" : ""}`} style={{ ["--d" as string]: "600ms" }}>
            <span className={styles.name}>{site.name}</span>
            <span>{site.title}</span>
            <span className={styles.muted}>Based in {site.location} · Open to remote & freelance</span>
          </p>
          <div className={`${styles.side} fade-up ${ready ? "is-in" : ""}`} style={{ ["--d" as string]: "800ms" }}>
            <ul className={styles.chips} aria-label="Core stack">
              {stackChips.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <a href="#work" className={styles.scroll} onClick={(e) => (e.preventDefault(), scrollToId("work"))}>
              See the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
