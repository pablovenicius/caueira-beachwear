import { NextResponse } from 'next/server';
import { getMpPayment } from '@/lib/mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// Mercado Pago chama essa rota (notification_url) quando o status de um
// pagamento muda. Sempre responde 200, mesmo em erro interno, pra evitar
// que o Mercado Pago fique retentando infinitamente uma notificação que
// nunca vai dar certo.

export async function POST(req: Request) {
  const url = new URL(req.url);
  const topic = url.searchParams.get('topic') ?? url.searchParams.get('type');
  let paymentId = url.searchParams.get('id') ?? url.searchParams.get('data.id');

  if (!paymentId) {
    const body = (await req.json().catch(() => null)) as { data?: { id?: string } } | null;
    paymentId = body?.data?.id ?? null;
  }

  if (!paymentId || (topic && topic !== 'payment')) {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getMpPayment().get({ id: paymentId });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const status = payment.status === 'approved' ? 'paid' : payment.status === 'rejected' ? 'failed' : 'pending';
    const supabaseAdmin = getSupabaseAdmin();

    const { data: existing } = await supabaseAdmin.from('orders').select('status').eq('id', orderId).single();

    await supabaseAdmin
      .from('orders')
      .update({ status, mp_payment_id: String(payment.id) })
      .eq('id', orderId);

    // Só desconta estoque na primeira vez que o pedido vira "paid", pra
    // não descontar de novo se o Mercado Pago reenviar a notificação.
    if (status === 'paid' && existing?.status !== 'paid') {
      const { data: items } = await supabaseAdmin.from('order_items').select('variant_id, qty').eq('order_id', orderId);
      for (const item of items ?? []) {
        if (!item.variant_id) continue;
        const { data: variant } = await supabaseAdmin
          .from('product_variants')
          .select('stock')
          .eq('id', item.variant_id)
          .single();
        if (variant) {
          await supabaseAdmin
            .from('product_variants')
            .update({ stock: Math.max(0, variant.stock - item.qty) })
            .eq('id', item.variant_id);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Erro no webhook do Mercado Pago:', e);
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
