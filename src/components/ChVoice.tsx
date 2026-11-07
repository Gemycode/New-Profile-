import { useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChVoice.module.css"

const principles = [
  {
    title: "Money is a ledger, not a column.",
    body: "Wallets, settlements and refunds in The Ride are double-entry ledger lines, and POS stock moves only through an append-only ledger. Balances are something you can rebuild, never something you overwrite.",
    where: "The Ride · POS Desktop",
  },
  {
    title: "Write the side effect in the same transaction.",
    body: "Emails, cache purges and sync events go into an outbox table inside the same database transaction, then a worker delivers them with retries and a dead-letter state. Nothing gets lost between commit and send.",
    where: "Orlen · The Ride · POS Desktop",
  },
  {
    title: "Anything a person can double-click must be idempotent.",
    body: "Trip requests, refunds and order commits carry idempotency keys. A retry or a nervous click can't charge twice.",
    where: "The Ride · El-Azhar",
  },
  {
    title: "Deny by default.",
    body: "Every route needs a token unless it is explicitly public. Roles are read from the database on each request, so a demotion takes effect immediately.",
    where: "El-Azhar",
  },
  {
    title: "Offline is a feature.",
    body: "A shop can't stop selling because the internet dropped. The POS keeps its own database and syncs when the connection comes back.",
    where: "POS Desktop",
  },
]

export function ChVoice() {
  return (
    <Chapter id="voice" number={4} about="how I think" theme="accent" labelledBy="voice-title">
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
