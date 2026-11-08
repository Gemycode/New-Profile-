import type { Contact } from "../lib/content"
import { useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChHow.module.css"

type Props = { number: number; modes: Array<{ title: string; body: string }>; steps: Array<{ t: string; b: string }>; contact: Contact }

export function ChHow({ number, modes, steps, contact }: Props) {
  const [ref] = useInView<HTMLDivElement>({ threshold: 0.2 })
  return (
    <Chapter id="how" number={number} about="working together" theme="accent" labelledBy="how-title">
      <div className={styles.top}>
        <Reveal id="how-title" className={styles.title} lines={["How I", "*work*"]} />
        <figure className={styles.portrait}>
          <img loading="lazy" src="/img/abdullah.webp" alt={`Portrait of ${contact.name}`} width={720} height={720} />
          <figcaption>
            <span className={styles.status}>Available</span> {contact.timezone}
          </figcaption>
        </figure>
      </div>

      <div ref={ref} className={styles.modes}>
        {modes.map((m, i) => (
          <div key={m.title} className={`${styles.mode} fade-up`} style={{ ["--d" as string]: `${i * 110}ms` }}>
            <h3>{m.title}</h3>
            <p>{m.body}</p>
          </div>
        ))}
      </div>

      <ol className={styles.steps}>
        {steps.map((s, i) => (
          <li key={s.t}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{s.t}</strong>
            <p>{s.b}</p>
          </li>
        ))}
      </ol>
    </Chapter>
  )
}
