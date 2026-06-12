# Production readiness — go-live checklist

Status of the site for a real launch. Items are grouped by what's **done**, what
**blocks launch** (needs your accounts/info), and **nice-to-haves**.

---

## ✅ Done in this pass
- **Single source of truth** for brand/domain/social/analytics → `src/config/site.ts`
  (kills the old `yks.example` / `valueforge` / `phantomforge` scatter).
- **CMS review workflow** enabled (`editorial_workflow`): admin saves become draft PRs.
- **New essential pages:** custom `/404`, `/search` (wired to Pagefind), `/faq` (with FAQPage schema).
- **Search + FAQ** added to nav/footer.
- **Form spam protection** (Netlify honeypot) on newsletter + contact forms.
- **Removed broken preview galleries** (≈19 referenced preview images didn't exist).
- Build is green: 26 pages, sitemap + Pagefind index generated.

### Added in the latest pass
- **Interactive free tools** (`/tools`): live Habit Tracker + Focus Timer (localStorage, print/export), homepage now leads with them.
- **YKS Pro membership** — real premium tier: sales page (`/pro`), license-key unlock (`/pro/unlock`), gated member library (`/pro/library`), Lemon license validation + signed-cookie CDN gate. See **`PRO.md`**.
- **Sticker drop loop closed**: persistent collection, week streak, email capture (Netlify form).
- **On-brand visuals**: SVG tool mockups + monoline mascot (no stock photos).
- **Bug/trust fixes**: removed hard-coded `yks.example` from guide JSON-LD (now uses `SITE.url`); `robots.txt` is now generated from config; removed unconditional "Canva/Notion/QR" claims from every guide; print option no longer routes through Lemon Squeezy (which can't ship) and only shows with a real POD checkout URL; added HSTS header.

---

## 🚧 Blockers — required before launch (needs your input / accounts)

### 1. Domain & identity — `src/config/site.ts`
- [ ] `url` → your real domain (drives canonical URLs, sitemap, OG tags, JSON-LD).
- [ ] `email` → a real inbox (shown on contact + FAQ).
- [ ] `social` → real X/LinkedIn URLs, or delete the ones you don't use.
- [ ] Confirm the brand name. It's **YKS** everywhere now — if that's a placeholder, change it here.
- [x] ~~robots.txt sitemap URL~~ — now generated from `url` automatically (`src/pages/robots.txt.ts`). Just set `url`.

### 2. ⚠️ Content vs. positioning mismatch (important)
The design/copy positions YKS as **habits / focus / productivity printables**, but the
actual sample guides are a different niche — *AI Creator OS, Godot game dev, 3D-print
photography, Canva-to-3D mockups, Solopreneur OS*. Before launch, either:
- [ ] Replace the sample guides/blog with real on-brand content (via `/admin`), **or**
- [ ] Realign the brand/copy to match the maker/seller content.
- [ ] `annual-goals-tracker.pdf` has an old brand name baked into the file — regenerate it.

### 3. Payments — Lemon Squeezy
- [ ] Create products in Lemon Squeezy; paste each premium guide's `lemonSqueezyVariantId`
      (or `checkoutUrl`) via the CMS. Until then, paid checkout buttons are inert.
- [ ] Add `LEMONSQUEEZY_*` keys to Netlify env (see `.env.example`) if you add webhooks.
- [ ] Wire the **bundle builder** checkout URLs in `src/pages/bundles.astro` (`ALL_ACCESS_URL` / `PACK_URLS`).

### 3b. YKS Pro membership (the recurring tier) — see `PRO.md`
- [ ] Create the subscription product in Lemon Squeezy, enable license keys, paste the
      checkout URLs into `src/config/pro.ts`.
- [ ] Set Netlify env `PRO_COOKIE_SECRET` (required) and optionally `LEMON_PRO_VARIANT_ID`.
- [ ] Add high-res / editable / exclusive files to `public/downloads/pro/` and tag guides
      with `highResPdf` / `proOnly` / `proBonuses`.

### 3c. Email funnel (currently a dead end)
Netlify Forms *stores* signups but nothing delivers the promised lead magnet or weekly email.
- [ ] Connect an ESP (ConvertKit / Beehiiv / Resend) + autoresponder so signups actually
      receive the guide and the weekly systems email.

### 4. Social/OG images — `public/og/` is empty
Every `og:image` (`default-og.jpg`, `logo.png`, per-page) currently 404s, so link
previews on social/Slack/iMessage are blank.
- [ ] Add a default OG image + logo, **or** ask me to set up automated per-page OG image
      generation (recommended — branded share cards for every guide/post).

### 5. Legal pages — real entity details
- [ ] Review `/privacy`, `/terms`, `/refund-policy` and fill in your legal entity name,
      address, jurisdiction and contact. (They're drafted but generic.)

### 6. Forms — post-deploy
- [ ] After first deploy, confirm Netlify detected `newsletter` + `contact` forms.
- [ ] Set up submission notifications (email/Slack) in the Netlify dashboard.

### 7. Admin login — finish OAuth (see `ADMIN.md`)
- [ ] Set `repo` + `branch` in `public/admin/config.yml`.
- [ ] Register the GitHub OAuth app and invite admins as repo collaborators.

### 8. Favicons
- [ ] Confirm `public/favicon.svg` / `favicon.ico` are the real YKS mark (currently generic).

---

## ✨ Nice-to-have / hardening
- [ ] **RSS feed** — `@astrojs/rss` is installed but no feed route exists yet (good for the blog).
- [ ] **Dynamic OG images** (ties into #4).
- [ ] Bundle Alpine + Lemon.js locally instead of CDN for reliability/offline.
- [x] ~~HSTS header~~ added. Still optional: a Content-Security-Policy in `netlify.toml`.
- [ ] Error monitoring (e.g. Sentry) if you add any server/edge functions later.
- [ ] Remove now-unused `preview-*.svg` files and the inert `rating`/`downloads` schema fields.
