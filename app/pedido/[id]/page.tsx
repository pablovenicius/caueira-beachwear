'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { brl } from '@/lib/format';
import type { Order, OrderItem } from '@/types/order';

const STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'Aguardando confirmação do pagamento…',
  paid: 'Pagamento confirmado!',
  failed: 'Pagamento não aprovado.',
  cancelled: 'Pedido cancelado.',
};

export default function PedidoPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;

    const load = async () => {
      const { data: orderData } = await supabase.from('orders').select('*').eq('id', params.id).maybeSingle();
      const { data: itemsData } = await supabase.from('order_items').select('*').eq('order_id', params.id);
      if (!cancelled) {
        setOrder(orderData as Order | null);
        setItems((itemsData ?? []) as OrderItem[]);
        setLoading(false);
      }
    };
    load();

    // O webhook do Mercado Pago pode confirmar o pagamento alguns segundos
    // depois do redirect — essa checagem repete até sair de "pending".
    const interval = setInterval(() => {
      load();
    }, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [authLoading, user, params.id]);

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col gap-5 px-6 py-10">
        <h1 className="font-display text-3xl font-normal text-tinta">Seu pedido</h1>

        {authLoading || loading ? (
          <p className="text-[15px] text-tinta/70">Carregando…</p>
        ) : !user ? (
          <p className="text-[15px] text-tinta/70">Entre na sua conta pra ver esse pedido.</p>
        ) : !order ? (
          <p className="text-[15px] text-tinta/70">Pedido não encontrado.</p>
        ) : (
          <>
            <p
              className={`text-[15px] font-medium ${
                order.status === 'paid' ? 'text-mar' : order.status === 'failed' ? 'text-terra' : 'text-tinta/70'
              }`}
              aria-live="polite"
            >
              {STATUS_LABEL[order.status]}
            </p>

            <div className="rounded-sm border border-areia-300 bg-white p-5 text-[15px]">
              <ul className="flex flex-col gap-1.5">
                {items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-3 text-tinta">
                    <span className="min-w-0 truncate">
                      {it.qty}x {it.name} ({it.size}, {it.color_name})
                    </span>
                    <span className="flex-none font-medium">{brl(it.unit_price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-col gap-1 border-t border-areia-300 pt-3">
                <div className="flex justify-between text-tinta/70">
                  <span>Subtotal</span>
                  <span>{brl(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-mar">
                    <span>Desconto {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                    <span>-{brl(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-tinta">
                  <span>Total</span>
                  <span>{brl(order.total ?? order.subtotal)}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-tinta/60">
              Entrega para {order.shipping_name} — {order.shipping_address}, {order.shipping_city}/{order.shipping_state}
            </p>

            <Link href="/" className="text-sm text-mar underline">
              Voltar pra loja
            </Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
