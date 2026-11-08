import { imgSrc, imgSrcSet, type Project } from "../data/projects"
import type { Contact } from "../lib/content"
import { Logo } from "./Logo"
import styles from "./ProjectPage.module.css"

type Props = { project: Project; all: Project[]; contact: Contact }

/** Standalone, crawlable case study at /projects/<slug>. Same content as the dialog on the home page. */
export function ProjectPage({ project: p, all, contact }: Props) {
  const i = all.findIndex((x) => x.slug === p.slug)
  const prev = all[(i - 1 + all.length) % all.length]
  const next = all[(i + 1) % all.length]
  const others = all.filter((x) => x.slug !== p.slug)

  return (
    <>
      <header className={styles.top}>
        <a href="/" className={styles.brand}>
          <Logo size={30} />
          <span>{contact.name}</span>
        </a>
        <nav aria-label="Main">
          <a href="/#work">All work</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>

      <main className={styles.page}>
        <article>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <ol>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/#work">Work</a>
              </li>
              <li aria-current="page">{p.name}</li>
            </ol>
          </nav>

          <header className={styles.head}>
            <p className="eyebrow">{p.kind}</p>
            <h1 className={`display ${styles.title}`}>{p.name}</h1>
            <p className={styles.tagline}>{p.tagline}</p>
            <dl className={styles.meta}>
              <div>
                <dt>Role</dt>
                <dd>{p.role}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{p.period}</dd>
              </div>
              {p.live && (
                <div>
                  <dt>Live</dt>
                  <dd>
                    <a href={p.live} target="_blank" rel="noopener">
                      {p.live.replace(/^https?:\/\//, "")} ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </header>

          <img
            className={styles.cover}
            src={imgSrc(p.cover.base, 1600)}
            srcSet={imgSrcSet(p.cover.base)}
            sizes="(max-width: 1100px) 100vw, 1100px"
            alt={p.cover.alt}
            width={1600}
            height={1000}
            // React 18 has no fetchPriority prop; pass the HTML attribute as-is. This image is the LCP element.
            {...{ fetchpriority: "high" }}
            decoding="async"
          />

          <div className={styles.body}>
            <section aria-labelledby="overview">
              <h2 id="overview">Overview</h2>
              <p className={styles.summary}>{p.summary}</p>
            </section>
            <section aria-labelledby="highlights">
              <h2 id="highlights">What I built</h2>
              <ul className={styles.list}>
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="stack">
              <h2 id="stack">Technologies</h2>
              <ul className={styles.chips}>
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          </div>

          {p.features.length > 0 && (
            <section aria-labelledby="screens" className={styles.features}>
              <h2 id="screens">Screens</h2>
              <div>
                {p.features.map((f) => (
                  <figure key={f.base}>
                    <img loading="lazy" src={imgSrc(f.base, 1600)} srcSet={imgSrcSet(f.base)} sizes="(max-width: 800px) 100vw, 540px" alt={f.alt} width={1600} height={1000} decoding="async" />
                    <figcaption>{f.alt}</figcaption>
                  </figure>
                ))}
              </div>
              <p className={styles.note}>Images are concept visuals made for this portfolio, not screenshots of the live product.</p>
            </section>
          )}
        </article>

        <nav aria-label="More projects" className={styles.pager}>
          <a href={`/projects/${prev.slug}`}>
            <span>← Previous</span>
            <strong>{prev.name}</strong>
          </a>
          <a href={`/projects/${next.slug}`}>
            <span>Next →</span>
            <strong>{next.name}</strong>
          </a>
        </nav>

        <section aria-labelledby="more-work" className={styles.more}>
          <h2 id="more-work">More projects by {contact.name}</h2>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/projects/${o.slug}`}>
                  <strong>{o.name}</strong>
                  <span>{o.kind}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.cta} aria-labelledby="cta">
          <h2 id="cta" className="display">
            Have a project like this?
          </h2>
          <p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <p className={styles.links}>
            {contact.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener me">
                {l.label} ↗
              </a>
            ))}
            <a href="/">Portfolio home</a>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {contact.fullName} ·{" "}
          <span lang="ar" dir="rtl">
            عبدالله جمال
          </span>
        </span>
        <span>
          {contact.title} · {contact.location}
        </span>
      </footer>
    </>
  )
}

export function NotFound({ name }: { name: string }) {
  return (
    <main className={styles.notFound}>
      <p className="eyebrow">404</p>
      <h1 className="display">Page not found</h1>
      <p>This page doesn't exist or has moved.</p>
      <p>
        <a href="/">Back to {name}'s portfolio</a> · <a href="/#work">See the work</a>
      </p>
    </main>
  )
}
