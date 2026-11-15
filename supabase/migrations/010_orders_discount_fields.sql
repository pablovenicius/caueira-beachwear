-- Adiciona o cupom aplicado, o valor do desconto e o total realmente
-- cobrado (subtotal - desconto) ao pedido. "subtotal" continua sendo só a
-- soma dos itens, sem desconto — "total" é o que de fato vai pro Mercado
-- Pago e o que a aba Vendas do admin deve somar como faturamento.

alter table public.orders
  add column if not exists coupon_code text references public.coupons(code),
  add column if not exists discount numeric(10,2) not null default 0,
  add column if not exists total numeric(10,2);

-- Pedidos que já existirem (nenhum, hoje) ficam com total = subtotal.
update public.orders set total = subtotal where total is null;

alter table public.orders alter column total set not null;
