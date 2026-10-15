const privateKey = /token|authorization|cookie|password|secret|code|phone|email|bytes|photos|videos|photo_url/i;
export function sanitize(value, depth = 0) {
  if (depth > 5) return '[truncated]';
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) return '[binary omitted]';
  if (Array.isArray(value)) return [...value.slice(0, 10).map(item => sanitize(item, depth + 1)), ...(value.length > 10 ? [`[${value.length - 10} more items]`] : [])];
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).slice(0, 40).map(([key, item]) => [key, privateKey.test(key) ? '[redacted]' : sanitize(item, depth + 1)]));
  return typeof value === 'string' && value.length > 300 ? `${value.slice(0, 300)}…` : value;
}
export function devLog(event, data = {}) {
  if (process.env.NODE_ENV === 'development') console.debug(`[AayPlus Admin][${event}]`, sanitize(data));
}
export function logClick(event) {
  const button = event.target.closest?.('button, a');
  if (button && !button.disabled) devLog('action', { label: button.getAttribute('aria-label') || button.textContent.trim() });
}
