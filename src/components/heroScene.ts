// WebGL hero: project covers as floating, tilted cards that follow the pointer.
// Loaded lazily (dynamic import) so three.js never blocks the first paint.
import * as THREE from "three"

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Rounded-rectangle mask + soft edge so the planes read as cards.
const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec2 uSize;
  uniform float uRadius;
  varying vec2 vUv;
  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = roundedBox(p, uSize * 0.5, uRadius);
    float alpha = 1.0 - smoothstep(-0.01, 0.01, d);
    vec4 tex = texture2D(uMap, vUv);
    float rim = smoothstep(-0.06, 0.0, d);
    vec3 col = mix(tex.rgb, vec3(0.62, 0.71, 0.8), rim * 0.6);
    gl_FragColor = vec4(col, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`

type Card = { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; base: THREE.Vector3; rot: THREE.Euler; phase: number; speed: number }

const LAYOUT: Array<[number, number, number, number, number]> = [
  // x, y, z, rotY, rotZ  (kept toward the edges and behind the headline)
  [-7.4, 3.3, -4.5, 0.42, -0.06],
  [7.6, 3.6, -5.5, -0.45, 0.07],
  [-8.2, -1.6, -6.5, 0.36, 0.05],
  [8.8, -3.0, -8.0, -0.38, -0.05],
  [1.4, 5.6, -9.0, -0.12, 0.04],
  [-2.6, -5.4, -10.0, 0.1, -0.05],
]

export function mountHeroScene(container: HTMLElement, images: string[]) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 15)

  const group = new THREE.Group()
  scene.add(group)

  const loader = new THREE.TextureLoader()
  const geometry = new THREE.PlaneGeometry(3.6, 2.25, 1, 1)
  const cards: Card[] = images.slice(0, LAYOUT.length).map((src, i) => {
    const [x, y, z, ry, rz] = LAYOUT[i]
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uMap: { value: null },
        uOpacity: { value: 0 },
        uSize: { value: new THREE.Vector2(3.6, 2.25) },
        uRadius: { value: 0.18 },
      },
    })
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 4
      mat.uniforms.uMap.value = tex
    })
    const mesh = new THREE.Mesh(geometry, mat)
    mesh.position.set(x, y, z)
    mesh.rotation.set(0, ry, rz)
    group.add(mesh)
    return { mesh, mat, base: new THREE.Vector3(x, y, z), rot: new THREE.Euler(0, ry, rz), phase: i * 1.7, speed: 0.5 + (i % 3) * 0.15 }
  })

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener("pointermove", onPointer, { passive: true })

  const resize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Pull the camera back on narrower screens so the cards stay at the edges.
    camera.position.z = w / h < 1.2 ? 21 : 15
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  let visible = true
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) loop()
  })
  io.observe(container)

  const clock = new THREE.Clock()
  let raf = 0
  let running = false
  const loop = () => {
    if (running) return
    running = true
    const frame = () => {
      if (!visible || document.hidden) {
        running = false
        return
      }
      const t = clock.getElapsedTime()
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      const scroll = Math.min(1.5, window.scrollY / window.innerHeight)
      group.rotation.y = pointer.x * 0.22
      group.rotation.x = pointer.y * 0.14
      group.position.y = scroll * 4
      cards.forEach((c, i) => {
        c.mesh.position.y = c.base.y + Math.sin(t * c.speed + c.phase) * 0.18
        c.mesh.position.z = c.base.z + scroll * (i % 2 ? 3 : 2)
        c.mesh.rotation.z = c.rot.z + Math.sin(t * 0.4 + c.phase) * 0.03
        c.mesh.rotation.y = c.rot.y - pointer.x * 0.12
        const target = c.mat.uniforms.uMap.value ? Math.max(0, 0.62 - scroll * 0.6) : 0
        c.mat.uniforms.uOpacity.value += (target - c.mat.uniforms.uOpacity.value) * 0.06
      })
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
  }
  const onVisibility = () => !document.hidden && loop()
  document.addEventListener("visibilitychange", onVisibility)
  loop()

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    window.removeEventListener("pointermove", onPointer)
    document.removeEventListener("visibilitychange", onVisibility)
    cards.forEach((c) => {
      c.mat.uniforms.uMap.value?.dispose()
      c.mat.dispose()
    })
    geometry.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}
