'use client';
import Image from 'next/image';
import { useMemo, useState, useTransition } from 'react';
import type { Category, Product, ProductInput, Size, VariantInput } from '@/types/product';
import { CATEGORIES, SIZES } from '@/types/product';
import { addVariant, createProduct, deleteProduct, deleteVariant, updateProduct, updateVariantStock } from '@/lib/supabase';
import { StockToggle } from '@/components/admin/StockToggle';

const EMPTY_FORM: ProductInput = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category: 'Biquínis',
  tag: '',
  active: true,
};

const EMPTY_VARIANT_DRAFT = { size: 'M' as Size, color_name: '', color_hex: '#B85A3C', stock: 0 };

export function AdminPanel({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [draftVariants, setDraftVariants] = useState<VariantInput[]>([]);
  const [variantDraft, setVariantDraft] = useState(EMPTY_VARIANT_DRAFT);
  const [formErr, setFormErr] = useState('');
  const [toast, setToast] = useState('');
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((p) => p.name.toLowerCase().includes(needle));
  }, [products, q]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const patchLocal = (id: string, patch: Partial<Product>) =>
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const handlePriceChange = (p: Product, value: string) => {
    const price = parseFloat(value.replace(',', '.'));
    if (Number.isNaN(price)) return;
    patchLocal(p.id, { price });
    startTransition(async () => {
      try {
        await updateProduct(p.id, { price });
      } catch {
        notify(`Não deu pra salvar o preço de ${p.name}.`);
      }
    });
  };

  const handleVariantStockChange = (p: Product, variantId: string, nextStock: number) => {
    const stock = Math.max(0, nextStock);
    patchLocal(p.id, { variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock } : v)) });
    startTransition(async () => {
      try {
        await updateVariantStock(variantId, stock);
      } catch {
        notify('Não deu pra salvar o estoque dessa variação.');
      }
    });
  };

  const handleAddVariant = (p: Product) => {
    if (!variantDraft.color_name.trim()) {
      notify('Dê um nome pra cor antes de adicionar.');
      return;
    }
    startTransition(async () => {
      try {
        const created = await addVariant(p.id, { ...variantDraft, color_name: variantDraft.color_name.trim() });
        patchLocal(p.id, { variants: [...p.variants, created] });
        setVariantDraft(EMPTY_VARIANT_DRAFT);
        notify('Variação adicionada.');
      } catch (e) {
        notify(e instanceof Error ? e.message : 'Não deu pra adicionar essa variação (talvez ela já exista).');
      }
    });
  };

  const handleDeleteVariant = (p: Product, variantId: string) => {
    patchLocal(p.id, { variants: p.variants.filter((v) => v.id !== variantId) });
    startTransition(async () => {
      try {
        await deleteVariant(variantId);
      } catch {
        notify('Não deu pra remover essa variação.');
      }
    });
  };

  const handleDelete = (p: Product) => {
    if (!confirm(`Remover "${p.name}" da loja? Essa ação não pode ser desfeita.`)) return;
    setProducts((list) => list.filter((x) => x.id !== p.id));
    startTransition(async () => {
      try {
        await deleteProduct(p.id);
        notify(`${p.name} removido.`);
      } catch {
        notify(`Não deu pra remover ${p.name}.`);
        setProducts((list) => [...list, p]);
      }
    });
  };

  const addDraftVariant = () => {
    if (!variantDraft.color_name.trim()) {
      setFormErr('Dê um nome pra cor da variação antes de adicionar.');
      return;
    }
    setFormErr('');
    setDraftVariants((list) => [...list, { ...variantDraft, color_name: variantDraft.color_name.trim() }]);
    setVariantDraft(EMPTY_VARIANT_DRAFT);
  };

  const removeDraftVariant = (i: number) => setDraftVariants((list) => list.filter((_, idx) => idx !== i));

  const submit = () => {
    if (!form.name.trim() || !form.price) {
      setFormErr('Preencha pelo menos o nome e o preço.');
      return;
    }
    if (draftVariants.length === 0) {
      setFormErr('Adicione ao menos uma variação de tamanho e cor.');
      return;
    }
    setFormErr('');
    startTransition(async () => {
      try {
        const created = await createProduct(
          {
            ...form,
            name: form.name.trim(),
            description: form.description?.trim() || null,
            image_url: form.image_url?.trim() || null,
            tag: form.tag?.trim() || null,
          },
          draftVariants,
        );
        setProducts((list) => [created, ...list]);
        setForm(EMPTY_FORM);
        setDraftVariants([]);
        notify('Produto publicado na loja.');
      } catch (e) {
        setFormErr(e instanceof Error ? e.message : 'Não deu pra publicar o produto.');
      }
    });
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-normal text-tinta">Painel do lojista</h1>
          <p className="text-xs uppercase tracking-wider text-tinta/60">{products.length} produtos cadastrados</p>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        {/* Lista de produtos */}
        <section aria-label="Produtos cadastrados" className="min-w-0 flex-[2_1_560px] overflow-hidden rounded bg-areia-50">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-areia-300 p-4">
            <h2 className="text-base font-medium">Produtos <span className="font-normal text-tinta/60">({rows.length})</span></h2>
            <input aria-label="Buscar por nome" placeholder="Buscar por nome" value={q} onChange={(e) => setQ(e.target.value)}
              className="h-10 min-w-0 flex-[0_1_240px] rounded-full border border-areia-300 bg-white px-3.5 text-sm outline-none" />
          </div>

          <div className="hidden grid-cols-[minmax(0,2.2fr)_1fr_110px_90px_136px_44px] gap-3 border-b border-areia-300 px-4 py-2.5 text-[11px] uppercase tracking-wider text-tinta/60 md:grid">
            <span>Produto</span><span>Categoria</span><span>Preço (R$)</span><span>Estoque</span><span>Disponibilidade</span><span />
          </div>

          {rows.length === 0 ? (
            <p className="p-8 text-center text-sm text-tinta/60">Nenhum produto encontrado.</p>
          ) : (
            rows.map((p) => {
              const totalStock = p.variants.reduce((t, v) => t + v.stock, 0);
              const low = p.active && totalStock > 0 && totalStock <= 8;
              const isOpen = expanded === p.id;
              return (
                <div key={p.id} className="border-b border-areia-200" style={{ opacity: p.active ? 1 : 0.6 }}>
                  <div className="grid grid-cols-2 items-center gap-3 px-4 py-3 md:grid-cols-[minmax(0,2.2fr)_1fr_110px_90px_136px_44px]">
                    <button type="button" onClick={() => setExpanded(isOpen ? null : p.id)}
                      className="col-span-2 flex min-w-0 items-center gap-3 text-left md:col-span-1">
                      <div className="relative h-[55px] w-11 flex-none overflow-hidden rounded-sm bg-areia-200">
                        {p.image_url && <Image src={p.image_url} alt="" fill className="object-cover" />}
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm text-tinta">{p.name}</span>
                        <span className="font-mono text-[11px] text-tinta/60">
                          {p.variants.length} variações {low && <span className="text-terra">· estoque baixo</span>}
                        </span>
                      </div>
                    </button>

                    <span className="text-sm text-tinta/80">{p.category}</span>

                    <input type="number" step="0.1" min="0" aria-label={`Preço de ${p.name}`}
                      defaultValue={p.price} onBlur={(e) => handlePriceChange(p, e.target.value)}
                      className="h-10 w-full rounded-sm border border-areia-300 bg-white px-2.5 text-sm outline-none" />

                    <span className="text-sm text-tinta/80">{totalStock}</span>

                    <StockToggle productId={p.id} active={p.active} />

                    <button aria-label={`Remover ${p.name}`} onClick={() => handleDelete(p)}
                      className="justify-self-end text-tinta/50 hover:text-terra" disabled={pending}>
                      ✕
                    </button>
                  </div>

                  {isOpen && (
                    <div className="flex flex-col gap-3 border-t border-areia-200 bg-areia-100/60 px-4 py-3.5">
                      {p.variants.length === 0 ? (
                        <p className="text-sm text-tinta/60">Nenhuma variação cadastrada ainda.</p>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {p.variants.map((v) => (
                            <div key={v.id} className="flex items-center gap-2.5 text-sm">
                              <span className="h-5 w-5 flex-none rounded-full border border-areia-300" style={{ backgroundColor: v.color_hex }} />
                              <span className="w-8 flex-none font-medium">{v.size}</span>
                              <span className="min-w-0 flex-1 truncate text-tinta/80">{v.color_name}</span>
                              <div className="flex h-9 items-center rounded-sm border border-areia-300 bg-white">
                                <button aria-label="Diminuir estoque" onClick={() => handleVariantStockChange(p, v.id, v.stock - 1)} className="h-full w-8 text-base">−</button>
                                <input type="number" min="0" aria-label="Estoque" value={v.stock}
                                  onChange={(e) => handleVariantStockChange(p, v.id, parseInt(e.target.value) || 0)}
                                  className="h-full w-14 border-none bg-transparent text-center text-sm outline-none" />
                                <button aria-label="Aumentar estoque" onClick={() => handleVariantStockChange(p, v.id, v.stock + 1)} className="h-full w-8 text-base">+</button>
                              </div>
                              <button aria-label="Remover variação" onClick={() => handleDeleteVariant(p, v.id)} className="text-tinta/50 hover:text-terra">✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-end gap-2 border-t border-areia-300 pt-3">
                        <label className="flex flex-col gap-1 text-xs">
                          Tam.
                          <select value={variantDraft.size} onChange={(e) => setVariantDraft((d) => ({ ...d, size: e.target.value as Size }))}
                            className="h-9 rounded-sm border border-areia-300 bg-white px-2 text-sm">
                            {SIZES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </label>
                        <label className="flex flex-col gap-1 text-xs">
                          Cor
                          <input value={variantDraft.color_name} onChange={(e) => setVariantDraft((d) => ({ ...d, color_name: e.target.value }))}
                            placeholder="Ex.: Terracota" className="h-9 w-32 rounded-sm border border-areia-300 bg-white px-2 text-sm outline-none" />
                        </label>
                        <label className="flex flex-col gap-1 text-xs">
                          Tom
                          <input type="color" value={variantDraft.color_hex} onChange={(e) => setVariantDraft((d) => ({ ...d, color_hex: e.target.value }))}
                            className="h-9 w-12 rounded-sm border border-areia-300 bg-white" />
                        </label>
                        <label className="flex flex-col gap-1 text-xs">
                          Estoque
                          <input type="number" min="0" value={variantDraft.stock} onChange={(e) => setVariantDraft((d) => ({ ...d, stock: parseInt(e.target.value) || 0 }))}
                            className="h-9 w-20 rounded-sm border border-areia-300 bg-white px-2 text-sm outline-none" />
                        </label>
                        <button type="button" onClick={() => handleAddVariant(p)}
                          className="h-9 rounded-sm bg-sol-700 px-3.5 text-xs font-medium uppercase tracking-wider text-white">
                          Adicionar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* Novo produto */}
        <section aria-label="Novo produto" className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded bg-areia-50 p-[18px]">
          <h2 className="text-base font-medium">Adicionar peça</h2>

          <label className="flex flex-col gap-1.5 text-sm">
            Título
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex.: Biquíni Lua Dourada"
              className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Descrição
            <textarea value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Modelagem, tecido, proteção UV…"
              className="rounded-sm border border-areia-300 bg-white px-3 py-2 text-sm outline-none" />
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            <label className="flex flex-col gap-1.5 text-sm">
              Preço (R$)
              <input type="number" step="0.1" value={form.price || ''} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                placeholder="259,90" className="h-11 min-w-0 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Categoria
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                className="h-11 rounded-sm border border-areia-300 bg-white px-2.5 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            Selo (opcional)
            <input value={form.tag ?? ''} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              placeholder="Ex.: Lançamento, Mais Vendido…"
              className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            URL da foto
            <input value={form.image_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://…"
              className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none" />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Disponível na loja assim que criado
          </label>

          <div className="flex flex-col gap-2 rounded-sm border border-areia-300 bg-white p-3">
            <p className="text-sm font-medium">Variações (tamanho + cor)</p>

            {draftVariants.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {draftVariants.map((v, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="h-4 w-4 flex-none rounded-full border border-areia-300" style={{ backgroundColor: v.color_hex }} />
                    <span className="w-7 flex-none font-medium">{v.size}</span>
                    <span className="min-w-0 flex-1 truncate text-tinta/80">{v.color_name} · {v.stock} un.</span>
                    <button type="button" onClick={() => removeDraftVariant(i)} className="text-tinta/50 hover:text-terra">✕</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1 text-xs">
                Tam.
                <select value={variantDraft.size} onChange={(e) => setVariantDraft((d) => ({ ...d, size: e.target.value as Size }))}
                  className="h-9 rounded-sm border border-areia-300 bg-white px-2 text-sm">
                  {SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs">
                Cor
                <input value={variantDraft.color_name} onChange={(e) => setVariantDraft((d) => ({ ...d, color_name: e.target.value }))}
                  placeholder="Ex.: Terracota" className="h-9 w-24 rounded-sm border border-areia-300 bg-white px-2 text-sm outline-none" />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                Tom
                <input type="color" value={variantDraft.color_hex} onChange={(e) => setVariantDraft((d) => ({ ...d, color_hex: e.target.value }))}
                  className="h-9 w-12 rounded-sm border border-areia-300 bg-white" />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                Estoque
                <input type="number" min="0" value={variantDraft.stock} onChange={(e) => setVariantDraft((d) => ({ ...d, stock: parseInt(e.target.value) || 0 }))}
                  className="h-9 w-16 rounded-sm border border-areia-300 bg-white px-2 text-sm outline-none" />
              </label>
              <button type="button" onClick={addDraftVariant}
                className="h-9 rounded-sm bg-areia-200 px-3 text-xs font-medium uppercase tracking-wider text-tinta hover:bg-areia-300">
                + variação
              </button>
            </div>
          </div>

          <button onClick={submit} disabled={pending}
            className="h-[50px] rounded-sm bg-terra text-sm font-medium uppercase tracking-widest text-white disabled:opacity-60">
            Publicar na loja
          </button>
          {formErr && <div role="alert" className="text-sm text-terra">{formErr}</div>}
        </section>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-sm bg-tinta px-[18px] py-3 text-sm text-areia-50 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
