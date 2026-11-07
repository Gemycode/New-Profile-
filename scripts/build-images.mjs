// Converts the PNG project images in ./portfolio-images (or the folder given as an argument) into WebP files in ./public/work
// at two widths (800 and 1600). Run with: npm run images
import { readdir, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const SRC = path.resolve(process.argv[2] || "portfolio-images")
const OUT = path.resolve("public/work")
const WIDTHS = [800, 1600]

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"))
let total = 0
for (const file of files) {
  const base = file.replace(/\.png$/, "")
  for (const w of WIDTHS) {
    const out = path.join(OUT, `${base}-${w}.webp`)
    await sharp(path.join(SRC, file)).resize({ width: w }).webp({ quality: w === 800 ? 74 : 80 }).toFile(out)
    total += (await stat(out)).size
  }
}
console.log(`${files.length} images -> ${(total / 1024 / 1024).toFixed(1)} MB of WebP in public/work`)
