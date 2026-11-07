import { useMemo, useRef, useState } from "react"
import { imgSrc, imgSrcSet } from "../data/projects"
import type { Review, ReviewSource } from "../lib/content"
import { getLenis, useInView } from "../lib/motion"
import { Chapter } from "./Chapter"
import { Reveal } from "./Reveal"
import styles from "./ChReviews.module.css"

const SOURCE_NAMES: Record<ReviewSource, string> = { khamsat: "Khamsat", mostaql: "Mostaql", upwork: "Upwork", other: "Other" }
const sourceName = (r: Review) => (r.source === "other" && r.sourceLabel ? r.sourceLabel : SOURCE_NAMES[r.source])

/** Client reviews from Khamsat, Mostaql and Upwork. Renders nothing when there are no published reviews. */
export function ChReviews({ number, reviews }: { number: number; reviews: Review[] }) {
  const [filter, setFilter] = useState<string>("all")
  const [zoom, setZoom] = useState<Review | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const sources = useMemo(() => {
    const seen = new Map<string, string>()
    reviews.forEach((r) => seen.set(r.source === "other" ? `other:${sourceName(r)}` : r.source, sourceName(r)))
    return [...seen.entries()]
  }, [reviews])

  if (!reviews.length) return null

  const keyOf = (r: Review) => (r.source === "other" ? `other:${sourceName(r)}` : r.source)
  const shown = filter === "all" ? reviews : reviews.filter((r) => keyOf(r) === filter)

  const open = (r: Review) => {
    setZoom(r)
    dialogRef.current?.showModal()
    document.documentElement.classList.add("dialog-open")
    getLenis()?.stop()
  }
  const onClose = () => {
    document.documentElement.classList.remove("dialog-open")
    getLenis()?.start()
    setZoom(null)
  }

  return (
    <Chapter id="reviews" number={number} about="what clients say" theme="dark" labelledBy="reviews-title">
      <div className={styles.head}>
        <Reveal id="reviews-title" className={styles.title} lines={["Client", "*reviews*"]} />
        <p className="lead">
          {reviews.length === 1 ? "1 review from a client" : `${reviews.length} reviews from clients`} on {sources.map(([, n]) => n).join(", ")}.
        </p>
      </div>

      {sources.length > 1 && (
        <div className={styles.filters} role="group" aria-label="Filter reviews by platform">
          {[["all", "All"] as [string, string], ...sources].map(([k, n]) => (
            <button key={k} className={filter === k ? styles.on : ""} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {n}
            </button>
          ))}
        </div>
      )}

      <ul className={styles.list}>
        {shown.map((r, i) => (
          <Card key={r.id} review={r} index={i} onZoom={() => open(r)} />
        ))}
      </ul>

      <dialog ref={dialogRef} className={styles.dialog} onClose={onClose} onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()} aria-label="Review screenshot">
        {zoom?.image && (
          <div className={styles.zoomBody}>
            <button className={styles.close} onClick={() => dialogRef.current?.close()} aria-label="Close">
              ✕
            </button>
            <img src={imgSrc(zoom.image.base, 1600)} alt={zoom.image.alt} />
          </div>
        )}
      </dialog>
    </Chapter>
  )
}

function Card({ review: r, index, onZoom }: { review: Review; index: number; onZoom: () => void }) {
  const [ref] = useInView<HTMLLIElement>({ threshold: 0.2 })
  return (
    <li ref={ref} className={`${styles.card} fade-up`} style={{ ["--d" as string]: `${(index % 3) * 90}ms` }}>
      {r.image && (
        <button className={styles.shot} onClick={onZoom} aria-label={`Enlarge review screenshot${r.clientName ? ` from ${r.clientName}` : ""}`}>
          <img src={imgSrc(r.image.base, 800)} srcSet={imgSrcSet(r.image.base)} sizes="(max-width: 700px) 85vw, 420px" alt={r.image.alt} loading="lazy" />
        </button>
      )}
      <div className={styles.meta}>
        <span className={`${styles.badge} ${styles[r.source]}`}>{sourceName(r)}</span>
        {r.rating !== null && (
          <span className={styles.stars} aria-label={`${r.rating} out of 5`}>
            {"★".repeat(r.rating)}
            <span aria-hidden="true">{"★".repeat(5 - r.rating)}</span>
          </span>
        )}
      </div>
      {r.text && (
        // dir="auto" lets Arabic reviews read right-to-left with their punctuation in place.
        <blockquote className={styles.text} dir="auto">
          {r.text}
        </blockquote>
      )}
      {(r.clientName || r.date || r.reviewUrl) && (
        <p className={styles.by}>
          {r.clientName && <strong dir="auto">{r.clientName}</strong>}
          {r.date && <span>{r.date}</span>}
          {r.reviewUrl && (
            <a href={r.reviewUrl} target="_blank" rel="noopener">
              View on {sourceName(r)} ↗
            </a>
          )}
        </p>
      )}
    </li>
  )
}
