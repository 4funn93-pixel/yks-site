import { defineCollection, z } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * YKS — Value-forward printables (Guides, Calendars, Puzzles, Trackers)
 *
 * 90% free content + 10% paid premium model.
 * Vast majority of guides are free (price: 0, isFree: true). A small number of premium guides and the curated packs are paid.
 * This Zod schema powers:
 * - Product cards, detail pages, filters (by category: Guides/Calendars/Puzzles/Trackers), search
 * - SEO + structured data
 * - Lemon Squeezy (or checkoutUrl) for the few paid premium digital downloads
 * - Optional printPrice / printVariantId for high-quality shipped physical printouts
 * - Free vs Paid logic (isFree + price)
 *
 * Adding a new printable? Add .mdx in src/content/guides/ (collection name kept for minimal refactor)
 * with matching frontmatter. Use the admin at /admin for easy uploads of PDFs + covers.
 * See README for updated workflow.
 */

// Shared image helper (Astro Image)
const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

// FAQ item for accordion + FAQPage schema
const faqSchema = z.object({
  question: z.string().min(10),
  answer: z.string().min(20),
});

// Testimonial (embedded or referenced)
const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  companyOrHandle: z.string().optional(),
  avatar: z.string().optional(),
  rating: z.number().min(4).max(5).optional(),
});

const guidesCollection = defineCollection({
  // Use URL for base (robust across OS, CI, and build envs in Astro 5+/6+ content layer)
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: new URL('./content/guides', import.meta.url) }),
  schema: ({ image }) =>
    z.object({
      // Core Identity
      title: z.string().min(12).max(85),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // kebab-case, matches filename
      description: z.string().min(60).max(220), // SEO meta + card

      // Business & Monetization — 90% free content, 10% paid premium (most guides free; premium guides + packs are the paid 10%)
      price: z.number().min(0).max(15), // 0 = free (the 90%); small number of premium items use $3–11

      isFree: z.boolean().default(false),
      lemonSqueezyVariantId: z.string().optional(), // e.g. "123456" — for paid digital PDF ($3-10)
      checkoutUrl: z.string().url().optional(), // Fallback direct checkout URL for digital

      // Physical print option (high-quality shipped printout)
      printPrice: z.number().min(5).optional(), // e.g. 15-25 for printed + shipping
      printLemonSqueezyVariantId: z.string().optional(), // separate variant for physical fulfillment
      printCheckoutUrl: z.string().url().optional(),

      // Files & Assets (store in /public)
      pdfFilename: z.string().default(''), // e.g. "/downloads/canva-to-3d-mockups.pdf" (full path; admin CMS uploads set this) — placed in /public/downloads/
      coverImage: imageSchema, // { src: "/images/guides/xxx.jpg", alt: "..." }
      previewImages: z.array(imageSchema).min(3).max(8).optional(), // 4-6 Canva page screenshots for lightbox

      // Categorization & Discovery — value-forward categories
      category: z.enum([
        'Guides',
        'Calendars',
        'Puzzles',
        'Trackers',
      ]),
      tags: z.array(z.string()).min(2).max(8),

      // Social Proof & Trust
      rating: z.number().min(4.0).max(5.0).default(4.8),
      downloads: z.number().int().positive().default(1240), // Update manually or via future analytics
      testimonials: z.array(testimonialSchema).optional(),

      // Publishing & SEO
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('YKS Team'),
      readingTime: z.string().default('18 min'), // Estimated pages / density

      // Content Structure (used in detail page)
      faqs: z.array(faqSchema).min(3).max(7).optional(),
      keyOutcomes: z.array(z.string()).optional(),
      whoThisIsFor: z.array(z.string()).optional(),

      // YKS Pro (premium membership tier)
      proOnly: z.boolean().default(false), // entire item is Pro-exclusive (gated)
      highResPdf: z.string().optional(),   // e.g. "/downloads/pro/xxx-hires.pdf" — Pro high-res/editable version
      proBonuses: z.array(z.string()).optional(), // what Pro adds on top of the free version

      // Internal
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const blogCollection = defineCollection({
  // Use URL for base (robust across OS, CI, and build envs in Astro 5+/6+ content layer)
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: new URL('./content/blog', import.meta.url) }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(20).max(75),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // kebab-case, matches filename (for consistency with guides + URL routing)
      description: z.string().min(90).max(185),
      coverImage: imageSchema,
      category: z.enum(['Productivity', 'Planning', 'Mindfulness', 'Creativity', 'Organization', 'Fun & Games']),
      tags: z.array(z.string()).min(2).max(6),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('YKS Team'),
      authorRole: z.string().default('Curator, YKS'),
      authorBio: z.string().optional(),
      readingTime: z.string().default('7 min'),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = {
  guides: guidesCollection,
  blog: blogCollection,
};

// Type helpers (inferred from Zod) — 2026 Astro Content Collections best practice
export type Guide = CollectionEntry<'guides'>;
export type BlogPost = CollectionEntry<'blog'>;
