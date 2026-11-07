import { useEffect, useRef } from "react"
import { prefersReducedMotion, useCountUp, useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChImpact.module.css"

type Metric = { value: number; label: string; note: string }

export function ChImpact({ number, metrics }: { number: number; metrics: ReadonlyArray<Metric> }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 })
  const physicsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!inView || prefersReducedMotion() || !physicsRef.current || !canvasRef.current) return
    let dispose: (() => void) | undefined
    let cancelled = false
    import("./bubbles").then(({ mountBubbles }) => {
      if (!cancelled && physicsRef.current && canvasRef.current) dispose = mountBubbles(physicsRef.current, canvasRef.current)
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [inView])

  return (
    <Chapter id="impact" number={number} about="the impact" theme="card" labelledBy="impact-title">
      <Reveal id="impact-title" className={styles.title} lines={["One year,", "in *numbers*"]} />
      <div ref={ref} className={styles.metrics}>
        {metrics.map((m, i) => (
          <Metric key={m.label} {...m} run={inView} delay={i * 150} />
        ))}
      </div>
      <p className={styles.source}>Counted from git history and the codebases, November 2025 to November 2026.</p>
      <div ref={physicsRef} className={styles.physics} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </Chapter>
  )
}

function Metric({ value, label, note, run, delay }: { value: number; label: string; note: string; run: boolean; delay: number }) {
  const n = useCountUp(value, run, 1800 + delay)
  return (
    <div className={styles.metric}>
      <span className={styles.value} aria-hidden="true">
        {n}
      </span>
      <span className="visually-hidden">{value}</span>
      <span className={styles.label}>{label}</span>
      <span className={styles.note}>{note}</span>
    </div>
  )
}
