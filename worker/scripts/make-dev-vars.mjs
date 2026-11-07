// Creates worker/.dev.vars with throwaway local credentials (git-ignored, local only).
// Local login: owner@local.test / local-dev-password
import { pbkdf2Sync, randomBytes } from "node:crypto"
import { existsSync, writeFileSync } from "node:fs"

if (existsSync(".dev.vars")) {
  console.log(".dev.vars already exists, leaving it alone")
  process.exit(0)
}
const pw = "local-dev-password"
const salt = randomBytes(16)
const hash = pbkdf2Sync(pw, salt, 100000, 32, "sha256")
writeFileSync(
  ".dev.vars",
  [
    "# Local development only. Never commit.",
    `# Login: owner@local.test / ${pw}`,
    "OWNER_EMAIL=owner@local.test",
    `OWNER_PASSWORD_HASH=pbkdf2$sha256$100000$${salt.toString("base64")}$${hash.toString("base64")}`,
    `TOKEN_SECRET=${randomBytes(32).toString("hex")}`,
    "MEDIA_BASE_URL=http://localhost:8787/media/",
    "",
  ].join("\n"),
)
console.log("wrote .dev.vars")
