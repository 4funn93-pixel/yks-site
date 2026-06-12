/**
 * Central site configuration — the single source of truth for brand identity,
 * domain, social links and analytics.
 *
 * The editable values live in `site.data.json`, which admins can change from the
 * CMS at /admin → "Site Settings" (no code required). Saving there commits the
 * JSON and rebuilds the site, so every page, the sitemap, structured data, the
 * footer and analytics pick up the new values automatically.
 */
import data from './site.data.json';

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  foundingYear: string;
  defaultOgImage: string;
  social: { x?: string; linkedin?: string };
  analytics: { plausibleDomain?: string };
}

export const SITE: SiteConfig = data;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}
