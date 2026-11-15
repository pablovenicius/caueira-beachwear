'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product, Size } from '@/types/product';
import { MAX_INSTALLMENTS, PIX_DISCOUNT, SIZES } from '@/types/product';
import { useCart } from '@/lib/cart-store';
import { brl } from '@/lib/format';

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const [toast, setToast] = useState('');

  const colors = useMemo(() => {
    const map = new Map<string, { hex: string; sizes: Map<Size, number> }>();
    for (const v of product.variants) {
      if (!map.has(v.color_name)) map.set(v.color_name, { hex: v.color_hex, sizes: new Map() });
      map.get(v.color_name)!.sizes.set(v.size, v.stock);
    }
    return Array.from(map.entries()).map(([name, { hex, sizes }]) => ({ name, hex, sizes }));
  }, [product.variants]);

  const totalStock = product.variants.reduce((t, v) => t + v.stock, 0);
  const soldOut = colors.length === 0 || totalStock === 0;

  const [selectedColor, setSelectedColor] = useState(
    () => colors.find((c) => Array.from(c.sizes.values()).some((s) => s > 0))?.name ?? colors[0]?.name,
  );
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const activeColor = colors.find((c) => c.name === selectedColor) ?? colors[0];
  const activeStock = selectedSize ? activeColor?.sizes.get(selectedSize) ?? 0 : null;

  const handleAdd = () => {
    if (!activeColor || !selectedSize) return;
    add(product, selectedSize, activeColor.name);
    setToast('Adicionado à sacola.');
    setTimeout(() => setToast(''), 2000);
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-[calc(96px+var(--bottom-nav-h))] md:px-6 md:py-12 md:pb-12">
      <nav aria-label="Caminho" className="mb-5 text-sm text-tinta/50 md:mb-6">
        <Link href="/" className="hover:text-tinta">Início</Link>
        <span className="mx-1.5">/</span>
        <span className="text-tinta/70">{product.category}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-product overflow-hidden bg-areia-200">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-areia-300" />
          )}
          {product.tag && (
            <span className="absolute left-4 top-4 bg-areia-50 px-2.5 py-1 text-xs font-semibold text-tinta/80">{product.tag}</span>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-tinta/55">{product.category}</p>
            <h1 className="mt-1 font-display text-2xl italic text-tinta md:text-3xl">{product.name}</h1>
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="font-display text-2xl text-tinta">{brl(product.price)}</p>
            <p className="text-[15px] text-tinta/60">
              {MAX_INSTALLMENTS}x de {brl(product.price / MAX_INSTALLMENTS)} · <span className="font-medium text-terra">{brl(product.price * (1 - PIX_DISCOUNT))} no Pix</span>
            </p>
          </div>

          {product.description && <p className="max-w-prose text-[15px] leading-relaxed text-tinta/80">{product.description}</p>}

          {soldOut ? (
            <p className="text-[15px] text-terra">Esgotado no momento — volte em breve.</p>
          ) : (
            <div className="flex flex-col gap-4 border-t border-areia-300 pt-5">
              {colors.length > 1 && (
                <div>
                  <p className="mb-2 text-sm text-tinta/60">Cor{activeColor ? `: ${activeColor.name}` : ''}</p>
                  <div role="group" aria-label="Escolha a cor" className="flex gap-2">
                    {colors.map((c) => (
                      <button key={c.name} type="button" title={c.name} aria-pressed={activeColor?.name === c.name}
                        onClick={() => { setSelectedColor(c.name); setSelectedSize(null); }}
                        className={`h-9 w-9 rounded-full border-2 ${activeColor?.name === c.name ? 'border-tinta' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-sm text-tinta/60">Tamanho</p>
                <div role="group" aria-label="Escolha o tamanho" className="flex gap-2">
                  {SIZES.map((s) => {
                    const stock = activeColor?.sizes.get(s) ?? 0;
                    return (
                      <button key={s} type="button" disabled={stock === 0} aria-pressed={selectedSize === s}
                        onClick={() => setSelectedSize(s)}
                        className={`h-12 w-14 rounded-sm border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                          selectedSize === s ? 'border-tinta bg-tinta text-white' : 'border-areia-300 text-tinta hover:border-tinta'
                        }`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && activeStock !== null && activeStock <= 4 && activeStock > 0 && (
                  <p className="mt-2 text-sm text-terra">Só {activeStock} {activeStock === 1 ? 'unidade' : 'unidades'} nesse tamanho.</p>
                )}
              </div>

              {/* No mobile essa barra fica fixa acima da nav inferior — sempre
                  ao alcance do polegar, sem precisar rolar de volta pro topo
                  depois de escolher a cor/tamanho. No desktop é só mais um
                  botão no fluxo normal da página. */}
              <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-20 border-t border-areia-200 bg-areia-50/97 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur
                              md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
                <div className="mx-auto flex max-w-6xl items-center gap-3 md:max-w-none md:p-0">
                  <button type="button" onClick={handleAdd} disabled={!selectedSize}
                    className="h-14 w-full bg-terra text-sm font-semibold text-white transition hover:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-40">
                    {selectedSize ? 'Adicionar à sacola' : 'Escolha um tamanho'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <dl className="flex flex-col gap-2 border-t border-areia-300 pt-5 text-sm text-tinta/70">
            <div className="flex justify-between gap-3">
              <dt>Frete</dt>
              <dd>Grátis acima de R$ 399</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Trocas</dt>
              <dd>Grátis em até 30 dias</dd>
            </div>
          </dl>
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-sm bg-tinta px-[18px] py-3 text-sm text-areia-50 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
