# YKS

**90% free content, 10% paid premium.**  
Part of YKS. Free guides, calendars, trackers (the vast majority). Premium curated packs and one premium system available. Start with the free versions (no signup). The 10% premium is optional.

A production-ready, high-converting Astro 2026 site built to rank in Google + AI search engines, convert at elite rates, and be trivial for a non-technical founder to maintain and expand.

## Tech Stack (Strict)

- **Astro 6+** (latest stable, TypeScript strict, View Transitions)
- **Tailwind CSS v4** + custom premium dark-first theme (indigo #6366f1 / violet #a855f7)
- **Content Collections** with strict Zod schemas (source of truth)
- **astro-pagefind** for lightning-fast client-side search + facets
- **Alpine.js** (CDN) for modals, filters, accordions, theme toggle, progress — zero heavy JS
- **Lemon Squeezy** + Lemon.js for all paid checkout overlays (best-in-class digital delivery)
- **Netlify** static hosting + Forms
- **Decap CMS** (admin login at /admin for uploading files to guides/blog/downloads/images sections + editing content — no code needed)
- **@astrojs/sitemap**, Astro Image (Sharp), full JSON-LD everywhere, Plausible analytics

**Target**: 95+ Lighthouse. Zero React islands unless absolutely justified.

## Project Structure (Key Paths)

```
src/
├── content/
│   ├── config.ts              # Zod schemas for guides + blog (EDIT HERE FIRST)
│   ├── guides/                # 8+ .mdx files (persuasive sales copy + MDX components)
│   └── blog/                  # 4+ SEO blog posts with internal links to guides
├── components/
│   ├── Navbar.astro, Footer.astro, BaseLayout.astro
│   ├── GuideCard.astro, LemonBuyButton.astro, FreeDownloadButton.astro, Callout.astro
├── layouts/BaseLayout.astro   # SEO + JSON-LD powerhouse + ViewTransitions + Alpine + Lemon.js
├── pages/
│   ├── index.astro            # High-conversion landing
│   ├── guides/
│   │   ├── index.astro        # Advanced Pagefind + filter UI
│   │   └── [slug].astro       # The money page (lightbox, FAQ accordion, sticky CTA, etc.)
│   ├── blog/[...slug].astro
│   └── about, contact, legal, thank-you
├── styles/global.css          # Full design system
public/
├── downloads/                 # Real Canva PDFs go here (named exactly as in frontmatter)
├── images/guides/             # Cover + 4–7 preview SVGs/PNGs per guide
├── images/blog/               # Blog post covers
├── admin/                     # Decap CMS admin UI (login + upload files to sections)
└── og/                        # Social images
```

## Local Development

```bash
npm install
npm run dev
```

**Windows / "local server shows site not up"**: npm may be blocked by PowerShell execution policy. Run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or launch with:

```powershell
cmd /c "npm run dev"
# or: npx astro dev
```

Then visit http://localhost:4321 (or the port shown).

Build + Pagefind index:

```bash
npm run build
# dist/ is ready for Netlify. Pagefind index auto-generated in dist/pagefind/
```

Preview production build (the exact files that will be on Netlify, including the new admin UI):

**Windows-safe commands** (use these if plain `npm run preview` fails due to execution policy):

```powershell
# Build first (includes /admin for the CMS)
cmd /c "npm run build"

# Then preview
cmd /c "npx astro preview --port 4321"
```

Look for:

```
astro  v6.4.2 ready in X ms
┃ Local    http://localhost:4321/
```

Then open browser:

- Main site: http://localhost:4321
- **Admin login + file upload UI (preview the new feature locally)**: http://localhost:4321/admin/index.html

**Notes**:
- On the real deployed Netlify site (after adding the redirect we put in netlify.toml), you can use the clean URL `https://yoursite.com/admin`.
- Locally in `astro preview` or `astro dev`, use the full `/admin/index.html` because Astro's built-in server doesn't process Netlify `_redirects` / `netlify.toml` rules.
- The admin UI will load (Decap CMS). You can explore the "Guides" and "Blog" collections and see the upload fields for PDFs (to downloads section), covers, and preview images. Full login + save only works after Netlify deploy + enabling Identity (see "Adding a New Guide" section below).
- For development with instant reload while you test: `cmd /c "npx astro dev"` (or after policy fix: `npm run dev`). Same URLs work.

## Adding a New Printable (Guides / Calendars / Puzzles / Trackers) — Value-Forward Model + Admin!

**Preferred (easiest): Use the built-in Admin CMS**

1. **Deploy to Netlify** (or use existing) and **set up admin access**:
   - Push to GitHub → connect repo in Netlify.
   - Netlify site → Identity → Enable.
   - Visit `https://YOUR-SITE.netlify.app/admin` (or custom domain /admin).
   - Log in (first time: invite your email via Netlify Identity panel).

2. **Export assets from Canva** as before (cover, PDF named `your-kebab-slug.pdf`, 4–7 previews).

3. **In Admin**:
   - Click **"Guides"** → **"New Guide"**.
   - Fill fields (most are self-explanatory and match the schema).
   - For images/PDF: click the image or file fields → **Upload** (they go straight to the right `public/...` folders and set the correct paths like `/downloads/your-kebab-slug.pdf` and `/images/guides/...`).
   - Choose category, add tags, set price/isFree, dates, etc.
   - Paste/write the body in the Markdown editor (copy structure + frontmatter fields from an existing guide). If using `<Callout>`, start the body with the import line (see one of the free guides).
   - Save → it commits to your repo → Netlify rebuilds and publishes.

4. **Lemon Squeezy** (paid guides):
   - Same as before: create product, upload PDF (or use the one from admin), copy Variant ID into the Lemon field in admin.

5. **Test**: After deploy, check the new guide at `/guides/your-kebab-slug`, search, filters, download (free) or checkout.

**Manual / power-user fallback** (still works, for complex MDX):
- Drop files into `public/downloads/`, `public/images/guides/`, `public/images/blog/`.
- Create/edit `.mdx` in `src/content/guides/` or `blog/`.
- `git add`, commit, push.

**Blog posts**: Same admin flow under the "Blog" collection (cover uploads go to blog images folder).

**Other sections** (bundles, about, legal): Currently hardcoded in `.astro` files for maximum performance/control. Edit directly or open an issue for CMS-ifying them.

**Pro tip**: Use admin for all file uploads + new entries. Still craft high-quality persuasive copy for the body (the #1 conversion lever).

**Pro tip**: Update `downloads` and `rating` numbers in frontmatter every month or after big launches for social proof.

## Lemon Squeezy Setup (Critical)

1. Sign up at lemonsqueezy.com
2. Create products only for the 10% premium items (e.g. the one premium guide + the 3 curated packs at $5–11)
3. For each product:
   - Enable "Hosted Checkout"
   - Upload PDF as the deliverable (or use "Custom URL" if you self-host)
   - Configure tax/VAT handling (they do it automatically)
   - Copy **Variant ID** (long number) into the guide's `lemonSqueezyVariantId`
4. In production the global `Lemon.js` script (already in BaseLayout) + `LemonBuyButton` component handles everything.

**Success URL**: We redirect to `/thank-you?success=true&order=...` (customize in Lemon dashboard or via JS).

## Netlify Deployment

1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables if needed (see `.env.example`)
5. **Forms**: Netlify auto-detects `data-netlify="true"` forms (newsletter + contact)
6. Add custom domain + force HTTPS
7. (Optional) Add Plausible or other privacy analytics in `BaseLayout`

**Security headers, PDF caching, and redirects** are already configured in `netlify.toml`.

## SEO & Launch Checklist (2026)

- [ ] Update `site` in `astro.config.mjs` + all canonicals/OG
- [ ] Replace placeholder OG images in `public/og/`
- [ ] Submit sitemap (`/sitemap-index.xml`) to Google Search Console + Bing
- [ ] Verify structured data with Google's Rich Results Test
- [ ] Set up Plausible goals: "Buy Guide", "Download Free", "Newsletter Signup"
- [ ] Write 3–5 more blog posts targeting long-tail keywords (use the existing ones as templates)
- [ ] Initial promotion: X/Threads thread, relevant Reddit (r/3Dprinting, r/solopreneur, r/godot, r/EtsySellers), Product Hunt "Indie Hackers" launch, Discord communities
- [ ] Claim Google Business / Knowledge Panel if applicable
- [ ] Add real Canva exports + update all `downloads` counts after first 100 sales

## Customization Guide

**Colors / Brand**:
- Edit `src/styles/global.css` (`@theme` section) + Tailwind classes
- Update Navbar logo wordmark

**Niche Swap**:
- Change copy in `BaseLayout`, homepage, and About
- Update categories in `config.ts` Zod enum
- Swap guide/blog content

**Name Change**:
- Global search/replace old brand names if rebranding further (careful with assets and LS products)

## Competitor Research & Top-Selling Guide Patterns (2026)

We analyzed top Gumroad/Etsy/Sellfy digital guide sellers and high-converting creator landing pages (Ali Abdaal-style, Unbounce examples, 2026 landing page studies).

**What top competitors have on their sites:**
- Hero with **specific, number-backed claims** + timeline ("Ship in 90 days", "3.4× conversion", "$41k/mo").
- **"What's Included"** with tangible assets (templates count, Notion clones, checklists, video QR codes).
- **Undeniable proof**: Case studies with revenue numbers, "X shops did Y", before/after screenshots, "sold to 2,300+".
- Long-form "What's Inside" / detailed TOC with benefits ("so you can...").
- **Preview gallery** (4-8 inside page screenshots in lightbox).
- FAQ that directly handles objections ("Do I need Pro?", "How fast results?").
- Strong guarantee + "instant delivery" + trust (Lemon/Gumroad).
- Free lead magnet that delivers real value (chapter + templates) + email for weekly systems.
- Bundles, lifetime updates, private community as bonuses.
- Mobile-first, fast, beautiful dark premium aesthetic with clear single CTA focus.

**Top selling guides patterns:**
- Tools + systems > pure advice. 90% free; premium items (curated packs + select premium guide) priced $5–11.
- Include ready-to-use assets (Canva templates, Notion workspaces, Google Sheets, checklists).
- Specific niches + outcomes ("3D Print Business from 0 to 500 orders", "Canva mockups that 3x Etsy sales").
- High % success in: 3D design/assets, productivity systems (Notion), AI tools/playbooks, design templates, solopreneur OS.
- Comprehensive (50-150 pages) but scannable with frameworks, examples, and copy-paste elements.
- Bundles and "includes X templates" outperform plain PDFs.

**How we made our starter guides match:**
- Updated all 8 example guides with specific outcomes, template counts, revenue/case study claims, and "includes" language in titles/descriptions/keyOutcomes.
- Added `<GuideIncludes>` component on detail pages showing tangible deliverables.
- Homepage hero/stats now use competitor-style specific claims and proof.
- /guides and lead magnet emphasize templates + results.

This positions YKS to compete directly with top Gumroad performers in the productivity printables and creator tools space.

## Future Roadmap Ideas (Low Dev Lift)

- Affiliate program (Lemon Squeezy has built-in)
- Membership tier (recurring via LS)
- User accounts + library (Astro + Netlify Edge or simple password-protected pages)
- Email sequence automation (ConvertKit / Beehiiv + tags on purchase)
- A/B test hero/CTA with Netlify Edge
- Community Discord gated by purchase (via Lemon webhook)

## Support & License

This is a complete, production-grade starter. Use it for your business. Modify freely.

Built with obsession for craft, performance, and conversion.

Questions? Open an issue or email the address in the footer.

---

**Ship with precision.**
