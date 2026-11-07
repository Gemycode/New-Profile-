import { useEffect, useRef } from "react"
import type { Project } from "../data/projects"
import { imgSrc, imgSrcSet } from "../data/projects"
import { getLenis } from "../lib/motion"
import styles from "./ProjectDialog.module.css"

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (project && !d.open) {
      d.showModal()
      document.documentElement.classList.add("dialog-open")
      getLenis()?.stop()
    }
    if (!project && d.open) d.close()
  }, [project])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const handle = () => {
      document.documentElement.classList.remove("dialog-open")
      getLenis()?.start()
      onClose()
    }
    d.addEventListener("close", handle)
    return () => d.removeEventListener("close", handle)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="project-dialog-title"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      {project && (
        <article className={styles.body} data-lenis-prevent>
          <button className={styles.close} onClick={() => ref.current?.close()} aria-label="Close project details">
            ✕
          </button>
          <header className={styles.header}>
            <span className="eyebrow">{project.kind}</span>
            <h2 id="project-dialog-title" className={`display ${styles.title}`}>
              {project.name}
            </h2>
            <p className={styles.tagline}>{project.tagline}</p>
          </header>

          <img
            className={styles.cover}
            src={imgSrc(project.cover.base, 1600)}
            srcSet={imgSrcSet(project.cover.base)}
            sizes="(max-width: 900px) 100vw, 1000px"
            alt={project.cover.alt}
            width={1600}
            height={1000}
          />

          <div className={styles.cols}>
            <div>
              <p className={styles.summary}>{project.summary}</p>
              <h3 className={styles.h3}>Highlights</h3>
              <ul className={styles.list}>
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <dl className={styles.meta}>
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{project.period}</dd>
              </div>
              {project.live && (
                <div>
                  <dt>Live</dt>
                  <dd>
                    <a href={project.live} target="_blank" rel="noopener">
                      {project.live.replace("https://", "")} ↗
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt>Stack</dt>
                <dd className={styles.chips}>
                  {project.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.features}>
            {project.features.map((f) => (
              <img key={f.base} src={imgSrc(f.base, 1600)} srcSet={imgSrcSet(f.base)} sizes="(max-width: 900px) 100vw, 500px" alt={f.alt} loading="lazy" width={1600} height={1000} />
            ))}
          </div>
          <p className={styles.note}>Images are concept visuals made for this portfolio, not screenshots of the live product.</p>
        </article>
      )}
    </dialog>
  )
}
