import { useCallback, useEffect, useState } from "react"
import { ScrollTrigger, startSmoothScroll } from "./lib/motion"
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
import { ChHow } from "./components/ChHow"
import { ChContact } from "./components/ChContact"

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

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

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      {!ready && <Preloader onDone={done} />}
      <Nav />
      <main>
        <Hero ready={ready} />
        <ChProblem />
        <ChArchitecture />
        <ChWork />
        <ChVoice />
        <ChStack />
        <ChImpact />
        <ChHow />
        <ChContact />
      </main>
      <HirePill />
      <MobileBar />
    </>
  )
}
