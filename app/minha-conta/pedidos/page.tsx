'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CartDrawer } from '@/components/CartDrawer';
import { useAuth } from '@/lib/auth-context';
import { getOrders } from '@/lib/supabase';
import { ORDER_STATUS_LABEL } from '@/types/product';
import type { Order, OrderStatus } from '@/types/product';
import { brl } from '@/lib/format';

const STATUS_DOT: Record<OrderStatus, string> = {
  pending: 'bg-sol-700',
  paid: 'bg-mar',
  failed: 'bg-terra',
  cancelled: 'bg-tinta/40',
};

export default function MeusPedidosPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;
    // getOrders() usa a sessão do navegador — pra um cliente comum, a RLS
    // ("Cliente vê os próprios pedidos") já filtra pra só os pedidos dele,
    // então é a mesma consulta usada pelo admin, sem precisar de outra.
    getOrders()
      .then(setOrders)
      .catch(() => setErr('Não deu pra carregar seus pedidos agora.'));
  }, [authLoading, user]);

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <h1 className="font-display text-3xl font-normal text-tinta">Meus pedidos</h1>

        {authLoading ? (
          <p className="text-[15px] text-tinta/70">Carregando…</p>
        ) : !user ? (
          <p className="text-[15px] text-tinta/70">Entre na sua conta pra ver seus pedidos.</p>
        ) : err ? (
          <p className="text-[15px] text-terra">{err}</p>
        ) : orders === null ? (
          <p className="text-[15px] text-tinta/70">Carregando seus pedidos…</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-[15px] text-tinta/70">Você ainda não fez nenhum pedido.</p>
            <Link href="/" className="text-[15px] text-mar underline">Ver a coleção</Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-areia-300 border-y border-areia-300">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/pedido/${o.id}`} className="flex items-center justify-between gap-4 py-4 hover:bg-areia-100/60">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="flex items-center gap-2 text-[15px] text-tinta">
                      <span aria-hidden className={`h-2 w-2 flex-none rounded-full ${STATUS_DOT[o.status]}`} />
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                    <span className="text-sm text-tinta/55">
                      {new Date(o.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })} · {o.items.length} {o.items.length === 1 ? 'peça' : 'peças'}
                    </span>
                  </div>
                  <span className="flex-none font-medium text-tinta">{brl(o.total ?? o.subtotal)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
      <CartDrawer />
      <BottomNav />
    </>
  );
}
