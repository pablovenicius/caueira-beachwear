'use client';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useCart } from '@/lib/cart-store';
import { FREE_SHIPPING_THRESHOLD } from '@/types/product';
import { brl } from '@/lib/format';

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const missing = FREE_SHIPPING_THRESHOLD - subtotal;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm" aria-live="polite">
        {missing > 0
          ? <>Faltam <strong className="text-terra">{brl(missing)}</strong> para frete grátis</>
          : <strong className="text-mar">Você ganhou frete grátis!</strong>}
      </p>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}
        aria-label="Progresso para frete grátis" className="h-1.5 overflow-hidden rounded-full bg-areia-300">
        <div className="h-full rounded-full bg-sol transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-tinta/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-areia-50 shadow-xl">
          <header className="flex items-center justify-between border-b border-areia-300 p-5">
            <Dialog.Title className="font-display text-xl">Sua sacola ({items.length})</Dialog.Title>
            <Dialog.Close aria-label="Fechar sacola" className="grid h-11 w-11 place-items-center">✕</Dialog.Close>
          </header>
          <div className="border-b border-areia-300 p-5"><FreeShippingBar subtotal={subtotal()} /></div>

          <ul className="flex-1 divide-y divide-areia-300 overflow-y-auto px-5">
            {items.map((it) => (
              <li key={it.key} className="flex gap-4 py-4">
                {it.image ? (
                  <Image src={it.image} alt="" width={72} height={90} className="rounded-sm object-cover" />
                ) : (
                  <div className="h-[90px] w-[72px] flex-none rounded-sm bg-areia-200" />
                )}
                <div className="flex flex-1 flex-col gap-1 text-sm">
                  <p>{it.name}</p>
                  <p className="text-xs text-tinta/70">Tam. {it.size} · {it.colorName}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-areia-300">
                      <button aria-label="Diminuir" onClick={() => setQty(it.key, it.qty - 1)} className="h-9 w-9">−</button>
                      <span aria-live="polite" className="w-6 text-center">{it.qty}</span>
                      <button aria-label="Aumentar" onClick={() => setQty(it.key, it.qty + 1)} className="h-9 w-9">+</button>
                    </div>
                    <span className="font-medium">{brl(it.unitPrice * it.qty)}</span>
                  </div>
                  <button onClick={() => remove(it.key)} className="self-start text-xs underline text-tinta/60">Remover</button>
                </div>
              </li>
            ))}
          </ul>

          <footer className="flex flex-col gap-3 border-t border-areia-300 p-5">
            <div className="flex justify-between"><span>Subtotal</span><strong>{brl(subtotal())}</strong></div>
            <p className="text-xs text-tinta/70">ou {brl(subtotal() * 0.95)} no PIX · 3x sem juros</p>
            <a href="/checkout" className="grid h-14 place-items-center rounded-sm bg-terra text-sm font-medium uppercase tracking-widest text-white hover:bg-terra-700">
              Finalizar pedido
            </a>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
