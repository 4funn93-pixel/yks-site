# Admin / CMS setup (YKS)

The site has a content admin at **`/admin`** powered by [Sveltia CMS](https://github.com/sveltia/sveltia-cms)
(a fast, modern drop-in for Decap/Netlify CMS). Admins log in with **GitHub**, edit
guides and blog posts in a visual editor, upload PDFs and images, and **save → the
change is committed to the repo → Netlify rebuilds and publishes automatically.**

No database, no servers to run. Content lives as files in the repo
(`src/content/guides`, `src/content/blog`) and uploads land in `public/`.

> 🔒 **Keep YKS separate from PhantomPrints.** This site belongs to the **partner's**
> GitHub + Netlify account. The repo in `config.yml` must be the partner's repo — never
> `PhantomPrints/*`. When each editor signs in to `/admin` with **their own** GitHub
> account, Sveltia commits as that person via GitHub, so attribution is per-editor and
> everything lands in the partner's repo. (This PC's command-line git identity is also
> set locally to a neutral `YKS Team`, so terminal commits here never post as PhantomPrints.)

> ⚠️ The old scaffold used Netlify Identity + Git Gateway, which Netlify retired for
> new sites. This setup replaces it with GitHub OAuth, which is current and free.

---

## One-time setup

### 1. Put the code on GitHub and connect Netlify
1. Create a GitHub repository and push this project to it.
   (Your local branch is currently **`master`** — whatever branch you push and let
   Netlify build from is the one you'll use in step 3.)
2. In Netlify, connect that repo. Build settings already live in `netlify.toml`
   (`npm run build` → `dist`). Note your site URL (e.g. `https://yourname.netlify.app`).

### 2. Point the CMS at your repo
Edit **`public/admin/config.yml`** and set the two placeholders:
```yaml
backend:
  name: github
  repo: PARTNER_OWNER/REPO   # the PARTNER's repo, e.g. partners-username/yks-site
  branch: main               # the branch Netlify builds from
```

### 3. Enable GitHub login (pick ONE option)

#### Option A — Netlify's OAuth provider (simplest, nothing to host)
1. **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: your site URL
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
   - Register, then copy the **Client ID** and generate a **Client Secret**.
2. **Netlify → your site → Site configuration → Access & security → OAuth →
   Install provider → GitHub**, and paste the Client ID + Secret.
3. Nothing else to change — `config.yml` uses Netlify's OAuth endpoint by default.

> If your Netlify plan doesn't show the OAuth provider option, use Option B.

#### Option B — Cloudflare Workers relay (self-hosted, fully future-proof)
1. Deploy [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth)
   to Cloudflare Workers (free). Set its `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
   and `ALLOWED_DOMAINS` (your site domain).
2. In the GitHub OAuth App, set the callback URL to
   `https://<your-worker>.workers.dev/callback`.
3. In `config.yml`, uncomment and set:
   ```yaml
   base_url: https://<your-worker>.workers.dev
   ```

### 4. Add your admins
**GitHub → the repo → Settings → Collaborators → Add people**, and give each admin
**Write** access. They accept the emailed invite. That's it — anyone with write
access to the repo can log in at `/admin`.

To remove an admin later, remove them as a collaborator.

---

## Daily use
1. Go to **`https://your-site/admin`** and click **Sign in with GitHub**.
2. Pick **Printables** or **Blog**, create or edit an entry, upload the PDF/cover, **Save**.
3. Netlify redeploys in ~1 minute and the change is live.

**Review workflow is already ON** (`publish_mode: editorial_workflow` in `config.yml`).
With two editors this is the safe default: a save becomes a **draft pull request** that
the other person can review and merge to publish. To publish instantly instead, change it
to `publish_mode: simple`.

---

## Editing locally (optional, no login)
`config.yml` has `local_backend: true`, so you can edit against local files:
```bash
npm run dev                       # in one terminal (serves on the port it prints, e.g. 4330)
npx @sveltia/cms-proxy-server     # in another
```
Then open `http://localhost:<that-port>/admin`. Saves write directly to your working tree.

---

## Notes
- **Field limits match the content schema** in `src/content.config.ts` (title length,
  price ≤ $15, required cover image, etc.), so the editor won't let admins save
  content that would break the build.
- The admin is excluded from search engines (`robots.txt` + `noindex`).
- We intentionally removed the old `rating` / `downloads` / `testimonials` fields from
  the editor — add real, attributable reviews only when you have them.
