import type { ProblemContent } from "../data/sections"
import { useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChProblem.module.css"

export function ChProblem({ number, content }: { number: number; content: ProblemContent }) {
  const [ref] = useInView<HTMLDivElement>({ threshold: 0.15 })
  return (
    <Chapter id="problem" number={number} about="the problem" theme="card" labelledBy="problem-title">
      <div className={styles.grid}>
        <Reveal id="problem-title" className={styles.title} lines={content.titleLines} />
        <div ref={ref} className={styles.intro}>
          <p className="lead fade-up">{content.lead}</p>
          {content.note && (
            <p className={`fade-up ${styles.small}`} style={{ ["--d" as string]: "120ms" }}>
              {content.note}
            </p>
          )}
        </div>
      </div>

      <ol className={styles.faults}>
        {content.faults.map((f, i) => (
          <Fault key={i} n={String(i + 1).padStart(2, "0")} title={f.title} body={f.body} delay={i * 120} />
        ))}
      </ol>
    </Chapter>
  )
}

function Fault({ n, title, body, delay }: { n: string; title: string; body: string; delay: number }) {
  const [ref] = useInView<HTMLLIElement>({ threshold: 0.3 })
  return (
    <li ref={ref} className={`${styles.fault} fade-up`} style={{ ["--d" as string]: `${delay}ms` }}>
      <span className={styles.n}>{n}</span>
      <h3 className={styles.faultTitle}>{title}</h3>
      <p>{body}</p>
    </li>
  )
}
