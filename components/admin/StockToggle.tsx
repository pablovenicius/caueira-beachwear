'use client';
import { useOptimistic, useTransition } from 'react';
import { updateProduct } from '@/lib/supabase';

/** Switch "Em Estoque / Esgotado" com atualização otimista + Supabase Realtime */
export function StockToggle({ productId, active }: { productId: string; active: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(active);
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      setOptimistic(!optimistic);
      try {
        await updateProduct(productId, { active: !optimistic });
      } catch {
        setOptimistic(optimistic); // rollback
      }
    });

  return (
    <button type="button" role="switch" aria-checked={optimistic} onClick={toggle} disabled={pending}
      className="flex items-center gap-3 text-sm">
      <span className={`relative h-7 w-12 rounded-full transition-colors ${optimistic ? 'bg-mar' : 'bg-areia-300'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${optimistic ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
      <span className={optimistic ? 'text-mar' : 'text-tinta/60'}>{optimistic ? 'Em estoque' : 'Esgotado'}</span>
    </button>
  );
}
