// Radial light rays behind the footer logo. Plain 2D canvas, paused offscreen.
export function mountRays(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!
  const dpr = Math.min(window.devicePixelRatio, 2)
  let w = 0
  let h = 0
  const resize = () => {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const RAYS = 36
  const seeds = Array.from({ length: RAYS }, (_, i) => ({ a: (i / RAYS) * Math.PI * 2, s: 0.4 + ((i * 53) % 100) / 100, p: i * 0.7 }))
  let raf = 0
  let running = false
  const frame = (now: number) => {
    const t = now / 1000
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const cx = w / 2
    const cy = h * 0.42
    const len = Math.max(w, h) * 0.75
    ctx.globalCompositeOperation = "lighter"
    for (const r of seeds) {
      const angle = r.a + t * 0.03
      const strength = 0.02 + 0.035 * (0.5 + 0.5 * Math.sin(t * r.s + r.p))
      const spread = 0.035 + 0.02 * r.s
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, len)
      g.addColorStop(0, `rgba(159,182,204,${strength * 2.2})`)
      g.addColorStop(0.5, `rgba(120,149,178,${strength})`)
      g.addColorStop(1, "rgba(120,149,178,0)")
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, len, angle - spread, angle + spread)
      ctx.closePath()
      ctx.fill()
    }
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.3)
    glow.addColorStop(0, "rgba(159,182,204,0.45)")
    glow.addColorStop(1, "rgba(159,182,204,0)")
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = "source-over"
    if (running) raf = requestAnimationFrame(frame)
  }
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) {
      running = true
      raf = requestAnimationFrame(frame)
    } else if (!e.isIntersecting) {
      running = false
      cancelAnimationFrame(raf)
    }
  })
  io.observe(canvas)
  return () => {
    running = false
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
  }
}
