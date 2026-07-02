/**
 * RSS feed for the blog — /rss.xml
 * Advertised via <link rel="alternate"> in BaseLayout and linked in the footer.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../config/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  return rss({
    title: `${SITE.name} — Insights & Tutorials`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/blog/${post.data.slug}`,
      pubDate: post.data.publishedAt,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
