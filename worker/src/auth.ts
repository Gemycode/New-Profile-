// Single-owner authentication: PBKDF2 password check and HMAC-signed bearer tokens.
const enc = new TextEncoder()
const TOKEN_TTL_SECONDS = 12 * 60 * 60

const b64url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
const fromB64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))

/** Constant-time comparison so timing doesn't reveal how much of a secret matched. */
function equal(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

/** Verifies a password against `pbkdf2$sha256$<iterations>$<saltB64>$<hashB64>`. */
export async function verifyPassword(password: string, stored: string) {
  const [scheme, algo, iter, saltB64, hashB64] = stored.split("$")
  const iterations = Number(iter)
  // Workers caps PBKDF2 at 100k iterations; anything outside this range is a malformed secret.
  if (scheme !== "pbkdf2" || algo !== "sha256" || !saltB64 || !hashB64 || !Number.isInteger(iterations) || iterations < 10_000 || iterations > 100_000) return false
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"])
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromB64(saltB64), iterations },
    key,
    256,
  )
  return equal(new Uint8Array(bits), fromB64(hashB64))
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

export async function issueToken(email: string, secret: string) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  const payload = b64url(enc.encode(JSON.stringify({ sub: email, exp })))
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(payload))
  return { token: `${payload}.${b64url(sig)}`, expiresAt: exp }
}

/** Returns the token's subject if the signature is valid and it hasn't expired. */
export async function verifyToken(token: string, secret: string): Promise<string | null> {
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return null
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromB64(sig), enc.encode(payload))
    if (!ok) return null
    const { sub, exp } = JSON.parse(new TextDecoder().decode(fromB64(payload))) as { sub: string; exp: number }
    return exp > Date.now() / 1000 ? sub : null
  } catch {
    return null
  }
}

// Login rate limit: 5 failures per IP per 15 minutes.
const MAX_FAILURES = 5
const WINDOW_SECONDS = 15 * 60

export async function isLockedOut(db: D1Database, ip: string) {
  const row = await db.prepare("SELECT failures, window_start FROM login_attempts WHERE ip = ?").bind(ip).first<{ failures: number; window_start: number }>()
  if (!row) return false
  if (Date.now() / 1000 - row.window_start > WINDOW_SECONDS) return false
  return row.failures >= MAX_FAILURES
}

export async function recordFailure(db: D1Database, ip: string) {
  const now = Math.floor(Date.now() / 1000)
  await db
    .prepare(
      `INSERT INTO login_attempts (ip, failures, window_start) VALUES (?1, 1, ?2)
       ON CONFLICT(ip) DO UPDATE SET
         failures = CASE WHEN ?2 - window_start > ?3 THEN 1 ELSE failures + 1 END,
         window_start = CASE WHEN ?2 - window_start > ?3 THEN ?2 ELSE window_start END`,
    )
    .bind(ip, now, WINDOW_SECONDS)
    .run()
}

export async function clearFailures(db: D1Database, ip: string) {
  await db.prepare("DELETE FROM login_attempts WHERE ip = ?").bind(ip).run()
}
