import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST, PATCH } from '../app/api/v1/[...path]/route.js';

function setup(t, mode = 'development') {
  const previous = { fetch: globalThis.fetch, mode: process.env.NODE_ENV, url: process.env.NEXT_PUBLIC_API_BASE_URL };
  process.env.NODE_ENV = mode;
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://backend.example/api/v1';
  t.after(() => {
    globalThis.fetch = previous.fetch;
    for (const [key, value] of [['NODE_ENV', previous.mode], ['NEXT_PUBLIC_API_BASE_URL', previous.url]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
}

test('LAN OTP requests reach the fixed backend without browser Origin or cookies', async t => {
  setup(t);
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), 'https://backend.example/api/v1/auth/otp');
    assert.equal(options.headers.has('origin'), false);
    assert.equal(options.headers.has('cookie'), false);
    assert.equal(options.headers.get('content-type'), 'application/json');
    assert.deepEqual(JSON.parse(options.body), { phone: '+918092107854' });
    return Response.json({ data: { delivery: 'static-test-only', expiresIn: 300 } });
  };
  const response = await POST(new Request('http://192.168.1.29:3000/api/v1/auth/otp', { method: 'POST', headers: { Origin: 'http://192.168.1.29:3000', Cookie: 'local=value', 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: '+918092107854' }) }), { params: Promise.resolve({ path: ['auth', 'otp'] }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).data.delivery, 'static-test-only');
});

test('Admin authorization and error responses are preserved', async t => {
  setup(t);
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.get('authorization'), 'Bearer example-token');
    assert.equal(options.method, 'PATCH');
    return Response.json({ error: { message: 'Administrator access required' } }, { status: 403 });
  };
  const response = await PATCH(new Request('http://localhost:3000/api/v1/listings/id', { method: 'PATCH', headers: { Authorization: 'Bearer example-token', 'Content-Type': 'application/json' }, body: '{"active":false}' }), { params: Promise.resolve({ path: ['listings', 'id'] }) });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.message, 'Administrator access required');
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('Media ranges and collection queries are forwarded', async t => {
  setup(t);
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).search, '?limit=100');
    assert.equal(options.headers.get('range'), 'bytes=0-3');
    return new Response('clip', { status: 206, headers: { 'Content-Range': 'bytes 0-3/10', 'Content-Type': 'video/mp4' } });
  };
  const response = await GET(new Request('http://localhost:3000/api/v1/evidence/test.mp4?limit=100', { headers: { Range: 'bytes=0-3' } }), { params: Promise.resolve({ path: ['evidence', 'test.mp4'] }) });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-range'), 'bytes 0-3/10');
});

test('Proxy is unavailable in production and rejects traversal paths', async t => {
  setup(t, 'production');
  globalThis.fetch = async () => { throw new Error('Must not contact upstream'); };
  const request = new Request('http://localhost:3000/api/v1/listings');
  assert.equal((await GET(request, { params: Promise.resolve({ path: ['listings'] }) })).status, 404);
  process.env.NODE_ENV = 'development';
  assert.equal((await GET(request, { params: Promise.resolve({ path: ['..', 'health'] }) })).status, 400);
});
