import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getMpPreference } from '@/lib/mercadopago';
import type { Size } from '@/types/product';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface CheckoutItemInput {
  productId: string;
  size: Size;
  colorName: string;
  qty: number;
}

interface ShippingInput {
  name: string;
  phone: string;
  cep: string;
  address: string;
  city: string;
  state: string;
}

interface DbVariant {
  id: string;
  size: string;
  color_name: string;
  stock: number;
}

interface DbProduct {
  id: string;
  name: string;
  price: number;
  product_variants: DbVariant[];
}

export async function POST(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SITE_URL não configurada no servidor.' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });

  // Cliente escopado com o token do usuário — RLS garante que ele só
  // consegue criar pedido pra si mesmo (customer_id = auth.uid()).
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: 'Sessão inválida. Faça login novamente.' }, { status: 401 });
  }
  const customerId = userData.user.id;

  const body = (await req.json().catch(() => null)) as { items?: CheckoutItemInput[]; shipping?: ShippingInput } | null;
  if (!body?.items?.length || !body.shipping) {
    return NextResponse.json({ error: 'Carrinho ou endereço inválido.' }, { status: 400 });
  }
  const { items, shipping } = body;

  for (const key of ['name', 'phone', 'cep', 'address', 'city', 'state'] as const) {
    if (!shipping[key]?.trim()) {
      return NextResponse.json({ error: 'Preencha todos os campos de endereço.' }, { status: 400 });
    }
  }

  // Recalcula preço e estoque a partir do banco — nunca confia no que vem do cliente.
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const { data: products, error: productsErr } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .in('id', productIds)
    .eq('active', true);
  if (productsErr) return NextResponse.json({ error: productsErr.message }, { status: 500 });

  const resolved: {
    productId: string;
    variantId: string;
    name: string;
    size: string;
    colorName: string;
    unitPrice: number;
    qty: number;
  }[] = [];

  for (const item of items) {
    const product = (products as DbProduct[] | null)?.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: 'Um dos produtos do carrinho não está mais disponível.' }, { status: 400 });
    }
    const variant = product.product_variants.find((v) => v.size === item.size && v.color_name === item.colorName);
    if (!variant || variant.stock < item.qty) {
      return NextResponse.json(
        { error: `"${product.name}" (${item.size}, ${item.colorName}) está sem estoque suficiente.` },
        { status: 400 },
      );
    }
    resolved.push({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: item.size,
      colorName: item.colorName,
      unitPrice: product.price,
      qty: item.qty,
    });
  }

  const subtotal = resolved.reduce((t, i) => t + i.unitPrice * i.qty, 0);

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      subtotal,
      shipping_name: shipping.name.trim(),
      shipping_phone: shipping.phone.trim(),
      shipping_cep: shipping.cep.trim(),
      shipping_address: shipping.address.trim(),
      shipping_city: shipping.city.trim(),
      shipping_state: shipping.state.trim().toUpperCase(),
    })
    .select()
    .single();
  if (orderErr || !order) {
    return NextResponse.json({ error: orderErr?.message ?? 'Não deu pra criar o pedido.' }, { status: 500 });
  }

  const { error: itemsErr } = await supabase.from('order_items').insert(
    resolved.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      variant_id: i.variantId,
      name: i.name,
      size: i.size,
      color_name: i.colorName,
      unit_price: i.unitPrice,
      qty: i.qty,
    })),
  );
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  try {
    const preference = await getMpPreference().create({
      body: {
        items: resolved.map((i) => ({
          id: i.productId,
          title: `${i.name} (${i.size}, ${i.colorName})`,
          quantity: i.qty,
          unit_price: i.unitPrice,
          currency_id: 'BRL',
        })),
        payer: { name: shipping.name },
        external_reference: order.id,
        back_urls: {
          success: `${siteUrl}/pedido/${order.id}`,
          pending: `${siteUrl}/pedido/${order.id}`,
          failure: `${siteUrl}/pedido/${order.id}`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      },
    });

    await supabase.from('orders').update({ mp_preference_id: preference.id }).eq('id', order.id);

    return NextResponse.json({ orderId: order.id, initPoint: preference.init_point });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro ao criar o pagamento no Mercado Pago.' },
      { status: 500 },
    );
  }
}
