import { site } from "../data/site"
import { useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChHow.module.css"

const modes = [
  { title: "Remote, full-time", body: "Backend or full-stack roles on a product team. I'm comfortable owning modules end to end." },
  { title: "Freelance projects", body: "APIs, admin consoles, mobile apps or a complete product, from the contract to the deploy." },
  { title: "Technical rescue", body: "A backend that's slow, insecure or hard to change: audit first, then fix it in small, tested steps." },
]

const steps = [
  { n: "01", t: "Contract first", b: "An API contract or OpenAPI spec the frontend and backend both build against." },
  { n: "02", t: "Small slices", b: "Features shipped in phases, each one deployable and reviewed." },
  { n: "03", t: "Tests and CI", b: "Unit and integration tests, typechecks and automated deploys." },
  { n: "04", t: "Handover", b: "READMEs, runbooks and environment templates so the next person isn't guessing." },
]

export function ChHow() {
  const [ref] = useInView<HTMLDivElement>({ threshold: 0.2 })
  return (
    <Chapter id="how" number={7} about="working together" theme="accent" labelledBy="how-title">
      <div className={styles.top}>
        <Reveal id="how-title" className={styles.title} lines={["How I", "*work*"]} />
        <figure className={styles.portrait}>
          <img src="/img/abdullah.webp" alt={`Portrait of ${site.name}`} width={720} height={763} loading="lazy" />
          <figcaption>
            <span className={styles.status}>Available</span> {site.timezone}
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
        {steps.map((s) => (
          <li key={s.n}>
            <span>{s.n}</span>
            <strong>{s.t}</strong>
            <p>{s.b}</p>
          </li>
        ))}
      </ol>
    </Chapter>
  )
}
