'use client';
import { useAuth } from '@/lib/auth-context';

const FOOTER_COLS = [
  { title: 'Ajuda', links: [
    { label: 'Guia de tamanhos', href: '#' },
    { label: 'Trocas e devoluções', href: '#' },
    { label: 'Prazos de entrega', href: '#' },
    { label: 'Fale conosco', href: '#' },
  ] },
  { title: 'Caueira', links: [
    { label: 'Nossa história', href: '#' },
    { label: 'Cuidados com as peças', href: '#' },
    { label: 'Política de privacidade', href: '#' },
    // Só aparece pra quem está logado e cadastrado em public.admins (ver useAuth().isAdmin abaixo).
    { label: 'Painel do lojista', href: '/admin', adminOnly: true },
  ] },
];

const PAYMENTS = ['PIX', 'Visa', 'Mastercard', 'Elo', 'Amex', 'Boleto'];

export function Footer() {
  const { isAdmin } = useAuth();
  return (
    <footer className="bg-cafe py-12 text-areia-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-9 px-6">
        <div className="flex flex-wrap gap-9">
          <div className="flex flex-1 flex-col gap-3" style={{ flexBasis: 260 }}>
            <div className="font-display text-2xl tracking-widest text-sol">CAUEIRA</div>
            <p className="max-w-xs text-sm leading-relaxed">
              Receba lançamentos e ganhe 10% off na primeira compra.
            </p>
            <form className="flex max-w-sm gap-2">
              <input aria-label="Seu e-mail" placeholder="Seu e-mail" type="email"
                className="h-11 min-w-0 flex-1 rounded-sm border border-white/25 bg-transparent px-3.5 text-sm text-white outline-none placeholder:text-areia-200/60" />
              <button type="submit"
                className="h-11 rounded-sm bg-sol px-4 text-xs font-semibold uppercase tracking-wider text-cafe">
                Quero
              </button>
            </form>
          </div>

          {FOOTER_COLS.map((c) => (
            <div key={c.title} className="flex flex-1 flex-col gap-2.5" style={{ flexBasis: 160 }}>
              <div className="text-xs uppercase tracking-widest text-sol">{c.title}</div>
              {c.links
                .filter((l) => !l.adminOnly || isAdmin)
                .map((l) => (
                  <a key={l.label} href={l.href} className="min-h-[28px] text-sm text-areia-200 hover:text-white">{l.label}</a>
                ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-1.5" aria-label="Formas de pagamento">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-sm border border-white/25 px-2.5 py-1 text-[11px] font-medium tracking-wide">{p}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3.5 text-xs opacity-85">
            <span>🔒 SSL · Compra 100% segura</span>
            <span>Caueira Beachwear · CNPJ 00.000.000/0001-00</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
