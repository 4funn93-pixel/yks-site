// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

import { SITE } from './src/config/site.ts';

/**
 * YKS - Value-forward printables (Guides, Calendars, Puzzles, Trackers)
 * Free lead magnets + premium downloads for $3-5.
 * Optimized for performance (95+ Lighthouse), SEO, and static hosting on Netlify.
 * View Transitions for SPA-like feel. Strict TypeScript.
 */
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },

  integrations: [
    mdx({
      // Enable GitHub-flavored markdown, smartypants for beautiful typography
      remarkPlugins: [],
      rehypePlugins: [],
      gfm: true,
      smartypants: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Custom pages added manually in code or via integration if needed
    }),
    pagefind({
      // Generates lightning-fast /pagefind/ index at build time
      // Custom UI implemented in /guides for advanced filters + facets
    }),
  ],

  // Image optimization with Sharp (excellent quality + perf)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: [],
    remotePatterns: [],
  },

  // Prefetch for instant navigation feel
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Experimental / future-proofing (2026 stable features)
  experimental: {},
});
