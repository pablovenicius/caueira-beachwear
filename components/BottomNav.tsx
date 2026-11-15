'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-context';

/**
 * Nav inferior flutuante, em vidro escuro (abyss + blur) — a mesma ideia de
 * sempre ter início/categorias/pedidos/sacola a um toque do polegar, só que
 * desenhada como um painel "pill" solto sobre o conteúdo, com friso
 * champagne, em vez de uma barra reta colada na borda. É o único elemento
 * com esse tanto de arredondamento na página — todo o resto (cards de
 * produto, imagens) continua em ângulo reto, de propósito.
 */
export function BottomNav() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const count = items.reduce((t, i) => t + i.qty, 0);
  const { user } = useAuth();

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 flex h-[var(--bottom-nav-h)] items-center justify-center px-3 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-[52px] w-full max-w-sm items-stretch rounded-full border border-sol/20 bg-mar-700/85 shadow-glow backdrop-blur-xl">
        <Link href="/" className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${isActive('/') && pathname === '/' ? 'text-sol' : 'text-areia-50/55'}`}>
          <HomeIcon />
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        <Link href="/categoria/lancamentos" className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${isActive('/categoria') ? 'text-sol' : 'text-areia-50/55'}`}>
          <GridIcon />
          <span className="text-[10px] font-medium">Categorias</span>
        </Link>
        <Link
          href={user ? '/minha-conta/pedidos' : '/'}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${isActive('/minha-conta') ? 'text-sol' : 'text-areia-50/55'}`}
        >
          <OrderIcon />
          <span className="text-[10px] font-medium">Pedidos</span>
        </Link>
        <button type="button" onClick={() => setCartOpen(true)} className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-areia-50/55">
          <BagIcon />
          {count > 0 && (
            <span className="absolute right-[26%] top-0.5 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-terra px-1 text-[9px] font-bold text-white">
              {count}
            </span>
          )}
          <span className="text-[10px] font-medium">Sacola</span>
        </button>
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9.5h12V10" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="4" y="4" width="7" height="7" rx="1.2" /><rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" /><rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 4h12v16l-6-3-6 3V4Z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
