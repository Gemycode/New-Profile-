import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom/client"
import App, { routeFor } from "./App"
import { staticContent, type Content } from "./lib/content"
import "./styles/global.css"

// Prerendered HTML shows the final state of the reveal animations; once JavaScript runs,
// this class lets them start hidden and animate in (see global.css).
document.documentElement.classList.add("js")

// The old site registered a caching service worker; remove it so visitors get this version.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
}

const isAdmin = window.location.pathname.startsWith("/admin")

// The owner dashboard is its own lazy chunk, so the public site never downloads it.
const AdminApp = lazy(() => import("./admin/AdminApp"))

/** Content the page was prerendered with, so the first client render shows the same thing. */
function embeddedContent(): Content {
  try {
    const el = document.getElementById("__content")
    return el?.textContent ? (JSON.parse(el.textContent) as Content) : staticContent
  } catch {
    return staticContent
  }
}

if (isAdmin) {
  document.getElementById("boot")?.remove()
  const robots = document.createElement("meta")
  robots.name = "robots"
  robots.content = "noindex, nofollow"
  document.head.appendChild(robots)
  document.title = "Dashboard · Abdullah Gamal"
}

// createRoot replaces the prerendered markup inside #root with the live app.
const root = document.getElementById("root")!
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Suspense fallback={null}>{isAdmin ? <AdminApp /> : <App route={routeFor(window.location.pathname)} initial={embeddedContent()} />}</Suspense>
  </React.StrictMode>,
)
