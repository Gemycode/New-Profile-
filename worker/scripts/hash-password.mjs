// Prints a PBKDF2 hash to use as OWNER_PASSWORD_HASH.
// The password is typed at a hidden prompt, never passed as an argument, so it stays out of shell history.
import { pbkdf2Sync, randomBytes } from "node:crypto"
import readline from "node:readline"

const ITERATIONS = 100000 // the Workers runtime caps PBKDF2 at 100,000 iterations

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
// Hide what's typed after the prompt.
rl._writeToOutput = (s) => {
  if (s.startsWith("Password")) rl.output.write(s)
}
rl.question("Password (min 12 chars): ", (pw) => {
  rl.close()
  process.stdout.write("\n")
  if (pw.length < 12) {
    console.error("Use at least 12 characters.")
    process.exit(1)
  }
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(pw, salt, ITERATIONS, 32, "sha256")
  console.log(`pbkdf2$sha256$${ITERATIONS}$${salt.toString("base64")}$${hash.toString("base64")}`)
})
