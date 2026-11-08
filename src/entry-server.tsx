// Build-time rendering entry (used by scripts/prerender.mjs, never shipped to the browser).
// Renders the same React components the browser runs, so crawlers get the full content
// in the initial HTML instead of an empty <div id="root">.
import { renderToString } from "react-dom/server"
import App, { caseStudies, routeFor } from "./App"
import { merge, staticContent, type ApiContent, type Content } from "./lib/content"
import { imgSrc } from "./data/projects"

export { caseStudies, imgSrc, merge, routeFor, staticContent }
export type { ApiContent, Content }

export function render(pathname: string, content: Content) {
  return renderToString(<App route={routeFor(pathname)} initial={content} prerender />)
}
