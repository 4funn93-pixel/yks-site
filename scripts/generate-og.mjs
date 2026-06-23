/**
 * generate-og.mjs — bakes the site's social/OG images into public/og/.
 *
 * Social platforms (Facebook, LinkedIn, X) and Google's rich-result logo do NOT
 * render SVG, so these are rasterized to JPG/PNG here (at build-time on a dev
 * machine, then committed as static assets). Text is rasterized into the output,
 * so end-user font availability is irrelevant.
 *
 * Run:  node scripts/generate-og.mjs
 * Deps: sharp (already present — Astro's default image service).
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/og/', import.meta.url));
await mkdir(OUT, { recursive: true });

const FONT = `'Segoe UI', 'Inter', 'Arial', sans-serif`;
const MONO = `'JetBrains Mono', 'Consolas', monospace`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Shared dark editorial canvas (1200×630) with brand lockup, then a headline.
function ogSvg({ lines, sub }) {
  const headline = lines
    .map((l, i) => {
      const y = 300 + i * 92;
      const fill = l.accent ? '#c7f73e' : '#f4f4f5';
      return `<text x="80" y="${y}" font-family="${FONT}" font-size="82" font-weight="800" letter-spacing="-3" fill="${fill}">${esc(l.text)}</text>`;
    })
    .join('');
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d6ff63"/><stop offset="1" stop-color="#84cc16"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="-5%" r="75%">
      <stop offset="0" stop-color="#c7f73e" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#c7f73e" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#c7f73e" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#08080a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="#c7f73e"/>
  <g transform="translate(80,82)">
    <rect width="62" height="62" rx="16" fill="url(#mark)"/>
    <text x="31" y="43" font-family="${FONT}" font-size="33" font-weight="800" fill="#0a0a0b" text-anchor="middle">Y</text>
    <text x="82" y="42" font-family="${FONT}" font-size="29" font-weight="800" fill="#f4f4f5">YKS <tspan fill="#71717a" font-weight="400">/ printables</tspan></text>
  </g>
  ${headline}
  <text x="82" y="${300 + lines.length * 92 + 36}" font-family="${FONT}" font-size="27" font-weight="400" fill="#a1a1aa">${esc(sub)}</text>
  <text x="80" y="582" font-family="${MONO}" font-size="19" letter-spacing="3" fill="#71717a">FREE · NO SIGNUP · SAVES YOUR PROGRESS</text>
</svg>`;
}

// Square brand logo (Google rich-result Organization logo) — transparent PNG.
function logoSvg() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d6ff63"/><stop offset="1" stop-color="#84cc16"/>
    </linearGradient>
  </defs>
  <rect x="56" y="56" width="400" height="400" rx="96" fill="url(#m)"/>
  <text x="256" y="338" font-family="${FONT}" font-size="248" font-weight="800" fill="#0a0a0b" text-anchor="middle">Y</text>
</svg>`;
}

const jobs = [
  {
    file: 'default-og.jpg',
    svg: ogSvg({
      lines: [{ text: 'Free tools that' }, { text: 'actually help.', accent: true }],
      sub: 'Habit trackers · focus timers · planners · printable guides',
    }),
  },
  {
    file: 'home-og.jpg',
    svg: ogSvg({
      lines: [{ text: "Productivity tools" }, { text: "you'll actually use.", accent: true }],
      sub: 'Runs in your browser · saves your progress · most of it free',
    }),
  },
];

for (const j of jobs) {
  await sharp(Buffer.from(j.svg)).jpeg({ quality: 88 }).toFile(OUT + j.file);
  const m = await sharp(OUT + j.file).metadata();
  console.log(`✓ ${j.file} — ${m.width}×${m.height}`);
}

await sharp(Buffer.from(logoSvg())).png().toFile(OUT + 'logo.png');
const lm = await sharp(OUT + 'logo.png').metadata();
console.log(`✓ logo.png — ${lm.width}×${lm.height} (alpha: ${lm.hasAlpha})`);

console.log('\nDone → public/og/');
