/**
 * pro-gate — Netlify Edge Function that protects YKS Pro routes at the CDN.
 *
 * Verifies the signed `yks_pro` cookie issued by netlify/functions/pro-login.mjs.
 * Valid + unexpired → request continues. Otherwise → redirect to /pro/unlock.
 *
 * Keep COOKIE name, token format and HMAC identical to pro-login.mjs.
 * Requires env: PRO_COOKIE_SECRET
 */

const COOKIE = 'yks_pro';
const enc = new TextEncoder();

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function b64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

async function isValid(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = await hmac(secret, payload);
  // constant-time-ish compare
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    return typeof data.exp === 'number' && Date.now() < data.exp;
  } catch {
    return false;
  }
}

export default async (request, context) => {
  const secret = Netlify.env.get('PRO_COOKIE_SECRET');
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  const token = match ? decodeURIComponent(match[1]) : '';

  if (await isValid(token, secret)) {
    return context.next();
  }

  const url = new URL(request.url);
  const dest = new URL('/pro/unlock', url.origin);
  dest.searchParams.set('from', url.pathname);
  return Response.redirect(dest.toString(), 302);
};

export const config = {
  path: ['/pro/library', '/downloads/pro/*'],
};
