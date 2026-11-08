// Serves dist/ the way Firebase Hosting does (cleanUrls, trailingSlash, rewrites, 404.html,
// headers from firebase.json), so the production build can be tested locally.
//   node scripts/serve.mjs [port]      (default 4180)
import http from "node:http"
import { existsSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { gzipSync } from "node:zlib"

const ROOT = path.resolve("dist")
const hosting = JSON.parse(readFileSync("firebase.json", "utf8")).hosting

const glob = (pattern) =>
  new RegExp(
    "^" +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*\/!\(\\\*\\\.\\\*\)/g, "(?:.*/)?[^./]+") // **/!(*.*) = extensionless paths
        .replace(/\*\*/g, "\u0000")
        .replace(/\*/g, "[^/]*")
        .replace(/\u0000/g, ".*") +
      "$",
  )
const fileFor = (p) => {
  const f = path.join(ROOT, p)
  return f.startsWith(ROOT) && existsSync(f) && statSync(f).isFile() ? f : null
}
const types = { ".html": "text/html; charset=utf-8", ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" }

function resolve(urlPath) {
  if (hosting.trailingSlash === false && urlPath.length > 1 && urlPath.endsWith("/")) return { redirect: urlPath.slice(0, -1) }
  if (hosting.cleanUrls && urlPath.endsWith(".html")) return { redirect: urlPath.slice(0, -5).replace(/\/index$/, "/") || "/" }
  let file = fileFor(urlPath === "/" ? "/index.html" : urlPath)
  if (!file && hosting.cleanUrls) file = fileFor(`${urlPath}.html`) ?? fileFor(`${urlPath}/index.html`)
  if (file) return { file, status: 200 }
  for (const r of hosting.rewrites ?? []) if (glob(r.source).test(urlPath)) return { file: fileFor(r.destination), status: 200 }
  return { file: fileFor("/404.html"), status: 404 }
}

function headersFor(urlPath) {
  const out = {}
  for (const h of hosting.headers ?? []) if (glob(h.source).test(urlPath)) for (const { key, value } of h.headers) out[key.toLowerCase()] = value
  return out
}

export function startServer(port = 4180) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname)
    const r = resolve(urlPath)
    if (r.redirect) return res.writeHead(301, { location: r.redirect }).end()
    const extra = headersFor(urlPath)
    if (!r.file) return res.writeHead(404, extra).end("Not found")
    const type = types[path.extname(r.file)] ?? "application/octet-stream"
    let body = readFileSync(r.file)
    const headers = { "content-type": type, ...extra }
    // Firebase Hosting compresses text responses; do the same so performance tests are comparable.
    if (/text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      body = gzipSync(body)
      headers["content-encoding"] = "gzip"
    }
    res.writeHead(r.status, headers)
    res.end(body)
  })
  return new Promise((ok) => server.listen(port, () => ok(server)))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await startServer(Number(process.argv[2] ?? 4180))
  console.log(`Serving dist/ like Firebase Hosting on http://localhost:${server.address().port}`)
}
