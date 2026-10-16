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
  { label: 'Saídas de Praia', href: '/categoria/saidas-de-praia' },
  { label: 'Lançamentos', href: '/categoria/lancamentos' },
  { label: 'Promoções', href: '/categoria/promocoes', accent: true },
];

export function Header() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const count = items.reduce((t, i) => t + i.qty, 0);
  const { user, loading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-areia-300 bg-areia-50/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 py-3.5">
        <div className="hidden md:flex">
          <label className="flex h-11 w-full max-w-xs items-center gap-2 rounded-full border border-areia-300 bg-white px-4">
            <SearchIcon />
            <input aria-label="Buscar produtos" placeholder="Buscar biquínis, maiôs…"
              className="w-full border-none bg-transparent text-sm outline-none placeholder:text-tinta/50" />
          </label>
        </div>

        <Link href="/" aria-label="Caueira Beachwear — início" className="flex items-center justify-center gap-2.5 text-sol-700">
          <span className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src="/caueira-logo.jpeg" alt="" fill className="object-cover" />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="font-display text-xl tracking-widest">CAUEIRA</span>
            <span className="mt-1 font-display text-[9px] tracking-[0.4em]">BEACHWEAR</span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-1">
          <button aria-label="Favoritos" className="hidden h-11 w-11 place-items-center md:grid"><HeartIcon /></button>

          <div className="relative hidden md:grid">
            {!loading && user ? (
              <button
                aria-label="Minha conta"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="grid h-11 w-11 place-items-center text-sol-700"
              >
                <UserIcon />
              </button>
            ) : (
              <button aria-label="Entrar ou criar conta" onClick={() => setAuthOpen(true)} className="grid h-11 w-11 place-items-center">
                <UserIcon />
              </button>
            )}

            {menuOpen && user && (
              <div role="menu" className="absolute right-0 top-12 w-52 rounded bg-white p-3 text-sm shadow-lg">
                <p className="truncate px-2 py-1 text-tinta/60">{user.email}</p>
                <button
                  role="menuitem"
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut();
                  }}
                  className="mt-1 w-full rounded-sm px-2 py-2 text-left text-terra hover:bg-areia-100"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

          <button aria-label={`Abrir sacola, ${count} itens`} onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 place-items-center">
            <BagIcon />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-terra px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav aria-label="Categorias" className="overflow-x-auto border-t border-areia-200">
        <div className="mx-auto flex max-w-7xl justify-center gap-1 px-6">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}
              className={`whitespace-nowrap px-3.5 py-3 text-xs uppercase tracking-wider transition hover:text-terra ${
                n.accent ? 'text-terra' : 'text-tinta/80'
              }`}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

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
function HeartIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
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
