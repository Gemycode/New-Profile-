import { useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChVoice.module.css"

type Principle = { title: string; body: string; where: string }

export function ChVoice({ number, principles }: { number: number; principles: Principle[] }) {
  return (
    <Chapter id="voice" number={number} about="how I think" theme="accent" labelledBy="voice-title">
      <Reveal id="voice-title" className={styles.title} lines={["Engineering", "*principles*"]} />
      <blockquote className={styles.quote}>
        <p className="display">
          “The screen can be wrong. The <em>database</em> can't.”
        </p>
      </blockquote>
      <ol className={styles.list}>
        {principles.map((p, i) => (
          <Principle key={p.title} {...p} n={i + 1} />
        ))}
      </ol>
    </Chapter>
  )
}

function Principle({ title, body, where, n }: { title: string; body: string; where: string; n: number }) {
  const [ref] = useInView<HTMLLIElement>({ threshold: 0.35 })
  return (
    <li ref={ref} className={`${styles.item} fade-up`}>
      <span className={styles.n}>{String(n).padStart(2, "0")}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <span className={styles.where}>{where}</span>
    </li>
  )
}
