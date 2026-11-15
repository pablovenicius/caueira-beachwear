'use client';
import Link from 'next/link';
import { useState } from 'react';
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
 * pequena. As categorias moram na folha cheia que abre a partir do ícone de
 * menu, e também aparecem como chips roláveis logo abaixo, pra quem já sabe
 * o que quer sem precisar abrir nada. No desktop a busca aparece inline.
 */
export function Header() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const count = items.reduce((t, i) => t + i.qty, 0);
  const { user, loading, isAdmin, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-areia-50/95 backdrop-blur">
      <p className="bg-mar-700 py-1.5 text-center text-[12px] text-sol/90">
        Frete grátis acima de R$ 399 · 5% off no Pix
      </p>

      <div className="border-b border-sol/15">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
          <button
            type="button"
            aria-label="Abrir categorias"
            onClick={() => setSheetOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center text-tinta md:hidden"
          >
            <MenuIcon />
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

            <div className="relative hidden md:grid">
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

        <nav aria-label="Categorias (atalho)" className="no-scrollbar overflow-x-auto md:hidden">
          <div className="flex gap-1 px-4 pb-2.5">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${
                  n.accent ? 'border-terra/30 text-terra' : 'border-areia-200 text-tinta/70'
                }`}>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {sheetOpen && (
        <div role="dialog" aria-modal aria-label="Categorias" className="fixed inset-0 z-40 md:hidden">
          <button aria-label="Fechar" className="absolute inset-0 bg-tinta/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col gap-1 bg-areia-50 p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <Logo size={52} />
              <button aria-label="Fechar categorias" onClick={() => setSheetOpen(false)} className="grid h-9 w-9 place-items-center text-tinta/60">
                <CloseIcon />
              </button>
            </div>
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setSheetOpen(false)}
                className={`rounded-lg px-3 py-3.5 text-[17px] font-medium ${n.accent ? 'text-terra' : 'text-tinta'}`}>
                {n.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-areia-200" />
            <Link href="/ajuda" onClick={() => setSheetOpen(false)} className="rounded-lg px-3 py-3.5 text-[15px] text-tinta/60">Ajuda</Link>
          </div>
        </div>
      )}

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
