import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

/**
 * robots.txt generated from site config so the sitemap URL always tracks the
 * real production domain (no hardcoded placeholder).
 *
 * AI-friendly by design: we explicitly welcome the major AI answer engines /
 * assistant crawlers (OpenAI, Anthropic, Perplexity, Google, Apple, etc.) so
 * the free tools and guides can surface and be cited in AI answers. Only the
 * admin CMS and the gated Pro library are disallowed. An LLM-readable site
 * index lives at /llms.txt.
 */

// Reputable AI assistants / answer-engine crawlers we explicitly allow.
const AI_AGENTS = [
  'GPTBot',         // OpenAI — training
  'OAI-SearchBot',  // OpenAI — search/citations
  'ChatGPT-User',   // OpenAI — user-triggered browsing
  'ClaudeBot',      // Anthropic — crawler
  'anthropic-ai',   // Anthropic
  'Claude-User',    // Anthropic — user-triggered
  'Claude-SearchBot', // Anthropic — search/citations
  'PerplexityBot',  // Perplexity — index
  'Perplexity-User',// Perplexity — user-triggered
  'Google-Extended',// Google — Gemini grounding/training
  'Applebot-Extended', // Apple Intelligence
  'CCBot',          // Common Crawl (feeds many LLMs)
  'Amazonbot',      // Amazon
  'cohere-ai',      // Cohere
  'DuckAssistBot',  // DuckDuckGo AI
];

const RULES = ['Allow: /', 'Disallow: /admin', 'Disallow: /pro/library'];

export const GET: APIRoute = () => {
  const body = [
    '# YKS — we welcome search crawlers and AI assistants.',
    `# LLM-readable index: ${SITE.url}/llms.txt`,
    '',
    'User-agent: *',
    ...RULES,
    '',
    '# Explicitly welcome major AI answer engines & assistants',
    ...AI_AGENTS.map((a) => `User-agent: ${a}`),
    ...RULES,
    '',
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
