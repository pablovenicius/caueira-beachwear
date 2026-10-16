export type Size = 'P' | 'M' | 'G' | 'GG';
export type Category = 'Biquínis' | 'Maiôs' | 'Saídas de Praia';

export const SIZES: Size[] = ['P', 'M', 'G', 'GG'];
export const CATEGORIES: Category[] = ['Biquínis', 'Maiôs', 'Saídas de Praia'];

/** Espelha `product_variants` — uma linha por combinação tamanho + cor. */
export interface ProductVariant {
  id: string;
  product_id: string;
  size: Size;
  color_name: string;
  color_hex: string;
  stock: number;
}

/** Espelha `products`, com as variações já aninhadas (join feito em lib/supabase.ts). */
export interface Product {
  id: string;
  slug?: string;
  sku?: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: Category;
  tag: string | null;        // selo opcional: "Mais Vendido", "Lançamento", "Promoção"...
  active: boolean;           // toggle do lojista — false = não aparece na vitrine
  created_at: string;
  variants: ProductVariant[];
  
  // Propriedades extras usadas nos produtos de exemplo
  compareAtPrice?: number | null;
  badge?: string | null;
  isSet?: boolean;
  topPrice?: number | null;
  bottomPrice?: number | null;
  colors?: Array<{ name: string; hex: string }>; // Adicionado agora
}

/** Campos que o formulário de admin envia ao criar/editar um produto (sem as variações). */
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'variants'>;

/** Uma variação ainda sem id, como o formulário de admin monta antes de salvar. */
export type VariantInput = Omit<ProductVariant, 'id' | 'product_id'>;

export interface CartItem {
  key: string;                // productId + tamanho + cor
  productId: string;
  name: string;
  size: Size;
  colorName: string;
  unitPrice: number;
  qty: number;
  image: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

export const FREE_SHIPPING_THRESHOLD = 399;
export const PIX_DISCOUNT = 0.05;
export const MAX_INSTALLMENTS = 3;