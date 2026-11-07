import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/global.css"

// The old site registered a caching service worker; remove it so visitors get this version.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
