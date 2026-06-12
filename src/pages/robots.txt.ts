import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

/**
 * robots.txt generated from site config so the sitemap URL always tracks the
 * real production domain (no hardcoded placeholder).
 */
export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /pro/library',
    '',
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
