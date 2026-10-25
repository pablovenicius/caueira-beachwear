'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-context';
import { brl } from '@/lib/format';

const EMPTY_SHIPPING = { name: '', phone: '', cep: '', address: '', city: '', state: '' };

export default function CheckoutPage() {
  const router = useRouter();
 const { items, subtotal, clear, hasHydrated } = useCart();
  const { user, session, loading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!authLoading && !user) setAuthOpen(true);
  }, [authLoading, user]);

 useEffect(() => {
  if (hasHydrated && items.length === 0) router.replace('/');
}, [hasHydrated, items.length, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setAuthOpen(true);
      return;
    }
    setErr('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, size: i.size, colorName: i.colorName, qty: i.qty })),
          shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Não deu pra iniciar o pagamento.');
      clear();
      window.location.href = data.initPoint;
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
        <h1 className="font-display text-2xl font-normal text-tinta">Finalizar pedido</h1>

        {!user ? (
          <p className="text-sm text-tinta/70">Entre na sua conta pra continuar a compra.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="rounded bg-areia-100 p-4">
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-tinta/60">Resumo do pedido</h2>
              <ul className="flex flex-col gap-1.5 text-sm">
                {items.map((it) => (
                  <li key={it.key} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">
                      {it.qty}x {it.name} ({it.size}, {it.colorName})
                    </span>
                    <span className="flex-none font-medium">{brl(it.unitPrice * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-areia-300 pt-2 font-medium">
                <span>Subtotal</span>
                <span>{brl(subtotal())}</span>
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-tinta/60">Endereço de entrega</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2 flex flex-col gap-1.5 text-sm">
                  Nome completo
                  <input required value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  Telefone
                  <input required value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  CEP
                  <input required value={shipping.cep} onChange={(e) => setShipping((s) => ({ ...s, cep: e.target.value }))}
                    placeholder="00000-000"
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700" />
                </label>
                <label className="col-span-2 flex flex-col gap-1.5 text-sm">
                  Endereço completo
                  <input required value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                    placeholder="Rua, número, bairro, complemento"
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  Cidade
                  <input required value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  Estado
                  <input required value={shipping.state} onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value.toUpperCase() }))}
                    placeholder="SE" maxLength={2}
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700" />
                </label>
              </div>
            </div>

            {err && <div role="alert" className="rounded-sm bg-terra/10 px-3 py-2 text-sm text-terra">{err}</div>}

            <button type="submit" disabled={submitting}
              className="h-14 rounded-sm bg-terra text-sm font-medium uppercase tracking-widest text-white transition hover:bg-terra-700 disabled:opacity-60">
              {submitting ? 'Redirecionando…' : 'Pagar com Mercado Pago'}
            </button>
          </form>
        )}
      </main>
      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
