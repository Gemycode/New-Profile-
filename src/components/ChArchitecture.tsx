import { useState } from "react"
import type { ArchitectureContent, ArchNodeId } from "../data/sections"
import { useCountUp, useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChArchitecture.module.css"

type NodeId = ArchNodeId

// Fixed diagram positions (viewBox 1000×600). Only the text comes from content.
const positions: Record<NodeId, { x: number; y: number }> = {
  web: { x: 110, y: 120 },
  desktop: { x: 110, y: 240 },
  parent: { x: 110, y: 360 },
  site: { x: 110, y: 480 },
  api: { x: 500, y: 300 },
  pg: { x: 870, y: 120 },
  redis: { x: 870, y: 240 },
  pay: { x: 870, y: 360 },
  eta: { x: 870, y: 480 },
}
const left: NodeId[] = ["web", "desktop", "parent", "site"]
const right: NodeId[] = ["pg", "redis", "pay", "eta"]

export function ChArchitecture({ number, content }: { number: number; content: ArchitectureContent }) {
  const [active, setActive] = useState<NodeId>("api")
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const counter = useCountUp(content.counterValue, inView, 2200)
  const nodes = Object.fromEntries(
    (Object.keys(positions) as NodeId[]).map((id) => [id, { ...positions[id], ...content.nodes[id] }]),
  ) as Record<NodeId, { x: number; y: number; label: string; sub: string; desc: string }>
  const modules = content.modules.slice(0, 8) // the API box fits 8 chips (2 × 4)
  const isLinked = (id: NodeId) => active === "api" || active === id

  return (
    <Chapter id="architecture" number={number} about="the architecture" theme="dark" labelledBy="arch-title">
      <div className={styles.head}>
        <Reveal id="arch-title" className={styles.title} lines={content.titleLines} />
        <p className="lead">{content.lead}</p>
      </div>

      <div ref={ref} className={styles.stage}>
        <div className={styles.ghost} aria-hidden="true">
          <span className={styles.ghostNum}>{counter}</span>
          <span className={styles.ghostLabel}>{content.counterLabel}</span>
        </div>

        <div className={styles.browser}>
          <div className={styles.chrome} aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{content.url}</span>
          </div>

          <svg className={styles.diagram} viewBox="0 0 1000 600" role="group" aria-label="Architecture diagram">
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
              aria-label={`${nodes.api.label}, ${content.apiBoxSub}`}
              onClick={() => setActive("api")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive("api"))}
            >
              <rect x="380" y="140" width="240" height="320" rx="22" />
              <text x="500" y="182" className={styles.apiTitle}>{nodes.api.label}</text>
              <text x="500" y="204" className={styles.nodeSub}>{content.apiBoxSub}</text>
              {modules.map((m, i) => (
                <g key={`${i}-${m}`} transform={`translate(${i % 2 ? 506 : 398}, ${232 + Math.floor(i / 2) * 52})`}>
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
