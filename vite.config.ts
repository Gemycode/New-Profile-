import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: { port: 3000, open: true },
  // The prerender build runs in Node; bundle the animation libraries because their
  // subpath imports ("gsap/ScrollTrigger") don't resolve under Node's ESM loader.
  ssr: { noExternal: ["gsap", "lenis"] },
  build: isSsrBuild
    ? { outDir: "dist-ssr", target: "node20", emptyOutDir: true }
    : {
        outDir: "dist",
        target: "es2020",
        rollupOptions: {
          output: {
            manualChunks: {
              react: ["react", "react-dom"],
              motion: ["gsap", "lenis"],
            },
          },
        },
      },
}))
