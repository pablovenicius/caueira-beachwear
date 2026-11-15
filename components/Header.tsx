'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/AuthModal';

const NAV = [
  { label: 'Biquínis', href: '/categoria/biquinis' },
  { label: 'Maiôs', href: '/categoria/maios' },
  { label: 'Saídas de praia', href: '/categoria/saidas-de-praia' },
  { label: 'Lançamentos', href: '/categoria/lancamentos' },
  { label: 'Promoções', href: '/categoria/promocoes', accent: true },
];

export function Header() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const count = items.reduce((t, i) => t + i.qty, 0);
  const { user, loading, isAdmin, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30">
      <p className="bg-tinta py-2 text-center text-[13px] text-areia-100">
        Frete grátis acima de R$ 399 · 5% off no Pix · 3x sem juros
      </p>

      <div className="border-b border-areia-300 bg-areia-50/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 py-4">
          <div className="hidden md:flex">
            <label className="flex h-11 w-full max-w-xs items-center gap-2.5 rounded-full border border-areia-300 bg-white px-4">
              <SearchIcon />
              <input
                aria-label="Buscar produtos"
                placeholder="Buscar biquínis, maiôs…"
                className="w-full border-none bg-transparent text-sm text-tinta outline-none placeholder:text-tinta/45"
              />
            </label>
          </div>

          <Link href="/" aria-label="Caueira Beachwear — início" className="flex items-center justify-center gap-2.5">
            <span className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image src="/caueira-logo.jpeg" alt="" fill className="object-cover" />
            </span>
            <span className="flex flex-col items-start leading-none text-tinta">
              <span className="font-display text-xl tracking-wide">Caueira</span>
              <span className="mt-0.5 text-[10px] tracking-[0.3em] text-tinta/60">BEACHWEAR</span>
            </span>
          </Link>

          <div className="flex items-center justify-end gap-1">
            <div className="relative hidden md:grid">
              {!loading && user ? (
                <button
                  aria-label="Minha conta"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="grid h-11 w-11 place-items-center text-tinta hover:text-terra"
                >
                  <UserIcon />
                </button>
              ) : (
                <button aria-label="Entrar ou criar conta" onClick={() => setAuthOpen(true)} className="grid h-11 w-11 place-items-center text-tinta hover:text-terra">
                  <UserIcon />
                </button>
              )}

              {menuOpen && user && (
                <div role="menu" className="absolute right-0 top-12 w-56 rounded bg-white p-2 text-sm shadow-lg ring-1 ring-black/5">
                  <p className="truncate px-3 py-2 text-tinta/55">{user.email}</p>
                  <Link role="menuitem" href="/minha-conta/pedidos" onClick={() => setMenuOpen(false)}
                    className="block rounded-sm px-3 py-2.5 text-tinta hover:bg-areia-100">
                    Meus pedidos
                  </Link>
                  {isAdmin && (
                    <Link role="menuitem" href="/admin" onClick={() => setMenuOpen(false)}
                      className="block rounded-sm px-3 py-2.5 text-tinta hover:bg-areia-100">
                      Painel do lojista
                    </Link>
                  )}
                  <button
                    role="menuitem"
                    onClick={async () => {
                      setMenuOpen(false);
                      await signOut();
                    }}
                    className="mt-1 w-full rounded-sm px-3 py-2.5 text-left text-terra hover:bg-areia-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>

            <button aria-label={`Abrir sacola, ${count} ${count === 1 ? 'item' : 'itens'}`} onClick={() => setOpen(true)}
              className="relative grid h-11 w-11 place-items-center text-tinta hover:text-terra">
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-terra px-1 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav aria-label="Categorias" className="overflow-x-auto">
          <div className="mx-auto flex max-w-7xl justify-center gap-1 px-6">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href}
                className={`whitespace-nowrap px-3.5 py-3 text-[15px] transition hover:text-terra ${
                  n.accent ? 'text-terra' : 'text-tinta/75'
                }`}>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-tinta/50">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg aria-hidden width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
