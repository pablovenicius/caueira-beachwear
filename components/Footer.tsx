'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/Logo';

const NAV_LINKS = [
  { label: 'Perguntas frequentes', href: '/ajuda' },
  { label: 'Trocas e devoluções', href: '/politicas/trocas-e-devolucoes' },
  { label: 'Política de privacidade', href: '/politicas/privacidade' },
  { label: 'Meus pedidos', href: '/minha-conta/pedidos' },
  { label: 'Painel do lojista', href: '/admin', adminOnly: true },
];

const PAYMENTS = ['Pix', 'Visa', 'Mastercard', 'Elo', 'Amex', 'Boleto'];

/**
 * Referência do cliente (site da Bautz): rodapé centralizado — logo no
 * topo, descrição curta, navegação numa linha só, contato e redes sociais
 * embaixo — em vez das colunas alinhadas à esquerda de antes.
 */
export function Footer() {
  const { isAdmin } = useAuth();
  return (
    <footer className="relative overflow-hidden border-t border-terra/20 bg-mar-700 pt-16 text-center text-areia-200 pb-[calc(4rem+var(--bottom-nav-h))] md:pb-16">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sol to-transparent" aria-hidden />
      <span className="grain-overlay" aria-hidden />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
        <Logo size={60} />
        <p className="max-w-md text-[15px] leading-relaxed text-areia-200/85">
          Biquínis, maiôs e saídas de praia com proteção UV50+ — receba lançamentos e ganhe 10% off na
          primeira compra.
        </p>

        <form className="flex w-full max-w-sm gap-2">
          <input
            aria-label="Seu e-mail"
            placeholder="Seu e-mail"
            type="email"
            className="h-11 min-w-0 flex-1 rounded-full border border-white/20 bg-transparent px-4 text-sm text-white outline-none placeholder:text-areia-200/50"
          />
          <button
            type="submit"
            className="h-11 flex-none rounded-full bg-terra px-5 text-sm font-semibold text-white transition hover:bg-terra-700"
          >
            Quero
          </button>
        </form>

        <nav aria-label="Links do rodapé" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-[14px]">
          {NAV_LINKS.filter((l) => !l.adminOnly || isAdmin).map((l) => (
            <Link key={l.label} href={l.href} className="text-areia-200/80 hover:text-sol">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2 pt-2 text-[14px] text-areia-200/80">
          <a href="https://wa.me/5579999999999" target="_blank" rel="noreferrer" className="hover:text-sol">
            WhatsApp
          </a>
          <a href="mailto:contato@caueirabeachwear.com.br" className="hover:text-sol">
            contato@caueirabeachwear.com.br
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2" aria-label="Formas de pagamento">
          {PAYMENTS.map((p) => (
            <span key={p} className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-areia-200/80">
              {p}
            </span>
          ))}
        </div>

        <div className="h-px w-10 bg-sol/40" aria-hidden />

        <div className="flex flex-col items-center gap-1 pb-2 text-[13px] text-areia-200/60">
          <span>Compra 100% segura</span>
          <span>Caueira Beachwear · CNPJ 00.000.000/0001-00</span>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          className="mt-1 grid h-10 w-10 place-items-center rounded-full border border-sol/30 text-sol transition hover:border-sol hover:bg-sol/10"
        >
          <UpIcon />
        </button>
      </div>
    </footer>
  );
}

function UpIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
