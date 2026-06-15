# YKS — $0 free-tier deploy & test checklist

Get the site **live and fully testable for $0** — no custom domain, no paid plans,
payments in Lemon **test mode**. Should take ~30–45 min.

> 🔒 **Separation rule (read first):** YKS lives under the **partner's** GitHub +
> Netlify. Never connect this to a PhantomPrints repo, account, or Netlify team.
> Every "log in" / "connect" step below = the **partner's** account.

Everything here stays on free tiers:
Netlify (free) · GitHub (free) · Sveltia CMS (free) · Netlify Functions + Edge
(free) · Lemon Squeezy (test mode, free) · email (free tier). Only a custom domain
costs money later — skip it for testing and use the free `*.netlify.app` URL.

---

## 1. Push the code to the partner's GitHub  (~5 min)

1. **Partner** creates a new **private**, empty repo on GitHub — e.g. `yks-site`
   (no README/license, so it's empty).
2. On this PC, from the project folder, push to it. The commit author is already
   the neutral local `YKS Team` identity (not PhantomPrints):
   ```bash
   git add -A
   git commit -m "YKS: full site + Pro membership"
   git branch -M main
   git remote add origin https://github.com/PARTNER-USERNAME/yks-site.git
   git push -u origin main
   ```
   - ⚠️ Double-check the `origin` URL is the **partner's** repo before pushing.
   - You'll authenticate as the partner (browser login or a Personal Access Token
     with `repo` scope for their account).

- [ ] Code is on the partner's GitHub, branch `main`.

> ⚠️ **Netlify free plan = ONE Git contributor on PRIVATE repos.** If the repo is
> private, Netlify's free plan only builds commits from a single linked
> contributor; any other commit author fails the build with *"unrecognized Git
> contributor."* This bites two ways here: (1) commits authored by the neutral
> `YKS Team` identity aren't the partner's linked account, and (2) two CMS editors
> = two contributors. **You can have any two of: private code · two editors · $0.**
> - **$0 + two editors → make the repo PUBLIC** (safe: no secrets are committed;
>   all secrets live in Netlify env vars). Keep **premium PDFs out** of a public
>   repo — see [PRO.md](PRO.md).
> - **Private + two editors → Netlify Pro** (~$19/mo, everything else unchanged).
> - **Private + $0 → deploy via GitHub Actions/CLI** instead of Netlify's Git
>   integration (the contributor check only applies to git-linked builds; more setup).
>
> Do **not** rely on toggling public→private per deploy — it re-breaks on the next
> push and on every editor's CMS save.

## 2. Connect Netlify (free)  (~5 min)

1. **Partner** logs in to Netlify (free) → **Add new site → Import an existing project → GitHub** → pick `yks-site`.
2. Build settings auto-fill from `netlify.toml` (`npm run build` → publish `dist`). Leave as-is.
3. **Deploy.** You get a URL like `https://random-name.netlify.app`.
4. (Optional, free) **Site configuration → Change site name** → e.g. `yks` → `https://yks.netlify.app`.

- [ ] Site builds green and the `*.netlify.app` URL loads.

## 3. Point the site at its own URL  (~2 min)

So canonical URLs, sitemap and OG tags are correct, set the live URL in
`src/config/site.data.json` (or via the CMS later under **Site Settings**):
```json
"url": "https://yks.netlify.app",
"email": "your-real-inbox@example.com"
```
Commit + push → Netlify redeploys.

- [ ] `url` matches the live netlify.app address.

## 4. Add the Pro secret (env var)  (~3 min)

The Pro license gate needs one secret. Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Netlify → **Site configuration → Environment variables → Add**:
- `PRO_COOKIE_SECRET` = (paste the value)

Then **Deploys → Trigger deploy → Deploy site** so functions pick it up.

- [ ] `PRO_COOKIE_SECRET` set and redeployed.

## 5. Turn on the admin login (free GitHub OAuth)  (~10 min)

Follow **[ADMIN.md](ADMIN.md) → Option A**. In short:
1. Set `repo:` in `public/admin/config.yml` to the partner's `owner/repo`, `branch: main`.
2. Register a GitHub **OAuth App** (callback `https://api.netlify.com/auth/done`).
3. Netlify → **Access & security → OAuth → Install GitHub provider** (paste Client ID + Secret).
4. **Add both editors** as repo **collaborators** (Write).
5. Visit `https://yks.netlify.app/admin`, sign in with GitHub, make a tiny test edit → it opens a draft PR (editorial workflow is on).

- [ ] Both editors can log in to `/admin` and save.

## 6. Payments in TEST mode (free)  (~10 min)

1. Create a Lemon Squeezy account (free) → toggle **Test mode** (top of dashboard).
2. **Pro membership:** New product → **Subscription** → add monthly ($7) and/or
   yearly ($49) variants → enable **License keys** on the product. Copy each
   **hosted checkout URL**.
3. Put those URLs in **`src/config/pro.data.json`** (or CMS → **Pro Settings**):
   ```json
   "checkoutMonthly": "https://...test... ",
   "checkoutYearly":  "https://...test... "
   ```
4. (Optional) Create test products for any paid guides / premium packs and paste
   their variant IDs / checkout URLs via the CMS.
5. Commit + push → redeploy.

**Test the full Pro loop** (use Lemon's test card `4242 4242 4242 4242`, any future
expiry/CVC):
`/pro` → Go Pro → checkout → Lemon emails a **test license key** →
`/pro/unlock` (paste key) → redirected to `/pro/library` (gated) → download works.

- [ ] Full Pro purchase → unlock → gated library works in test mode.

## 7. Email capture (free, optional for first test)

The newsletter / contact / sticker forms already use **Netlify Forms** (free,
unlimited). Submissions appear in **Netlify → Forms**; add an email notification
there. (Full autoresponder = connect Kit/Beehiiv/Resend later — see GO-LIVE.md.)

- [ ] Submitting the newsletter form shows up in Netlify → Forms.

## 8. Smoke test (5 min)

Open the live site and check:
- [ ] Home loads; hero + Habit Tracker mockup render.
- [ ] `/tools/habit-tracker` — add a habit, tick a day, streak counts, reload persists.
- [ ] `/tools/focus-timer` — starts and counts down.
- [ ] Sticker drop — pick a box, collection + streak update.
- [ ] `/pro` — monthly/yearly toggle changes price.
- [ ] Pro test purchase → `/pro/unlock` → `/pro/library` (from step 6).
- [ ] A free guide downloads its PDF.
- [ ] `/robots.txt` shows your real URL; visit a bad path → custom 404.

---

## Cost so far: **$0**
netlify.app subdomain · Netlify free · GitHub free · CMS free · functions/edge free ·
Lemon test mode free · email free tier.

## When you're ready to take real money / go fully live
- Flip Lemon Squeezy out of test mode (real ~5% + $0.50/sale; +0.5% subs).
- (Optional) Buy a custom domain (~$12/yr) and add it in Netlify → Domains.
- Replace placeholder OG images in `public/og/` (or ask to add auto OG generation).
- Connect an ESP for real email automation.
- See **GO-LIVE.md** for the full pre-launch list.

> Reminder: every account above is the **partner's**. If anything ever prompts for
> a PhantomPrints login, stop — that's the line we're keeping clean.
