import { useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChProblem.module.css"

const faults = [
  {
    n: "01",
    title: "Permissions",
    body: "Ten roles become forty. Principals, accountants, bus supervisors and HR each need a different slice of the same student, and only for their branch. Fixed role checks stop working, so I moved Salam to dynamic RBAC + ABAC with scopes, grants and delegation.",
  },
  {
    n: "02",
    title: "Time",
    body: "Every year the whole school moves up a grade. Classes, fees, bus seats and open balances all have to roll over at once, without losing last year. The year transition is validated, scheduled and snapshots the ledger before it runs.",
  },
  {
    n: "03",
    title: "Money & legacy data",
    body: "Parents pay online through cards, valU and Fawry, receipts go to the Egyptian Tax Authority, and years of records come from an old system. Each of those needs rules that the database enforces, not the screen.",
  },
]

export function ChProblem() {
  const [ref] = useInView<HTMLDivElement>({ threshold: 0.15 })
  return (
    <Chapter id="problem" number={1} about="the problem" theme="card" labelledBy="problem-title">
      <div className={styles.grid}>
        <Reveal id="problem-title" className={styles.title} lines={["A school ERP", "looks like *CRUD*", "until June."]} />
        <div ref={ref} className={styles.intro}>
          <p className="lead fade-up">
            On paper it's students, classes and payments. In production it's a school group with several branches,
            hundreds of permission rules and an academic year that has to end cleanly every summer.
          </p>
          <p className={`fade-up ${styles.small}`} style={{ ["--d" as string]: "120ms" }}>
            I've spent this year on the backend of the Salam Schools ERP. These are the three places where systems
            like this break when they grow.
          </p>
        </div>
      </div>

      <ol className={styles.faults}>
        {faults.map((f, i) => (
          <Fault key={f.n} {...f} delay={i * 120} />
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
