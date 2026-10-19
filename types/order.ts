export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

/** Espelha `orders`. */
export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_cep: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  created_at: string;
}

/** Espelha `order_items`. */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  size: string;
  color_name: string;
  unit_price: number;
  qty: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  cep: string;
  address: string;
  city: string;
  state: string;
}
