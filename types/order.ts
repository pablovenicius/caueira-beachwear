// Os tipos de pedido viviam duplicados aqui e em types/product.ts (duas
// definições de Order/OrderItem/OrderStatus, estruturalmente iguais mas
// mantidas à mão em dois lugares). Consolidado: a definição única agora
// vive em product.ts, e este arquivo só reexporta pra não quebrar quem já
// importa de '@/types/order'.
export type { Order, OrderItem, OrderStatus } from '@/types/product';

export interface ShippingAddress {
  name: string;
  phone: string;
  cep: string;
  address: string;
  city: string;
  state: string;
}
