'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-context';

/**
 * Nav inferior fixa — só no mobile (escondida a partir de md:). A maioria
 * de quem compra aqui está no celular, então os 4 destinos mais usados
 * (início, categorias, pedidos, sacola) ficam sempre a um toque do polegar,
 * em vez de empilhados num header que precisa rolar a página toda pra
 * sumir. É o mesmo padrão dos apps de loja que as pessoas já usam todo dia.
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
      className="fixed inset-x-0 bottom-0 z-30 flex h-[var(--bottom-nav-h)] items-stretch border-t border-mar-700/10 bg-areia-50/97 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link href="/" className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${isActive('/') && pathname === '/' ? 'text-terra' : 'text-tinta/55'}`}>
        <HomeIcon />
        <span className="text-[10px] font-medium">Início</span>
      </Link>
      <Link href="/categoria/lancamentos" className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${isActive('/categoria') ? 'text-terra' : 'text-tinta/55'}`}>
        <GridIcon />
        <span className="text-[10px] font-medium">Categorias</span>
      </Link>
      <Link
        href={user ? '/minha-conta/pedidos' : '/'}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${isActive('/minha-conta') ? 'text-terra' : 'text-tinta/55'}`}
      >
        <OrderIcon />
        <span className="text-[10px] font-medium">Pedidos</span>
      </Link>
      <button type="button" onClick={() => setCartOpen(true)} className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-tinta/55">
        <BagIcon />
        {count > 0 && (
          <span className="absolute right-[26%] top-1.5 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-terra px-1 text-[9px] font-bold text-white">
            {count}
          </span>
        )}
        <span className="text-[10px] font-medium">Sacola</span>
      </button>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9.5h12V10" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="4" y="4" width="7" height="7" rx="1.2" /><rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" /><rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 4h12v16l-6-3-6 3V4Z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
