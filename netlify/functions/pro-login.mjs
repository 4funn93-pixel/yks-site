/**
 * pro-login — validates a Lemon Squeezy license key and, if valid, issues a
 * signed httpOnly membership cookie. Netlify Functions v2 (Web Request/Response).
 *
 * Env:
 *   PRO_COOKIE_SECRET    (required) — secret used to sign the cookie (HMAC-SHA256)
 *   LEMON_PRO_VARIANT_ID (optional) — if set, only licenses for this variant pass
 *
 * The matching verifier lives in netlify/edge-functions/pro-gate.js — keep the
 * cookie name, token format and HMAC in sync between the two.
 */

const COOKIE = 'yks_pro';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const enc = new TextEncoder();

function b64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlStr(str) {
  return b64url(enc.encode(str));
}
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}
async function sign(secret) {
  const payload = b64urlStr(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 }));
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
  }

  const secret = process.env.PRO_COOKIE_SECRET;
  if (!secret) {
    return Response.json({ ok: false, error: 'Server not configured' }, { status: 500 });
  }

  // Accept JSON or form-encoded.
  let licenseKey = '';
  const ctype = req.headers.get('content-type') || '';
  try {
    if (ctype.includes('application/json')) {
      licenseKey = (await req.json()).license_key || '';
    } else {
      const form = new URLSearchParams(await req.text());
      licenseKey = form.get('license_key') || '';
    }
  } catch {
    /* fall through to empty */
  }
  licenseKey = String(licenseKey).trim();
  if (!licenseKey) {
    return Response.json({ ok: false, error: 'Enter your license key.' }, { status: 400 });
  }

  // Validate against Lemon Squeezy (no API key required for /validate).
  let result;
  try {
    const r = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ license_key: licenseKey }),
    });
    result = await r.json();
  } catch {
    return Response.json({ ok: false, error: 'Could not reach the license service. Try again.' }, { status: 502 });
  }

  const active = result?.valid && result?.license_key?.status === 'active';
  if (!active) {
    return Response.json({ ok: false, error: 'That license key is not valid or active.' }, { status: 401 });
  }

  // Optional: restrict to the Pro product/variant.
  const wantVariant = process.env.LEMON_PRO_VARIANT_ID;
  if (wantVariant && String(result?.meta?.variant_id) !== String(wantVariant)) {
    return Response.json({ ok: false, error: 'This key is not a YKS Pro membership.' }, { status: 403 });
  }

  const token = await sign(secret);
  const cookie = `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`;
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': cookie } });
};
