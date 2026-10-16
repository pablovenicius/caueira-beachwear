import { createClient } from '@supabase/supabase-js';
import type { Product, ProductInput, ProductVariant, VariantInput } from '@/types/product';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local (veja .env.example).',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Produtos e variações (tamanho + cor)
// ---------------------------------------------------------------------------

const PRODUCT_SELECT = '*, product_variants(*)';

type ProductRow = Omit<Product, 'variants'> & { product_variants?: ProductVariant[] | null };

function mapProduct(row: ProductRow): Product {
  return { ...row, variants: row.product_variants ?? [] };
}

/**
 * Vitrine pública — só produtos com active = true.
 * Usado em app/page.tsx e app/categoria/[slug]/page.tsx (ISR a cada 60s).
 */
export async function getActiveProducts(category?: string): Promise<Product[]> {
  let q = supabase.from('products').select(PRODUCT_SELECT).eq('active', true).order('created_at', { ascending: false });
  if (category) q = q.eq('category', category);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

/**
 * Painel do lojista — todos os produtos, ativos ou não.
 * Usado em app/admin/page.tsx.
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function createProduct(input: ProductInput, variants: VariantInput[]): Promise<Product> {
  const { data: product, error } = await supabase.from('products').insert(input).select().single();
  if (error) throw error;

  if (variants.length) {
    const { error: vErr } = await supabase
      .from('product_variants')
      .insert(variants.map((v) => ({ ...v, product_id: product.id })));
    if (vErr) throw vErr;
  }

  const { data, error: refetchErr } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', product.id).single();
  if (refetchErr) throw refetchErr;
  return mapProduct(data);
}

export async function updateProduct(id: string, patch: Partial<ProductInput>): Promise<void> {
  const { error } = await supabase.from('products').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function addVariant(productId: string, variant: VariantInput): Promise<ProductVariant> {
  const { data, error } = await supabase
    .from('product_variants')
    .insert({ ...variant, product_id: productId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVariantStock(variantId: string, stock: number): Promise<void> {
  const { error } = await supabase.from('product_variants').update({ stock: Math.max(0, stock) }).eq('id', variantId);
  if (error) throw error;
}

export async function deleteVariant(variantId: string): Promise<void> {
  const { error } = await supabase.from('product_variants').delete().eq('id', variantId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Autenticação de clientes (Supabase Auth — e-mail + senha)
// ---------------------------------------------------------------------------

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
