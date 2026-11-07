// Builds public/og.png (1200x630) from an SVG template. Run: node scripts/build-og.mjs
import sharp from "sharp"
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="70%" cy="30%" r="70%"><stop offset="0" stop-color="#7895B2" stop-opacity=".35"/><stop offset="1" stop-color="#0B1220" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#0B1220"/><rect width="1200" height="630" fill="url(#g)"/>
  <text x="72" y="120" fill="#A8B5C5" font-family="Helvetica, Arial, sans-serif" font-size="24" letter-spacing="5">ABDULLAH GAMAL</text>
  <text x="72" y="300" fill="#F1F5F9" font-family="Georgia, serif" font-size="118">I BUILD SYSTEMS</text>
  <text x="72" y="420" fill="#9FB6CC" font-family="Georgia, serif" font-style="italic" font-size="118">that scale.</text>
  <text x="72" y="540" fill="#A8B5C5" font-family="Helvetica, Arial, sans-serif" font-size="30">Backend-focused Full-Stack Engineer · NestJS · PostgreSQL · Flutter</text>
  <circle cx="1110" cy="530" r="14" fill="#7895B2"/>
</svg>`
await sharp(Buffer.from(svg)).png().toFile("public/og.png")
console.log("og.png written")
