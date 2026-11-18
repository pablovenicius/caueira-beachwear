'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/AuthModal';
import { Logo } from '@/components/Logo';

const NAV = [
  { label: 'Biquínis', href: '/categoria/biquinis' },
  { label: 'Maiôs', href: '/categoria/maios' },
  { label: 'Saídas de praia', href: '/categoria/saidas-de-praia' },
  { label: 'Lançamentos', href: '/categoria/lancamentos' },
  { label: 'Promoções', href: '/categoria/promocoes', accent: true },
];

/**
 * Header mínimo e mobile-first: uma única linha (sacola, marca, busca/conta)
 * — nada de segunda fileira de navegação disputando espaço com a tela
 * pequena. No mobile as categorias moram na folha que abre pelo ícone de
 * menu (a barra inferior já tem o atalho "Categorias"). No desktop a
 * navegação e a busca aparecem inline.
 */
export function Header() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const count = items.reduce((t, i) => t + i.qty, 0);
  const { user, loading, isAdmin, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // clique fora do menu "Minha conta" fecha a aba — em qualquer lugar da
  // página, não só no próprio botão.
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // sombra sutil só aparece depois que a página rola — dá uma noção de
  // profundidade/"vidro" ao cabeçalho fixo sem precisar de sombra pesada o
  // tempo todo (toque discreto de "tech", comum em lojas de alto padrão).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 bg-areia-50/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_8px_24px_rgba(31,74,77,0.10)]' : ''
      }`}
    >
      <div className="border-b border-sol/15 bg-gradient-to-b from-transparent to-sol/[0.03]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
          <button
            type="button"
            aria-label="Abrir categorias"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-terra/30 text-tinta md:hidden"
          >
            {sheetOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href="/" aria-label="Caueira Beachwear — início" className="mx-auto md:mx-0">
            <Logo size={46} />
          </Link>

          <nav aria-label="Categorias" className="hidden flex-1 justify-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition hover:bg-sol/10 ${
                  n.accent ? 'text-terra' : 'text-tinta/70'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <label className="mr-1 hidden h-10 w-56 items-center gap-2 rounded-full border border-areia-200 bg-white px-3.5 transition focus-within:border-sol/50 lg:flex">
              <SearchIcon />
              <input
                aria-label="Buscar produtos"
                placeholder="Buscar…"
                className="w-full border-none bg-transparent text-sm text-tinta outline-none placeholder:text-tinta/40"
              />
            </label>

            <div ref={accountRef} className="relative grid">
              {!loading && user ? (
                <button
                  aria-label="Minha conta"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="grid h-10 w-10 place-items-center text-tinta hover:text-sol-700"
                >
                  <UserIcon />
                </button>
              ) : (
                <button aria-label="Entrar ou criar conta" onClick={() => setAuthOpen(true)} className="grid h-10 w-10 place-items-center text-tinta hover:text-sol-700">
                  <UserIcon />
                </button>
              )}

              {menuOpen && user && (
                <div role="menu" className="absolute right-0 top-11 w-56 rounded-md bg-white p-2 text-sm shadow-lg ring-1 ring-sol/15">
                  <p className="truncate px-3 py-2 text-tinta/50">{user.email}</p>
                  <Link role="menuitem" href="/minha-conta/pedidos" onClick={() => setMenuOpen(false)}
                    className="block rounded px-3 py-2.5 text-tinta hover:bg-areia-100">
                    Meus pedidos
                  </Link>
                  {isAdmin && (
                    <Link role="menuitem" href="/admin" onClick={() => setMenuOpen(false)}
                      className="block rounded px-3 py-2.5 text-tinta hover:bg-areia-100">
                      Painel do lojista
                    </Link>
                  )}
                  <button
                    role="menuitem"
                    onClick={async () => {
                      setMenuOpen(false);
                      await signOut();
                    }}
                    className="mt-1 w-full rounded px-3 py-2.5 text-left text-terra hover:bg-areia-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>

            <a
              href="https://instagram.com/caueirabeachwear"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram da Caueira Beachwear"
              className="grid h-10 w-10 place-items-center text-tinta hover:text-sol-700"
            >
              <InstagramIcon />
            </a>

            <button aria-label={`Abrir sacola, ${count} ${count === 1 ? 'item' : 'itens'}`} onClick={() => setOpen(true)}
              className="relative grid h-10 w-10 place-items-center text-tinta hover:text-sol-700">
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-terra px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* categorias no mobile: flutua por cima do conteúdo (absolute, ancorado
          no fim do header, que é o ancestral posicionado) em vez de empurrar
          a página pra baixo — assim o início da página (foto/vídeo do hero)
          continua visível, só fica coberto por baixo do menu enquanto ele
          está aberto. */}
      <nav
        aria-label="Categorias"
        className={`absolute inset-x-0 top-full z-40 overflow-hidden border-b border-sol/15 bg-areia-50 shadow-lg transition-[max-height] duration-300 ease-in-out md:hidden ${
          sheetOpen ? 'max-h-[420px]' : 'max-h-0 border-b-0 shadow-none'
        }`}
      >
        <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} onClick={() => setSheetOpen(false)}
              className={`rounded-lg px-3 py-3 text-[16px] font-medium ${n.accent ? 'text-terra' : 'text-tinta'}`}>
              {n.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-areia-200" />
          <Link href="/ajuda" onClick={() => setSheetOpen(false)} className="rounded-lg px-3 py-3 text-[15px] text-tinta/60">Ajuda</Link>
        </div>
      </nav>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg aria-hidden width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-tinta/45">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg aria-hidden width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
