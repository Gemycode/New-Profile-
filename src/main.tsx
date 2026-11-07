import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/global.css"

// The old site registered a caching service worker; remove it so visitors get this version.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
}

const isAdmin = window.location.pathname.startsWith("/admin")

// The owner dashboard is its own lazy chunk, so the public site never downloads it.
const AdminApp = lazy(() => import("./admin/AdminApp"))

if (isAdmin) {
  document.getElementById("boot")?.remove()
  const robots = document.createElement("meta")
  robots.name = "robots"
  robots.content = "noindex, nofollow"
  document.head.appendChild(robots)
  document.title = "Dashboard · Abdullah Gamal"
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={null}>{isAdmin ? <AdminApp /> : <App />}</Suspense>
  </React.StrictMode>,
)
