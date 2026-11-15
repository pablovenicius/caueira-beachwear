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
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: Category;
  tag: string | null;        // selo opcional: "Mais Vendido", "Lançamento", "Promoção"...
  active: boolean;           // toggle do lojista — false = não aparece na vitrine
  created_at: string;
  variants: ProductVariant[];
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

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'failed', 'cancelled'];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  failed: 'Falhou',
  cancelled: 'Cancelado',
};

/** Espelha `order_items` — um snapshot do item no momento da compra (nome e preço não mudam se o produto mudar depois). */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  size: Size;
  color_name: string;
  unit_price: number;
  qty: number;
}

/** Espelha `orders`, com os itens já aninhados (join feito em lib/supabase.ts). Usado na aba Vendas do painel admin. */
export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  coupon_code: string | null;
  discount: number;
  total: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_cep: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  created_at: string;
  items: OrderItem[];
}

export const FREE_SHIPPING_THRESHOLD = 399;
export const PIX_DISCOUNT = 0.05;
export const MAX_INSTALLMENTS = 3;
