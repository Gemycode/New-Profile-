import { useState } from "react"
import { useCountUp, useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChArchitecture.module.css"

type NodeId = "web" | "desktop" | "parent" | "site" | "api" | "pg" | "redis" | "pay" | "eta"

const nodes: Record<NodeId, { label: string; sub: string; x: number; y: number; desc: string }> = {
  web: { label: "ERP web", sub: "React · TanStack Query", x: 110, y: 120, desc: "The staff console: admissions, student files, attendance, grades, finance and reports. Pages appear or hide based on the signed-in user's effective permissions." },
  desktop: { label: "Desktop app", sub: "Tauri v2", x: 110, y: 240, desc: "The same ERP packaged as a desktop app with auto-update, built in CI. I set up the Tauri build and the release workflow." },
  parent: { label: "Parent portal", sub: "React · i18n", x: 110, y: 360, desc: "Parents follow their children, enroll them in the next stage, reserve bus seats and pay fees online." },
  site: { label: "Public site", sub: "Admissions · news", x: 110, y: 480, desc: "The school's public website. Registration requests from it land directly in the ERP's admissions pipeline." },
  api: { label: "NestJS API", sub: "683 endpoints · 219 test files", x: 500, y: 300, desc: "One modular NestJS API on Prisma. I own the Control (exams and grades), Attendance, ETA e-receipts, HR, Logistics and Payments modules, plus the legacy data import." },
  pg: { label: "PostgreSQL", sub: "Prisma 7 · 200+ models", x: 870, y: 120, desc: "Students, enrollments, ledgers, receipts, buses, HR and permissions. Year transitions snapshot the ledger before they run." },
  redis: { label: "Redis", sub: "Upstash", x: 870, y: 240, desc: "Caches each user's effective permissions and pages, with targeted invalidation when a role changes, and holds short-lived tickets for the live SSE streams." },
  pay: { label: "Fawaterak", sub: "Cards · valU · Fawry", x: 870, y: 360, desc: "Online parent payments. The API checks eligibility (bus reservation, installment, purpose) before it creates a payment, then settles it into the ledger." },
  eta: { label: "Tax Authority", sub: "ETA e-receipts", x: 870, y: 480, desc: "Every receipt is signed and submitted to the Egyptian Tax Authority. The API handles the callbacks and keeps the receipt chain state." },
}

const modules = ["Control", "Attendance", "Finance", "Logistics", "HR", "Payments", "Authorization", "Admissions"]
const left: NodeId[] = ["web", "desktop", "parent", "site"]
const right: NodeId[] = ["pg", "redis", "pay", "eta"]

export function ChArchitecture() {
  const [active, setActive] = useState<NodeId>("api")
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const endpoints = useCountUp(683, inView, 2200)
  const isLinked = (id: NodeId) => active === "api" || active === id

  return (
    <Chapter id="architecture" number={2} about="the architecture" theme="dark" labelledBy="arch-title">
      <div className={styles.head}>
        <Reveal id="arch-title" className={styles.title} lines={["How Salam", "is *wired*"]} />
        <p className="lead">
          Four clients, one modular API, and two outside systems that move real money. Select any part to see what it does
          and which parts I built.
        </p>
      </div>

      <div ref={ref} className={styles.stage}>
        <div className={styles.ghost} aria-hidden="true">
          <span className={styles.ghostNum}>{endpoints}</span>
          <span className={styles.ghostLabel}>API endpoints</span>
        </div>

        <div className={styles.browser}>
          <div className={styles.chrome} aria-hidden="true">
            <i />
            <i />
            <i />
            <span>api.salamacademy.edu.eg</span>
          </div>

          <svg className={styles.diagram} viewBox="0 0 1000 600" role="group" aria-label="Salam ERP architecture diagram">
            {left.map((id) => (
              <path key={id} d={`M ${nodes[id].x + 85} ${nodes[id].y} C 290 ${nodes[id].y}, 290 300, 380 300`} className={`${styles.edge} ${isLinked(id) ? styles.edgeOn : ""}`} />
            ))}
            {right.map((id) => (
              <path key={id} d={`M 620 300 C 710 300, 710 ${nodes[id].y}, ${nodes[id].x - 85} ${nodes[id].y}`} className={`${styles.edge} ${isLinked(id) ? styles.edgeOn : ""}`} />
            ))}

            <g
              className={`${styles.api} ${active === "api" ? styles.selected : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={active === "api"}
              aria-label="NestJS API, Prisma · Swagger · Zod"
              onClick={() => setActive("api")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive("api"))}
            >
              <rect x="380" y="140" width="240" height="320" rx="22" />
              <text x="500" y="182" className={styles.apiTitle}>NestJS API</text>
              <text x="500" y="204" className={styles.nodeSub}>Prisma · Swagger · Zod</text>
              {modules.map((m, i) => (
                <g key={m} transform={`translate(${i % 2 ? 506 : 398}, ${232 + Math.floor(i / 2) * 52})`}>
                  <rect width="96" height="38" rx="10" className={styles.mod} />
                  <text x="48" y="24" className={styles.modText}>{m}</text>
                </g>
              ))}
            </g>

            {[...left, ...right].map((id) => {
              const n = nodes[id]
              return (
                <g
                  key={id}
                  className={`${styles.node} ${active === id ? styles.selected : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active === id}
                  aria-label={`${n.label}, ${n.sub}`}
                  onClick={() => setActive(id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(id))}
                >
                  <rect x={n.x - 85} y={n.y - 34} width="170" height="68" rx="16" />
                  <text x={n.x} y={n.y - 4} className={styles.nodeTitle}>{n.label}</text>
                  <text x={n.x} y={n.y + 18} className={styles.nodeSub}>{n.sub}</text>
                </g>
              )
            })}
          </svg>

          {/* Small screens: the same diagram as a vertical, tappable stack. */}
          <div className={styles.mobile}>
            {[{ title: "Clients", ids: left }, { title: "API", ids: ["api"] as NodeId[] }, { title: "Data & integrations", ids: right }].map((tier, ti) => (
              <div key={tier.title} className={styles.tier}>
                {ti > 0 && <span className={styles.flowArrow} aria-hidden="true">↓</span>}
                <span className="eyebrow">{tier.title}</span>
                <div className={styles.tierRow}>
                  {tier.ids.map((id) => (
                    <button key={id} className={`${styles.chip} ${active === id ? styles.chipOn : ""}`} aria-pressed={active === id} onClick={() => setActive(id)}>
                      <strong>{nodes[id].label}</strong>
                      <span>{nodes[id].sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.panel} aria-live="polite">
            <span className="eyebrow">{nodes[active].sub}</span>
            <h3>{nodes[active].label}</h3>
            <p>{nodes[active].desc}</p>
          </div>
        </div>
      </div>
    </Chapter>
  )
}
