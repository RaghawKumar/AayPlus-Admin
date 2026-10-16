import { devLog } from './dev-log.js';
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aayplus-backend.onrender.com/api/v1').replace(/\/$/, '');

export async function request(path, { token, method = 'GET', body } = {}) {
  const start = performance.now();
  devLog('api.request', { method, path: path.split('?')[0], body });
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
  } catch { devLog('api.error', { method, path: path.split('?')[0], type: 'connection or timeout' }); throw new Error('Cannot reach the API. Check the backend address and connection.'); }
  let payload;
  try { payload = await response.json(); } catch { throw new Error('The API returned an invalid response.'); }
  devLog('api.response', { method, path: path.split('?')[0], status: response.status, durationMs: Math.round(performance.now() - start), body: payload });
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'Request failed'); error.status = response.status; throw error;
  }
  return payload.data;
}
export async function collection(path, token) {
  const rows = [];
  for (let offset = 0; ; offset += 100) {
    const page = await request(`${path}?limit=100&offset=${offset}`, { token });
    rows.push(...page.items);
    if (page.items.length < 100) return rows;
  }
}
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value / 100);
export const dateTime = value => new Date(value * 1000).toLocaleString('en-IN');
