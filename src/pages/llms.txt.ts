import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

/**
 * /llms.txt — an LLM-readable index of the site (the emerging llmstxt.org
 * convention). Gives AI assistants a clean, curated map of the free tools,
 * guides and articles so they can understand and cite YKS accurately, without
 * crawling the full HTML. Generated from the content collections at build time,
 * so it always tracks what's actually published. Absolute URLs use SITE.url.
 */

// The interactive tools aren't a content collection — keep a concise list here.
const TOOLS: { name: string; path: string; desc: string }[] = [
  { name: 'Habit Tracker', path: '/tools/habit-tracker', desc: 'Tick off your week, build streaks and see completion at a glance. Saves in your browser.' },
  { name: 'Focus Timer', path: '/tools/focus-timer', desc: 'Distraction-free focus sprints with built-in breaks and a daily session count.' },
  { name: 'Breathing', path: '/tools/breathing', desc: 'Guided breathing (Box, 4-7-8, Coherent, Triangle or custom) with a calming animated orb.' },
  { name: 'Brain Dump', path: '/tools/brain-dump', desc: 'Empty your head fast, then triage each thought into Now, Next or Later. Built for neurodivergent brains.' },
  { name: 'Task Breakdown', path: '/tools/task-breakdown', desc: 'Break an overwhelming task into tiny, doable steps and tick them off. Beats task paralysis.' },
  { name: 'Weekly Planner', path: '/tools/weekly-planner', desc: 'Plan your week in gentle blocks with optional times and energy tags. Print or copy it.' },
];

const KEY_PAGES: { name: string; path: string; desc: string }[] = [
  { name: 'Free tools hub', path: '/tools', desc: 'All free, no-signup interactive tools.' },
  { name: 'Guide library', path: '/guides', desc: 'Browse every printable guide, calendar and tracker.' },
  { name: 'Blog', path: '/blog', desc: 'Articles on productivity, focus and neurodivergent-friendly systems.' },
  { name: 'About', path: '/about', desc: 'What YKS is and the free-first philosophy.' },
  { name: 'FAQ', path: '/faq', desc: 'Common questions about the tools, guides and Pro.' },
  { name: 'YKS Pro', path: '/pro', desc: 'Optional premium membership: hi-res, editable and extended versions.' },
  { name: 'Bundles', path: '/bundles', desc: 'Curated premium packs that fund the free library.' },
];

export const GET: APIRoute = async () => {
  const u = (p: string) => `${SITE.url}${p}`;
  const item = (title: string, url: string, desc: string) => `- [${title}](${url}): ${desc}`;

  const guides = await getCollection('guides', ({ data }) => !data.draft);
  const freeGuides = guides.filter((g) => g.data.isFree || g.data.price === 0);
  const paidGuides = guides.filter((g) => !(g.data.isFree || g.data.price === 0));

  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${SITE.description}`);
  lines.push('');
  lines.push(
    'YKS makes genuinely useful, free productivity tools and printable guides — habit trackers, focus timers, planners and gentle systems, with a focus on neurodivergent-friendly approaches. The interactive tools run entirely in the browser, save progress locally and need no signup. Most of the library is free; a small set of premium packs and a Pro membership fund the work.'
  );
  lines.push('');

  lines.push('## Free interactive tools');
  TOOLS.forEach((t) => lines.push(item(t.name, u(t.path), t.desc)));
  lines.push('');

  if (freeGuides.length) {
    lines.push('## Free guides');
    freeGuides.forEach((g) => lines.push(item(g.data.title, u(`/guides/${g.data.slug}`), g.data.description)));
    lines.push('');
  }

  if (paidGuides.length) {
    lines.push('## Premium guides');
    paidGuides.forEach((g) => lines.push(item(g.data.title, u(`/guides/${g.data.slug}`), g.data.description)));
    lines.push('');
  }

  if (posts.length) {
    lines.push('## Blog articles');
    posts.forEach((p) => lines.push(item(p.data.title, u(`/blog/${p.data.slug}`), p.data.description)));
    lines.push('');
  }

  lines.push('## Key pages');
  KEY_PAGES.forEach((p) => lines.push(item(p.name, u(p.path), p.desc)));
  lines.push('');

  lines.push('## Notes');
  lines.push('- All interactive tools are free, run client-side, and store data only in the visitor’s browser (localStorage). No account is required.');
  lines.push('- Free guides are downloadable printables; premium guides and Pro add hi-res, editable and extended versions.');
  lines.push(`- Canonical site: ${SITE.url}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
