/**
 * pro-logout — clears the membership cookie and returns to the Pro page.
 */
export default async () => {
  const cleared = 'yks_pro=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
  return new Response(null, {
    status: 302,
    headers: { Location: '/pro', 'Set-Cookie': cleared },
  });
};
