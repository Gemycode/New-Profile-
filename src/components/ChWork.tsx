import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react"
import { imgSrc, type Project, type SmallProject } from "../data/projects"
import { gsap, isCoarsePointer, prefersReducedMotion, useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { ProjectDialog } from "./ProjectDialog"
import { Reveal } from "./Reveal"
import styles from "./ChWork.module.css"

type Props = { number: number; featured: Project[]; more: Project[]; small: SmallProject[] }

export function ChWork({ number, featured, more, small }: Props) {
  const [open, setOpen] = useState<Project | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(null), [])

  // Preview image that trails the cursor over the numbered rows.
  useEffect(() => {
    const list = listRef.current
    const preview = previewRef.current
    if (!list || !preview || isCoarsePointer() || prefersReducedMotion()) return
    const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" })
    const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" })
    const move = (e: PointerEvent) => {
      const r = list.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
    }
    list.addEventListener("pointermove", move)
    return () => list.removeEventListener("pointermove", move)
  }, [])

  return (
    <Chapter id="work" number={number} about="the work" theme="card" labelledBy="work-title">
      <div className={styles.head}>
        <Reveal id="work-title" className={styles.title} lines={["Selected", "*work*", "2025 — 26"]} />
        <CardStack picks={featured.slice(0, 3)} />
      </div>

      <div ref={listRef} className={styles.rows} onPointerLeave={() => setHover(null)}>
        <ol>
          {featured.map((p, i) => (
            <Row key={p.slug} project={p} index={i} onOpen={() => setOpen(p)} onHover={() => setHover(i)} />
          ))}
        </ol>
        <div ref={previewRef} className={`${styles.preview} ${hover !== null ? styles.previewOn : ""}`} aria-hidden="true">
          {featured.map((p, i) => (
            <img loading="lazy" key={p.slug} src={imgSrc(p.cover.base, 800)} alt="" width={800} height={500} className={hover === i ? styles.shown : ""} />
          ))}
        </div>
      </div>

      <h3 className={styles.moreTitle}>More shipped this year</h3>
      <ul className={styles.grid}>
        {more.map((p, i) => (
          <MoreCard key={p.slug} project={p} index={i} onOpen={() => setOpen(p)} />
        ))}
      </ul>

      <h3 className={styles.smallTitle}>Smaller builds</h3>
      <ul className={styles.small}>
        {small.map((s) => (
          <li key={s.name}>
            <img loading="lazy" src={imgSrc(s.cover.base, 800)} alt={s.cover.alt} width={800} height={500} />
            <div>
              <strong>{s.name}</strong>
              <span>{s.what}</span>
              <em>{s.stack}</em>
            </div>
          </li>
        ))}
      </ul>

      <ProjectDialog project={open} onClose={close} />
    </Chapter>
  )
}

function Row({ project, index, onOpen, onHover }: { project: Project; index: number; onOpen: () => void; onHover: () => void }) {
  const [ref] = useInView<HTMLLIElement>({ threshold: 0.4 })
  return (
    <li ref={ref} className={`${styles.row} fade-up`} onPointerEnter={onHover}>
      {/* A real link to the case study (crawlable, works in a new tab); a plain click opens the dialog. */}
      <a href={`/projects/${project.slug}`} className={styles.rowBtn} onClick={(e) => openInPlace(e, onOpen)} onFocus={onHover} aria-haspopup="dialog">
        <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.rowName}>{project.name}</span>
        <span className={styles.rowKind}>{project.kind}</span>
        <span className={styles.rowMeta}>
          {project.role}
          <br />
          {project.period}
        </span>
        <img loading="lazy" className={styles.rowThumb} src={imgSrc(project.cover.base, 800)} alt="" width={800} height={500} />
        <span className={styles.arrow} aria-hidden="true">
          ↗
        </span>
      </a>
    </li>
  )
}

/** Opens the dialog for a normal click; lets modified clicks (new tab, etc.) follow the link. */
function openInPlace(e: MouseEvent, open: () => void) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  open()
}

function MoreCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const [ref] = useInView<HTMLLIElement>({ threshold: 0.2 })
  return (
    <li ref={ref} className="fade-up" style={{ ["--d" as string]: `${(index % 3) * 90}ms` }}>
      <a href={`/projects/${project.slug}`} className={styles.card} onClick={(e) => openInPlace(e, onOpen)} aria-haspopup="dialog">
        <span className={styles.cardImg}>
          <img loading="lazy" src={imgSrc(project.cover.base, 800)} alt={project.cover.alt} width={800} height={500} />
        </span>
        <span className={styles.cardText}>
          <strong>{project.name}</strong>
          <span>{project.kind}</span>
        </span>
        {project.live && <span className={styles.live}>Live</span>}
      </a>
    </li>
  )
}

/** Three tilted covers that fan out on hover. */
function CardStack({ picks }: { picks: Project[] }) {
  return (
    <div className={styles.stack} aria-hidden="true">
      {picks.map((p, i) => (
        <img loading="lazy" key={p.slug} src={imgSrc(p.cover.base, 800)} alt="" width={800} height={500} style={{ ["--k" as string]: i }} />
      ))}
    </div>
  )
}
