import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { placeOrder } from '@/lib/retina';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  // Auth check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch order
  const { data: order } = await admin
    .from('orders')
    .select('*')
    .eq('id', params.orderId)
    .single();

  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
  if (order.status !== 'paid') return NextResponse.json({ error: `Statut invalide: ${order.status}` }, { status: 400 });
  if (order.supplier_order_id) return NextResponse.json({ error: 'Déjà envoyée' }, { status: 400 });

  // Map items to Retina format (product ids are stored as numeric strings like '187398')
  const items: any[] = order.items ?? [];
  const retinaItems = items
    .map((item: any) => {
      const retinaId = parseInt(item.productId ?? item.sku ?? '', 10);
      if (isNaN(retinaId)) return null;
      return { product_id: retinaId, quantity: item.quantity };
    })
    .filter(Boolean);

  if (retinaItems.length === 0) {
    return NextResponse.json({
      error: 'Impossible de mapper les produits vers le fournisseur. Vérifiez que les IDs produits sont des IDs Retina numériques.',
    }, { status: 422 });
  }

  // Map shipping address
  const addr = order.shipping_address ?? {};
  const retinaAddress = {
    first_name: addr.firstName ?? '',
    last_name:  addr.lastName ?? '',
    email:      order.email,
    phone:      addr.phone,
    address1:   addr.line1 ?? '',
    address2:   addr.line2,
    city:       addr.city ?? '',
    zip:        addr.postalCode ?? '',
    country:    addr.countryCode ?? 'BE',
  };

  try {
    const result = await placeOrder(retinaItems, retinaAddress, `UDZ-${order.id.slice(0, 8).toUpperCase()}`);

    // Update order in Supabase
    await admin.from('orders').update({
      status: 'processing',
      supplier_order_id: result.id,
    }).eq('id', params.orderId);

    return NextResponse.json({
      message: `Commande transmise (ID fournisseur: ${result.id})`,
      supplierOrderId: result.id,
      supplierStatus: result.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur fournisseur';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
