'use client';
import type { Size } from '@/types/product';

const SIZES: Size[] = ['P', 'M', 'G', 'GG'];
const LOW_STOCK = 3;

interface Props {
  label: string;
  stock: Record<Size, number>;
  value: Size | null;
  onChange: (s: Size) => void;
  name: string; // ex.: "top", "calcinha", "conjunto"
}

/** Radiogroup acessível com aviso de estoque baixo */
export function SizeSelector({ label, stock, value, onChange, name }: Props) {
  const low = value && stock[value] > 0 && stock[value] <= LOW_STOCK;
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm">
        {label}: <strong className="font-medium">{value ?? 'selecione'}</strong>
      </legend>
      <div role="radiogroup" className="flex gap-2">
        {SIZES.map((s) => {
          const out = stock[s] === 0;
          const checked = value === s;
          return (
            <label key={s}
              className={[
                'relative grid h-12 min-w-12 cursor-pointer place-items-center rounded-sm border px-3 text-sm font-medium transition',
                checked ? 'border-tinta bg-tinta text-areia-50' : 'border-areia-300 bg-white hover:border-tinta',
                out && 'cursor-not-allowed text-tinta/30 line-through hover:border-areia-300',
              ].filter(Boolean).join(' ')}>
              <input type="radio" name={name} value={s} checked={checked} disabled={out}
                onChange={() => onChange(s)} className="sr-only" />
              {s}
              {!out && stock[s] <= LOW_STOCK && (
                <span aria-hidden className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-terra" />
              )}
            </label>
          );
        })}
      </div>
      <p aria-live="polite" className="min-h-5 text-xs text-terra">
        {low ? `Últimas unidades! Restam ${stock[value!]} no tamanho ${value}.` : ''}
      </p>
    </fieldset>
  );
}
