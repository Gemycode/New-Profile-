import { useState } from "react"
import type { StackItem } from "../data/stack"
import { Chapter } from "./Chapter"
import styles from "./ChStack.module.css"

export function ChStack({ number, stack }: { number: number; stack: StackItem[] }) {
  const [activeId, setActiveId] = useState(stack[0].id)
  const active = stack.find((s) => s.id === activeId) ?? stack[0]
  const activeKey = active.id

  return (
    <Chapter id="stack" number={number} about="the stack" theme="dark" labelledBy="stack-title" className={styles.wrap}>
      <div className={styles.haze} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <h2 id="stack-title" className="visually-hidden">
        Stack
      </h2>
      <div className={styles.pills} role="tablist" aria-label="Technologies">
        {stack.map((s) => (
          <button
            key={s.id}
            role="tab"
            id={`tab-${s.id}`}
            aria-selected={s.id === activeKey}
            aria-controls="stack-panel"
            className={s.id === activeKey ? styles.on : ""}
            onClick={() => setActiveId(s.id)}
          >
            {s.pill}
          </button>
        ))}
      </div>

      <div id="stack-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className={styles.panel}>
        <div key={active.id} className={styles.text}>
          <p className={`display ${styles.big}`}>{active.title}</p>
          <p className="lead">{active.body}</p>
          <p className={styles.used}>
            <span className="eyebrow">Used in</span> {active.usedIn}
          </p>
        </div>
        <Illustration key={`i-${active.id}`} shape={active.shape} />
      </div>
    </Chapter>
  )
}

/** Abstract line art, one composition per technology. */
function Illustration({ shape }: { shape: StackItem["shape"] }) {
  const stroke = "var(--accent)"
  const soft = "rgba(168,181,197,0.35)"
  const common = { fill: "none", stroke, strokeWidth: 1.5 }
  let art: JSX.Element
  switch (shape) {
    case "layers":
      art = (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M200 ${110 + i * 46} L330 ${170 + i * 46} L200 ${230 + i * 46} L70 ${170 + i * 46} Z`} {...common} stroke={i === 0 ? stroke : soft} fill={i === 0 ? "rgba(120,149,178,0.18)" : "none"} />
          ))}
        </g>
      )
      break
    case "grid":
      art = (
        <g>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => (
              <rect key={`${r}-${c}`} x={70 + c * 68} y={80 + r * 56} width="56" height="40" rx="6" {...common} stroke={(r + c) % 3 === 0 ? stroke : soft} />
            )),
          )}
          <path d="M98 100 L234 212 L302 324" {...common} strokeDasharray="4 6" />
        </g>
      )
      break
    case "pipeline":
      art = (
        <g>
          <path d="M50 200 H350" {...common} stroke={soft} />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={70 + i * 65} cy="200" r={14 + (i % 2) * 6} {...common} className={styles.pulse} style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
          <path d="M70 200 C 120 90, 280 90, 330 200" {...common} stroke={soft} strokeDasharray="5 7" />
        </g>
      )
      break
    case "orbit":
      art = (
        <g>
          <circle cx="200" cy="200" r="30" fill="rgba(120,149,178,0.25)" stroke={stroke} />
          {[70, 115, 160].map((r, i) => (
            <g key={r} className={styles.spin} style={{ animationDuration: `${10 + i * 6}s` }}>
              <circle cx="200" cy="200" r={r} {...common} stroke={soft} />
              <circle cx={200 + r} cy="200" r="7" fill={stroke} />
            </g>
          ))}
        </g>
      )
      break
    case "window":
      art = (
        <g>
          <rect x="50" y="80" width="300" height="230" rx="14" {...common} />
          <path d="M50 112 H350" {...common} stroke={soft} />
          <rect x="66" y="128" width="70" height="166" rx="6" {...common} stroke={soft} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={150 + i * 66} y="128" width="56" height="50" rx="6" {...common} stroke={i === 1 ? stroke : soft} />
          ))}
          <path d="M150 270 L190 240 L230 256 L270 214 L334 236" {...common} />
        </g>
      )
      break
    case "phone":
      art = (
        <g>
          <rect x="130" y="50" width="140" height="290" rx="26" {...common} />
          <path d="M150 260 C 180 200, 210 230, 250 120" {...common} strokeDasharray="5 6" />
          <circle cx="150" cy="260" r="7" fill={stroke} />
          <circle cx="250" cy="120" r="9" fill="none" stroke={stroke} strokeWidth="3" />
          <rect x="146" y="290" width="108" height="30" rx="10" {...common} stroke={soft} />
        </g>
      )
      break
    case "stack":
      art = (
        <g>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={70 + i * 26} y={90 + i * 34} width="230" height="150" rx="12" fill="var(--bg)" {...{ stroke: i === 2 ? stroke : soft, strokeWidth: 1.5 }} />
          ))}
          <path d="M150 290 h120" {...common} />
          <circle cx="140" cy="290" r="5" fill={stroke} />
        </g>
      )
      break
    default:
      art = (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M40 ${160 + i * 30} C 120 ${100 + i * 30}, 200 ${220 + i * 30}, 360 ${150 + i * 30}`} {...common} stroke={i === 1 ? stroke : soft} />
          ))}
        </g>
      )
  }
  return (
    <svg className={styles.art} viewBox="0 0 400 400" aria-hidden="true">
      {art}
    </svg>
  )
}
