/**
 * Bazaar Nepal — API Service
 * Connects the mobile app to the shared Node.js backend.
 * Falls back gracefully to local state if server is unreachable.
 */

// ── PRODUCTION SERVER (Railway) ───────────────────────────────────
// The Express + PostgreSQL API is deployed on Railway and persists data
// in Railway Postgres. Set EXPO_PUBLIC_API_URL to override.
export const SERVER_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://server-production-b669.up.railway.app';

// Longer timeout to absorb Railway cold starts and slower first requests.
const TIMEOUT_MS = 90000;

async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${SERVER_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    clearTimeout(timeoutId);
    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ── Health check ──────────────────────────────────────────────────
export async function checkServerHealth(): Promise<boolean> {
  try {
    const data = await apiFetch('/health');
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

// ── Products ──────────────────────────────────────────────────────
export async function fetchAllProducts(params: { category?: string; search?: string } = {}): Promise<any[]> {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search)   query.set('search', params.search);
  const data = await apiFetch(`/api/products?${query.toString()}`);
  return data.ok ? data.products : [];
}

export async function createProduct(product: Record<string, any>): Promise<any> {
  const data = await apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  if (!data.ok) throw new Error(data.error || 'Failed to create listing');
  return data.product;
}

export async function updateProduct(id: string, fields: Record<string, any>): Promise<any> {
  const data = await apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
  if (!data.ok) throw new Error(data.error || 'Failed to update listing');
  return data.product;
}

export async function deleteProduct(id: string, sellerId: string): Promise<void> {
  const data = await apiFetch(`/api/products/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ sellerId }),
  });
  if (!data.ok) throw new Error(data.error || 'Failed to delete listing');
}

export async function incrementViewCount(id: string): Promise<number> {
  const data = await apiFetch(`/api/products/${id}/view`, { method: 'POST' });
  return data.views ?? 0;
}

// ── Chat ──────────────────────────────────────────────────────────
export async function fetchMessages(convKey: string): Promise<any[]> {
  const data = await apiFetch(`/api/chats/${encodeURIComponent(convKey)}`);
  return data.ok ? data.messages : [];
}

export async function postMessage(convKey: string, msg: Record<string, any>): Promise<any> {
  const data = await apiFetch(`/api/chats/${encodeURIComponent(convKey)}`, {
    method: 'POST',
    body: JSON.stringify(msg),
  });
  if (!data.ok) throw new Error(data.error || 'Failed to send message');
  return data.message;
}
