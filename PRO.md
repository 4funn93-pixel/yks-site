# YKS Pro — Membership setup

YKS Pro is the premium tier: a recurring subscription that unlocks unlimited
high-resolution / editable / exclusive downloads behind `/pro/library`. The free
90% of the site is untouched. This doc is the one-time setup.

## How it works

```
visitor → /pro (sales page) → Lemon Squeezy subscription checkout
        → Lemon emails a LICENSE KEY
member  → /pro/unlock (paste key) → pro-login function validates it with Lemon
        → sets a signed httpOnly cookie (30 days)
member  → /pro/library + /downloads/pro/* are gated by the pro-gate edge function,
          which verifies that cookie at the CDN
```

- Sales/pricing page: `src/pages/pro/index.astro` (reads `src/config/pro.ts`)
- Unlock page: `src/pages/pro/unlock.astro`
- Member library: `src/pages/pro/library.astro`
- License validation: `netlify/functions/pro-login.mjs` (+ `pro-logout.mjs`)
- CDN gate: `netlify/edge-functions/pro-gate.js`

Lemon Squeezy is digital-only, which is exactly right here — Pro is digital.
(Physical print fulfilment is a separate rail; see the print section in README.)

## Setup (≈15 min)

1. **Create the subscription product in Lemon Squeezy**
   - New product → **Subscription**. Add a monthly variant ($7) and/or a yearly
     variant ($49). 
   - In the product's **License keys** setting, enable license key generation.
   - Copy each variant's **Hosted checkout URL**.

2. **Configure the site** — edit `src/config/pro.ts`:
   ```ts
   checkoutMonthly: 'https://yourstore.lemonsqueezy.com/checkout/...',
   checkoutYearly:  'https://yourstore.lemonsqueezy.com/checkout/...',
   ```
   Once either is set, `PRO_LIVE` flips true and the `/pro` CTA links to checkout
   (before that it shows a "launching soon" capture).

3. **Set Netlify environment variables** (Site settings → Environment variables):
   - `PRO_COOKIE_SECRET` — a long random string (e.g. `openssl rand -hex 32`).
     Used to sign/verify the membership cookie. **Required.**
   - `LEMON_PRO_VARIANT_ID` — *optional.* If set, only license keys for that
     variant are accepted (stops a key from another product unlocking Pro).

4. **Add the Pro files** — drop high-res / editable PDFs into
   `public/downloads/pro/`, then mark them in the guide's frontmatter:
   ```yaml
   highResPdf: "/downloads/pro/daily-habit-tracker-hires.pdf"
   proBonuses:
     - "300dpi print-ready PDF"
     - "Editable Canva template"
   ```
   For a **Pro-exclusive** item (whole thing gated, no free version) set
   `proOnly: true` instead. Files under `/downloads/pro/*` are gated by the edge
   function, so they're only reachable by members.

   > ⚠️ **Premium files + repo visibility — read before committing paid PDFs.**
   > The edge gate protects the live **URL**, not the **repo source**. Committing
   > real premium PDFs to `public/downloads/pro/` is therefore **only safe on a
   > PRIVATE repo**. On a **public** repo those files are readable straight from
   > Git (and its history) by anyone, gate or no gate.
   >
   > **Plan: this site goes PRIVATE at go-live**, so committing gated PDFs to
   > `public/downloads/pro/` is the intended path (see [DEPLOY.md](DEPLOY.md) for
   > the Netlify contributor/plan implication — a private repo on the free plan
   > only builds with a single Git contributor; more than one needs Netlify Pro).
   >
   > Until the repo is actually flipped to private: **never** `git add` a real
   > paid PDF. A placeholder `README.txt` is the only thing that belongs in
   > `public/downloads/pro/` while the repo is still public.

5. **Deploy.** Netlify auto-detects `netlify/functions` and `netlify/edge-functions`.
   To test locally with functions running, use `netlify dev` (not `astro dev`,
   which doesn't run the edge gate — pages are reachable locally without it).

## Notes

- The gate is CDN-level (good enough for low-priced digital goods). It is not
  DRM; a determined member could reshare a downloaded file. That's an acceptable
  trade for the conversion benefit, same as every Gumroad/Lemon product.
- Cookie lasts 30 days, then the member re-enters their key. Adjust `MAX_AGE` in
  `pro-login.mjs` if you want longer.
- `/pro/library` and `/pro/unlock` are `noindex` and disallowed in robots.txt.
