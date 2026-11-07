# Portfolio API (owner dashboard backend)

A Cloudflare Worker that stores the site's content and serves it to the public site and to the owner dashboard at `/admin`.

- **D1** `portfolio-db` (binding `DB`): projects, reviews, settings and login attempts
- **R2** `portfolio-images` (binding `MEDIA`, private): uploaded images and the CV, served through `GET /media/*`
- **Hono + Zod**, with a single owner login (email and password) that returns a 12-hour bearer token

The public site (`src/lib/content.ts`) shows its built-in content first, then swaps in `GET /content` once the page has loaded. If the API is down, the built-in content stays on screen.

## Local development

```bash
cd worker
npm install
node scripts/make-dev-vars.mjs        # creates .dev.vars (login: owner@local.test / local-dev-password)
npm run db:migrate:local
node scripts/seed.mjs                 # copies the current projects, settings, images and Mostaql review drafts
npm run dev                           # http://localhost:8787
```

In another terminal, from the repo root:

```bash
echo "VITE_API_BASE=http://localhost:8787" > .env.development   # git-ignored
npm run dev                                                     # site: http://localhost:3000, dashboard: /admin
```

## Tests

With `npm run dev` running:

```bash
node --test test/api.test.mjs   # 30 API tests: auth, lockout, CORS, headers, validation, uploads, data integrity
node test/integrity.mjs         # stored data is valid, published content equals the built-in content, every image exists
```

`test/integrity.mjs` also works against the deployed API: `node test/integrity.mjs https://api.eng-abdullahgamal.site <email> <password>`.

## Deploying (first time)

The D1 database `portfolio-db` and the R2 bucket `portfolio-images` already exist and are configured in `wrangler.jsonc`; don't create them again. Run everything from `worker/`.

1. **Sign in to Cloudflare.** Run `npx wrangler login` in your own terminal (it opens a browser), then `npx wrangler whoami` and check it shows the account that owns `eng-abdullahgamal.site`, `portfolio-db` and `portfolio-images`.
2. **Check the config without deploying:** `npx wrangler deploy --dry-run`. It should list `env.DB (portfolio-db)` and `env.MEDIA (portfolio-images)`.
3. **Create the tables in the real database:** `npm run db:migrate:remote` (applies `migrations/0001_init.sql` once; safe to re-run).
4. **Check the `api` hostname is free:** in the Cloudflare dashboard, open DNS for `eng-abdullahgamal.site`. There must be no existing `api` record; the deploy creates it.
5. **Deploy:** `npm run deploy`. This attaches `api.eng-abdullahgamal.site` as a Worker custom domain (DNS record and certificate are created automatically). Until step 6 is done, sign-in answers 503 and stays closed; public content already works.
6. **Set the three secrets.** Each command asks for the value in a hidden prompt, so it never lands in shell history or the repo:
   ```bash
   npm run hash-password                          # type your password (12+ characters); copy the printed pbkdf2$… line
   npx wrangler secret put OWNER_EMAIL            # your sign-in email
   npx wrangler secret put OWNER_PASSWORD_HASH    # paste the pbkdf2$… line (not the password itself)
   openssl rand -hex 32                           # copy the output
   npx wrangler secret put TOKEN_SECRET           # paste it
   ```
7. **Copy the content in:** `node scripts/seed.mjs --remote`. This inserts the 19 projects, 9 settings and 8 review drafts and uploads 116 images. It only adds what's missing, so running it twice is safe.
8. **Check:**
   - `https://api.eng-abdullahgamal.site/content` returns the projects;
   - `node test/integrity.mjs https://api.eng-abdullahgamal.site <email> <password>` prints “All integrity checks passed”;
   - sign in at `https://eng-abdullahgamal.site/admin` once the site with the dashboard is deployed.

### Later

- **Change the password:** run `npm run hash-password` and `npx wrangler secret put OWNER_PASSWORD_HASH` again.
- **Sign out everywhere:** set a new `TOKEN_SECRET`; every existing token stops working.
- **New schema changes:** add a file under `migrations/`, then `npm run db:migrate:remote` before deploying the code that needs it.
- **Backups:** `npx wrangler d1 export portfolio-db --remote --output backup.sql`.

The site reads `VITE_API_BASE`, which defaults to `https://api.eng-abdullahgamal.site`. Build with `VITE_API_BASE=` (empty) to run it on its built-in content only.

## Security notes

- One owner account. Passwords are stored as PBKDF2-SHA256 hashes (100k iterations, the Workers maximum); tokens are HMAC-signed, last 12 hours and are kept in `sessionStorage` (cleared when the tab closes).
- 5 failed sign-ins per IP lock the login for 15 minutes (`Retry-After: 900`).
- All owner routes require a valid token; without the three secrets they answer 503.
- Links saved from the dashboard must be `http(s)` (no `javascript:`/`data:`); image references must be keys this API created.
- Uploads: WebP only (checked by file signature), 3 MB per size, PDFs checked for `%PDF-`, 8 MB max; JSON bodies capped at 256 KB.
- Responses carry `nosniff`, `X-Frame-Options: DENY` and a `default-src 'none'` CSP; owner responses are `no-store`.
- CORS allows the production domain, the Firebase preview channels (`my-portofolio-9d70c--*.web.app`) and localhost only.
- The dashboard page itself (`/admin` on Firebase Hosting) gets a strict CSP (scripts from the site only, connections only to the API), `frame-ancestors 'none'` and `noindex`; see `firebase.json`.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/content` | public | Published projects (by tier), published reviews and settings |
| GET | `/media/*` | public | Images and CV from R2 (immutable cache) |
| POST | `/auth/login` | — | Email + password → token |
| GET | `/admin/me` | owner | Token check and media base URL |
| GET, POST | `/admin/projects` | owner | List all (including drafts) and create |
| PUT, DELETE | `/admin/projects/:id` | owner | Update (send `updatedAt`; 409 if changed elsewhere) and delete. Replaced and deleted uploads are removed from R2 |
| PATCH | `/admin/projects/reorder` | owner | `{ ids }` in display order |
| GET, POST, PUT, DELETE, PATCH | `/admin/reviews…` | owner | Same as projects |
| GET | `/admin/settings` | owner | Saved settings |
| PUT | `/admin/settings/:key` | owner | `contact`, `metrics`, `heroChips`, `problem`, `architecture`, `stack`, `principles`, `howModes`, `howSteps` |
| POST | `/admin/media` | owner | multipart `folder`, `w800`, `w1600` (WebP, resized in the browser) |
| DELETE | `/admin/media?key=` | owner | Delete an unsaved upload (refused while content still uses it) |
| POST | `/admin/cv` | owner | multipart `file` (PDF, max 8 MB) |
