'use client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import type { Order, OrderStatus } from '@/types/product';
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from '@/types/product';
import { getOrders, updateOrderStatus } from '@/lib/supabase';
import { brl } from '@/lib/format';

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'bg-sol-700/15 text-sol-700',
  paid: 'bg-mar/15 text-mar',
  failed: 'bg-terra/15 text-terra',
  cancelled: 'bg-tinta/10 text-tinta/60',
};

function isSameDay(iso: string, ref: Date) {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

function isSameMonth(iso: string, ref: Date) {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function SalesPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [toast, setToast] = useState('');
  const [pending, startTransition] = useTransition();

  const load = () => {
    setLoadErr('');
    getOrders()
      .then(setOrders)
      .catch((e) => setLoadErr(e instanceof Error ? e.message : 'Não deu pra carregar os pedidos.'));
  };

  useEffect(load, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const summary = useMemo(() => {
    const list = orders ?? [];
    const now = new Date();
    const paid = list.filter((o) => o.status === 'paid');
    const todayRevenue = paid.filter((o) => isSameDay(o.created_at, now)).reduce((t, o) => t + o.subtotal, 0);
    const monthRevenue = paid.filter((o) => isSameMonth(o.created_at, now)).reduce((t, o) => t + o.subtotal, 0);
    const pendingCount = list.filter((o) => o.status === 'pending').length;
    const avgTicket = paid.length ? paid.reduce((t, o) => t + o.subtotal, 0) / paid.length : 0;
    return { todayRevenue, monthRevenue, pendingCount, paidCount: paid.length, avgTicket, totalCount: list.length };
  }, [orders]);

  const rows = useMemo(() => {
    const list = orders ?? [];
    if (statusFilter === 'all') return list;
    return list.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = (order: Order, status: OrderStatus) => {
    if (status === order.status) return;
    setOrders((list) => (list ?? []).map((o) => (o.id === order.id ? { ...o, status } : o)));
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, status);
        notify('Status do pedido atualizado.');
      } catch {
        notify('Não deu pra atualizar o status desse pedido.');
        setOrders((list) => (list ?? []).map((o) => (o.id === order.id ? { ...o, status: order.status } : o)));
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded bg-areia-50 p-4">
          <p className="text-[11px] uppercase tracking-wider text-tinta/60">Faturamento hoje</p>
          <p className="mt-1 font-display text-xl text-tinta">{brl(summary.todayRevenue)}</p>
        </div>
        <div className="rounded bg-areia-50 p-4">
          <p className="text-[11px] uppercase tracking-wider text-tinta/60">Faturamento no mês</p>
          <p className="mt-1 font-display text-xl text-tinta">{brl(summary.monthRevenue)}</p>
        </div>
        <div className="rounded bg-areia-50 p-4">
          <p className="text-[11px] uppercase tracking-wider text-tinta/60">Ticket médio</p>
          <p className="mt-1 font-display text-xl text-tinta">{brl(summary.avgTicket)}</p>
          <p className="text-[11px] text-tinta/50">{summary.paidCount} pedidos pagos</p>
        </div>
        <div className="rounded bg-areia-50 p-4">
          <p className="text-[11px] uppercase tracking-wider text-tinta/60">Aguardando pagamento</p>
          <p className="mt-1 font-display text-xl text-tinta">{summary.pendingCount}</p>
          <p className="text-[11px] text-tinta/50">de {summary.totalCount} pedidos no total</p>
        </div>
      </div>

      <section aria-label="Pedidos" className="overflow-hidden rounded bg-areia-50">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-areia-300 p-4">
          <h2 className="text-base font-medium">Pedidos <span className="font-normal text-tinta/60">({rows.length})</span></h2>
          <div className="flex items-center gap-2">
            <select
              aria-label="Filtrar por status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="h-10 rounded-full border border-areia-300 bg-white px-3.5 text-sm outline-none"
            >
              <option value="all">Todos os status</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
              ))}
            </select>
            <button type="button" onClick={load} className="h-10 rounded-full border border-areia-300 bg-white px-3.5 text-sm text-tinta/70 hover:bg-areia-100">
              Atualizar
            </button>
          </div>
        </div>

        {loadErr && (
          <p className="p-4 text-sm text-terra">
            {loadErr} — se você acabou de rodar a migração 008, confirme que ela foi aplicada no Supabase.
          </p>
        )}

        {!loadErr && orders === null && <p className="p-8 text-center text-sm text-tinta/60">Carregando pedidos…</p>}

        {!loadErr && orders !== null && rows.length === 0 && (
          <p className="p-8 text-center text-sm text-tinta/60">
            {orders.length === 0 ? 'Nenhum pedido feito ainda.' : 'Nenhum pedido com esse status.'}
          </p>
        )}

        {rows.map((o) => (
          <div key={o.id} className="flex flex-col gap-2 border-b border-areia-200 px-4 py-3.5 last:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium text-tinta">{o.shipping_name}</span>
                <span className="text-[11px] text-tinta/60">
                  {new Date(o.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} · {o.shipping_city}/{o.shipping_state}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-medium text-tinta">{brl(o.subtotal)}</span>
                <select
                  aria-label={`Status do pedido de ${o.shipping_name}`}
                  value={o.status}
                  disabled={pending}
                  onChange={(e) => handleStatusChange(o, e.target.value as OrderStatus)}
                  className={`h-8 rounded-full border-none px-3 text-xs font-medium outline-none ${STATUS_BADGE[o.status]}`}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            <ul className="flex flex-col gap-0.5 text-sm text-tinta/70">
              {o.items.map((it) => (
                <li key={it.id}>
                  {it.qty}x {it.name} ({it.size}, {it.color_name})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-sm bg-tinta px-[18px] py-3 text-sm text-areia-50 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
