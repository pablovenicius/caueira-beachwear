export type Size = 'P' | 'M' | 'G' | 'GG';
export type Category = 'Biquínis' | 'Maiôs' | 'Saídas de Praia';

export const SIZES: Size[] = ['P', 'M', 'G', 'GG'];
export const CATEGORIES: Category[] = ['Biquínis', 'Maiôs', 'Saídas de Praia'];

export interface ProductImage {
  url: string;
  alt: string;
  angle: 'frente' | 'costas';
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface StockBySize {
  P: number;
  M: number;
  G: number;
  GG: number;
}

/** Espelha `product_variants` no Supabase — uma linha por combinação tamanho + cor. */
export interface ProductVariant {
  id: string;
  product_id: string;
  size: Size;
  color_name: string;
  color_hex: string;
  stock: number;
}

/** Espelha a entidade Product completa (compatível com os dados de exemplo e Supabase). */
export interface Product {
  id: string;
  slug?: string;
  sku?: string;
  name: string;
  category: Category;
  price: number;
  description?: string | null;
  image_url?: string | null;
  tag?: string | null;
  active?: boolean;
  created_at?: string;
  variants?: ProductVariant[];

  // Propriedades usadas em SAMPLE_PRODUCTS
  compareAtPrice?: number | null;
  badge?: string | null;
  isSet?: boolean;
  topPrice?: number | null;
  bottomPrice?: number | null;
  colors?: ProductColor[];
  images?: ProductImage[];
  stockBySize?: StockBySize;
  isAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
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