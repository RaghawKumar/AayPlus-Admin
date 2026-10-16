// Local development uses a same-origin API route so localhost/LAN addresses
// do not need to be added to the deployed backend's browser CORS allowlist.
async function proxy(request, { params }) {
  if (process.env.NODE_ENV !== 'development') return new Response(null, { status: 404 });
  const { path } = await params;
  if (!path?.length || path.some(part => !part || /[\\/]/.test(part) || part === '.' || part === '..')) {
    return Response.json({ error: { message: 'Invalid API path' } }, { status: 400 });
  }
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aayplus-backend.onrender.com/api/v1').replace(/\/+$/, '');
  const upstream = new URL(`${base}/${path.map(encodeURIComponent).join('/')}`);
  if (!['https:', 'http:'].includes(upstream.protocol)) return Response.json({ error: { message: 'Invalid backend URL' } }, { status: 500 });
  upstream.search = new URL(request.url).search;
  const headers = new Headers();
  // Do not forward browser Origin, cookies or host headers. The backend still
  // validates the supplied bearer token and administrator role on every request.
  for (const key of ['authorization', 'content-type', 'range']) {
    if (request.headers.has(key)) headers.set(key, request.headers.get(key));
  }
  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(60000),
    });
    const outputHeaders = new Headers({ 'Cache-Control': 'no-store' });
    for (const key of ['content-type', 'content-range', 'accept-ranges', 'retry-after']) {
      if (response.headers.has(key)) outputHeaders.set(key, response.headers.get(key));
    }
    return new Response(response.body, { status: response.status, headers: outputHeaders });
  } catch {
    return Response.json({ error: { message: 'Cannot reach the backend. Check NEXT_PUBLIC_API_BASE_URL and try again.' } }, { status: 502 });
  }
}
export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
