/**
 * Retina / Aiku dropshipping API client
 * Docs: https://app.aiku.io/app/re-api
 */

const BASE = process.env.RETINA_API_BASE ?? 'https://app.aiku.io/app/re-api';
const TOKEN = process.env.RETINA_API_TOKEN ?? '';

async function retinaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Retina API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface RetinaProduct {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: { id: number; name: string; slug: string };
  images: string[];
  price: number;        // retail price EUR
  wholesale: number;    // wholesale price (currency depends on supplier)
  stock: number;
  weight?: number;
  ean?: string;
  tags?: string[];
}

export interface RetinaProductsResponse {
  data: RetinaProduct[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export async function getProducts(
  page = 1,
  perPage = 50,
): Promise<RetinaProductsResponse> {
  return retinaFetch<RetinaProductsResponse>(
    `/dropshipping/products?page=${page}&per_page=${perPage}&sort=name`,
  );
}

export async function getStockFeed(): Promise<{ id: number; stock: number }[]> {
  return retinaFetch('/dropshipping/my-products-data-feed-json');
}

export interface RetinaOrderItem {
  product_id: number;
  quantity: number;
}

export interface RetinaAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  country: string; // ISO 2-letter
}

export async function placeOrder(
  items: RetinaOrderItem[],
  address: RetinaAddress,
  reference: string,
): Promise<{ id: string; status: string }> {
  return retinaFetch('/dropshipping/orders', {
    method: 'POST',
    body: JSON.stringify({ items, shipping_address: address, reference }),
  });
}

export async function getOrderStatus(id: string): Promise<{ id: string; status: string; tracking_number?: string }> {
  return retinaFetch(`/dropshipping/orders/${id}`);
}

export { retinaFetch };
