import { useCallback, useEffect, useState } from "react"
import { ScrollTrigger, startSmoothScroll } from "./lib/motion"
import { useContent } from "./lib/content"
import { Preloader } from "./components/Preloader"
import { Nav } from "./components/Nav"
import { HirePill } from "./components/HirePill"
import { MobileBar } from "./components/MobileBar"
import { Hero } from "./components/Hero"
import { ChProblem } from "./components/ChProblem"
import { ChArchitecture } from "./components/ChArchitecture"
import { ChWork } from "./components/ChWork"
import { ChVoice } from "./components/ChVoice"
import { ChStack } from "./components/ChStack"
import { ChImpact } from "./components/ChImpact"
import { ChReviews } from "./components/ChReviews"
import { ChHow } from "./components/ChHow"
import { ChContact } from "./components/ChContact"

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])
  const c = useContent()
  const hasReviews = c.reviews.length > 0

  useEffect(() => {
    if (!ready) return
    const stop = startSmoothScroll()
    // Layout settles after fonts and images; recompute scroll-linked animations.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)
    const t = window.setTimeout(refresh, 600)
    return () => {
      stop()
      window.removeEventListener("load", refresh)
      window.clearTimeout(t)
    }
  }, [ready])

  // Content from the API can add or remove sections (reviews), which moves everything below.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh()
  }, [c, ready])

  // Chapters are numbered in order, so hiding the reviews never leaves a gap.
  let n = 0
  const next = () => ++n

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      {!ready && <Preloader onDone={done} />}
      <Nav key={`nav-${hasReviews}`} name={c.contact.name} cv={c.contact.cv} />
      <main>
        <Hero ready={ready} covers={[...c.featured.map((p) => p.cover.base), ...c.more.slice(0, 1).map((p) => p.cover.base)]} chips={c.heroChips} contact={c.contact} />
        <ChProblem number={next()} content={c.problem} />
        <ChArchitecture number={next()} content={c.architecture} />
        <ChWork number={next()} featured={c.featured} more={c.more} small={c.small} />
        <ChVoice number={next()} principles={c.principles} />
        <ChStack number={next()} stack={c.stack} />
        <ChImpact number={next()} metrics={c.metrics} />
        {hasReviews && <ChReviews number={next()} reviews={c.reviews} />}
        <ChHow number={next()} modes={c.howModes} steps={c.howSteps} contact={c.contact} />
        <ChContact number={next()} contact={c.contact} />
      </main>
      {/* Re-mounted when the section list changes so their observers see every chapter. */}
      <HirePill key={`pill-${hasReviews}`} />
      <MobileBar key={`bar-${hasReviews}`} cv={c.contact.cv} />
    </>
  )
}
