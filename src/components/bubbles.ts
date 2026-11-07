// Physics bubbles for the Impact chapter. Loaded lazily with matter-js.
import Matter from "matter-js"

const COLORS = ["#7895B2", "#9FB6CC", "#4F6A86", "#F1F5F9", "#29384C", "#A8B5C5"]
const LABELS = ["NestJS", "Prisma", "Redis", "Postgres", "Flutter", "BullMQ", "Socket.IO", "Zod", "Docker", "React", "Tauri", "SQLite"]

export function mountBubbles(host: HTMLElement, canvas: HTMLCanvasElement) {
  const { Engine, Bodies, Composite, Body, Vector } = Matter
  const ctx = canvas.getContext("2d")!
  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0011 } })
  const dpr = Math.min(window.devicePixelRatio, 2)
  let w = 0
  let h = 0
  let walls: Matter.Body[] = []

  const layout = () => {
    w = host.clientWidth
    h = host.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    Composite.remove(engine.world, walls)
    const t = 200
    walls = [
      Bodies.rectangle(w / 2, h + t / 2, w * 2, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, h / 2, t, h * 3, { isStatic: true }),
      Bodies.rectangle(w + t / 2, h / 2, t, h * 3, { isStatic: true }),
    ]
    Composite.add(engine.world, walls)
  }
  layout()

  const small = w < 700
  const count = small ? 14 : 26
  const balls = Array.from({ length: count }, (_, i) => {
    const r = (small ? 22 : 30) + ((i * 37) % (small ? 22 : 42))
    const b = Bodies.circle(40 + ((i * 97) % Math.max(80, w - 80)), -60 - i * 70, r, {
      restitution: 0.55,
      friction: 0.02,
      frictionAir: 0.012,
      density: 0.0012,
    })
    ;(b as Matter.Body & { meta: { color: string; label?: string; r: number } }).meta = {
      color: COLORS[i % COLORS.length],
      label: i % 2 === 0 ? LABELS[(i / 2) % LABELS.length] : undefined,
      r,
    }
    return b as Matter.Body & { meta: { color: string; label?: string; r: number } }
  })
  Composite.add(engine.world, balls)

  // Push bubbles away from the pointer.
  let px = -9999
  let py = -9999
  const onMove = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect()
    px = e.clientX - rect.left
    py = e.clientY - rect.top
  }
  const onLeave = () => ((px = -9999), (py = -9999))
  host.addEventListener("pointermove", onMove, { passive: true })
  host.addEventListener("pointerleave", onLeave)

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    for (const b of balls) {
      const { color, label, r } = b.meta
      ctx.beginPath()
      ctx.arc(b.position.x, b.position.y, r, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      if (label && r > 34) {
        ctx.fillStyle = color === "#F1F5F9" || color === "#9FB6CC" || color === "#A8B5C5" ? "#0B1220" : "#F1F5F9"
        ctx.font = `600 ${Math.round(r / 3.4)}px "Inter Variable", system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.save()
        ctx.translate(b.position.x, b.position.y)
        ctx.rotate(b.angle)
        ctx.fillText(label, 0, 0)
        ctx.restore()
      }
    }
  }

  let running = false
  let raf = 0
  let last = performance.now()
  const frame = (now: number) => {
    const dt = Math.min(32, now - last)
    last = now
    for (const b of balls) {
      const d = Vector.sub(b.position, { x: px, y: py })
      const dist = Vector.magnitude(d)
      if (dist < 160 && dist > 0.1) {
        Body.applyForce(b, b.position, Vector.mult(Vector.normalise(d), 0.0016 * b.mass * (1 - dist / 160) * 20))
      }
    }
    Engine.update(engine, dt)
    draw()
    if (running) raf = requestAnimationFrame(frame)
  }
  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 })
  io.observe(host)
  const ro = new ResizeObserver(layout)
  ro.observe(host)

  return () => {
    stop()
    io.disconnect()
    ro.disconnect()
    host.removeEventListener("pointermove", onMove)
    host.removeEventListener("pointerleave", onLeave)
    Engine.clear(engine)
  }
}
