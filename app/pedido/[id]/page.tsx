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
        <h1 className="font-display text-2xl font-normal text-tinta">Seu pedido</h1>

        {authLoading || loading ? (
          <p className="text-sm text-tinta/70">Carregando…</p>
        ) : !user ? (
          <p className="text-sm text-tinta/70">Entre na sua conta pra ver esse pedido.</p>
        ) : !order ? (
          <p className="text-sm text-tinta/70">Pedido não encontrado.</p>
        ) : (
          <>
            <p
              className={`text-sm font-medium ${
                order.status === 'paid' ? 'text-mar' : order.status === 'failed' ? 'text-terra' : 'text-tinta/70'
              }`}
              aria-live="polite"
            >
              {STATUS_LABEL[order.status]}
            </p>

            <div className="rounded bg-areia-100 p-4 text-sm">
              <ul className="flex flex-col gap-1.5">
                {items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">
                      {it.qty}x {it.name} ({it.size}, {it.color_name})
                    </span>
                    <span className="flex-none font-medium">{brl(it.unit_price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-areia-300 pt-2 font-medium">
                <span>Total</span>
                <span>{brl(order.subtotal)}</span>
              </div>
            </div>

            <p className="text-xs text-tinta/60">
              Entrega para {order.shipping_name} — {order.shipping_address}, {order.shipping_city}/{order.shipping_state}
            </p>

            <Link href="/" className="text-sm text-sol-700 underline">
              Voltar pra loja
            </Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
