'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const FOOTER_COLS = [
  {
    title: 'Ajuda',
    links: [
      { label: 'Perguntas frequentes', href: '/ajuda' },
      { label: 'Trocas e devoluções', href: '/politicas/trocas-e-devolucoes' },
      { label: 'Política de privacidade', href: '/politicas/privacidade' },
    ],
  },
  {
    title: 'Minha conta',
    links: [
      { label: 'Meus pedidos', href: '/minha-conta/pedidos' },
      // Só aparece pra quem está logado e cadastrado em public.admins.
      { label: 'Painel do lojista', href: '/admin', adminOnly: true },
    ],
  },
];

const PAYMENTS = ['Pix', 'Visa', 'Mastercard', 'Elo', 'Amex', 'Boleto'];

export function Footer() {
  const { isAdmin } = useAuth();
  return (
    <footer className="bg-tinta py-14 text-areia-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6">
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-1 flex-col gap-3" style={{ flexBasis: 280 }}>
            <div className="font-display text-2xl tracking-wide text-sol">Caueira</div>
            <p className="max-w-xs text-[15px] leading-relaxed text-areia-200/85">
              Receba lançamentos e ganhe 10% off na primeira compra.
            </p>
            <form className="flex max-w-sm gap-2">
              <input aria-label="Seu e-mail" placeholder="Seu e-mail" type="email"
                className="h-11 min-w-0 flex-1 rounded-sm border border-white/20 bg-transparent px-3.5 text-sm text-white outline-none placeholder:text-areia-200/50" />
              <button type="submit"
                className="h-11 flex-none rounded-sm bg-sol px-5 text-sm font-medium text-tinta">
                Quero
              </button>
            </form>
          </div>

          {FOOTER_COLS.map((c) => (
            <div key={c.title} className="flex flex-1 flex-col gap-2.5" style={{ flexBasis: 160 }}>
              <div className="text-sm text-sol">{c.title}</div>
              {c.links
                .filter((l) => !l.adminOnly || isAdmin)
                .map((l) => (
                  <Link key={l.label} href={l.href} className="min-h-[28px] text-[15px] text-areia-200/90 hover:text-white">
                    {l.label}
                  </Link>
                ))}
            </div>
          ))}

          <div className="flex flex-1 flex-col gap-2.5" style={{ flexBasis: 160 }}>
            <div className="text-sm text-sol">Fale com a gente</div>
            <a href="https://wa.me/5579999999999" target="_blank" rel="noreferrer" className="min-h-[28px] text-[15px] text-areia-200/90 hover:text-white">
              WhatsApp
            </a>
            <a href="mailto:contato@caueirabeachwear.com.br" className="min-h-[28px] text-[15px] text-areia-200/90 hover:text-white">
              contato@caueirabeachwear.com.br
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-1.5" aria-label="Formas de pagamento">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-sm border border-white/20 px-2.5 py-1 text-xs text-areia-200/80">{p}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3.5 text-sm text-areia-200/70">
            <span>Compra 100% segura</span>
            <span>Caueira Beachwear · CNPJ 00.000.000/0001-00</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
