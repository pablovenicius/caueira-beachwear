'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
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

  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponChecking, setCouponChecking] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) setAuthOpen(true);
  }, [authLoading, user]);

  useEffect(() => {
    // Só decide se o carrinho está "vazio de verdade" depois que o
    // zustand/persist carregou o localStorage — antes disso `items` sempre
    // começa como [] e isso mandava todo mundo de volta pra home assim que
    // abria o /checkout, mesmo com produto na sacola.
    if (hasHydrated && items.length === 0) router.replace('/');
  }, [hasHydrated, items.length, router]);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    setCouponMsg('');
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal: subtotal() }),
      });
      const data = (await res.json()) as { valid: boolean; message: string; code?: string; discount?: number };
      setCouponMsg(data.message);
      if (data.valid && data.code && typeof data.discount === 'number') {
        setCoupon({ code: data.code, discount: data.discount });
      } else {
        setCoupon(null);
      }
    } catch {
      setCouponMsg('Não deu pra validar o cupom agora.');
      setCoupon(null);
    } finally {
      setCouponChecking(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput('');
    setCouponMsg('');
  };

  const total = Math.max(0, subtotal() - (coupon?.discount ?? 0));

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
          couponCode: coupon?.code,
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
        <h1 className="font-display text-3xl font-normal text-tinta">Finalizar pedido</h1>

        {!user ? (
          <p className="text-[15px] text-tinta/70">Entre na sua conta pra continuar a compra.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="rounded-sm border border-areia-300 bg-white p-5">
              <h2 className="mb-3 text-sm text-tinta/60">Resumo do pedido</h2>
              <ul className="flex flex-col gap-1.5">
                {items.map((it) => (
                  <li key={it.key} className="flex justify-between gap-3 text-[15px] text-tinta">
                    <span className="min-w-0 truncate">
                      {it.qty}x {it.name} ({it.size}, {it.colorName})
                    </span>
                    <span className="flex-none font-medium">{brl(it.unitPrice * it.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2 border-t border-areia-300 pt-3">
                {coupon ? (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-mar">Cupom {coupon.code} aplicado</span>
                    <button type="button" onClick={removeCoupon} className="text-tinta/50 underline hover:text-terra">Remover</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Cupom de desconto"
                      className="h-11 min-w-0 flex-1 rounded-sm border border-areia-300 bg-white px-3 text-sm uppercase outline-none focus:border-mar"
                    />
                    <button type="button" onClick={applyCoupon} disabled={couponChecking || !couponInput.trim()}
                      className="h-11 flex-none rounded-sm border border-tinta px-4 text-sm text-tinta disabled:opacity-40">
                      {couponChecking ? 'Verificando…' : 'Aplicar'}
                    </button>
                  </div>
                )}
                {couponMsg && <p className={`text-sm ${coupon ? 'text-mar' : 'text-terra'}`} role="status">{couponMsg}</p>}
              </div>

              <div className="mt-3 flex flex-col gap-1 border-t border-areia-300 pt-3">
                <div className="flex justify-between text-sm text-tinta/70">
                  <span>Subtotal</span>
                  <span>{brl(subtotal())}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-sm text-mar">
                    <span>Desconto</span>
                    <span>-{brl(coupon.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-tinta"><strong className="font-medium">Total</strong><strong className="font-medium">{brl(total)}</strong></div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm text-tinta/60">Endereço de entrega</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2 flex flex-col gap-1.5 text-sm text-tinta">
                  Nome completo
                  <input required value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-mar" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-tinta">
                  Telefone
                  <input required value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-mar" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-tinta">
                  CEP
                  <input required value={shipping.cep} onChange={(e) => setShipping((s) => ({ ...s, cep: e.target.value }))}
                    placeholder="00000-000"
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-mar" />
                </label>
                <label className="col-span-2 flex flex-col gap-1.5 text-sm text-tinta">
                  Endereço completo
                  <input required value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                    placeholder="Rua, número, bairro, complemento"
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-mar" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-tinta">
                  Cidade
                  <input required value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-mar" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-tinta">
                  Estado
                  <input required value={shipping.state} onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value.toUpperCase() }))}
                    placeholder="SE" maxLength={2}
                    className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-mar" />
                </label>
              </div>
            </div>

            {err && <div role="alert" className="rounded-sm bg-terra/10 px-3 py-2 text-sm text-terra">{err}</div>}

            <button type="submit" disabled={submitting}
              className="h-14 rounded-sm bg-terra text-sm font-medium text-white transition hover:bg-terra-700 disabled:opacity-60">
              {submitting ? 'Redirecionando…' : `Pagar ${brl(total)} com Mercado Pago`}
            </button>
          </form>
        )}
      </main>
      <Footer />
      <BottomNav />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
