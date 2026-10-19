-- Migração 003 — pedidos (orders), itens de pedido e tabela de lojistas (admins).
-- Rode isso no SQL Editor do Supabase, depois de já ter rodado o schema.sql
-- (ou 001/002) com as tabelas products/product_variants/profiles.

-- ---------- Pedidos ----------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references auth.users(id),
  status           text not null default 'pending'
                     check (status in ('pending','paid','failed','cancelled')),
  subtotal         numeric(10,2) not null check (subtotal >= 0),
  shipping_name    text not null,
  shipping_phone   text not null,
  shipping_cep     text not null,
  shipping_address text not null,
  shipping_city    text not null,
  shipping_state   text not null,
  mp_preference_id text,                 -- id da preferência criada no Mercado Pago
  mp_payment_id    text,                 -- id do pagamento, preenchido pelo webhook
  created_at       timestamptz not null default now()
);

create index if not exists orders_customer_idx on public.orders (customer_id);

-- ---------- Itens do pedido ----------
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  variant_id  uuid references public.product_variants(id),
  name        text not null,              -- snapshot do nome (caso o produto mude depois)
  size        text not null,
  color_name  text not null,
  unit_price  numeric(10,2) not null check (unit_price >= 0),
  qty         int not null check (qty > 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- Quem é lojista (pode escrever em products/product_variants) ----------
-- Adicione o UUID do(s) dono(s) da loja aqui (pegue em Authentication → Users
-- no painel do Supabase, depois que a pessoa já tiver se cadastrado pelo site).
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- RLS ----------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admins enable row level security;

create policy "Cliente vê os próprios pedidos"
  on public.orders for select using (auth.uid() = customer_id);

create policy "Cliente cria o próprio pedido"
  on public.orders for insert with check (auth.uid() = customer_id);

create policy "Cliente vê os itens dos próprios pedidos"
  on public.order_items for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid())
  );

create policy "Cliente cria itens no próprio pedido"
  on public.order_items for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid())
  );

-- Atualização de status (pending → paid/failed) é feita pelo webhook do
-- Mercado Pago, que usa a service role key — essa chave ignora RLS, então
-- não precisa de política de update aqui para o cliente.

create policy "Só admin vê a lista de admins"
  on public.admins for select using (auth.uid() in (select id from public.admins));

-- ---------- Aperta a escrita em produtos: só quem está em `admins` ----------
-- Troca as políticas "temporárias" (liberadas pra qualquer anon key) do
-- schema.sql pelas de verdade, restritas a quem está cadastrado em `admins`.
drop policy if exists "Escrita em produtos (temporário)" on public.products;
drop policy if exists "Escrita em variações (temporário)" on public.product_variants;

create policy "Só admin escreve em produtos"
  on public.products for all
  using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "Só admin escreve em variações"
  on public.product_variants for all
  using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

-- ⚠️ Depois de rodar esta migração, o /admin só vai deixar você criar,
-- editar ou apagar produtos se o seu usuário (o e-mail que você usa pra
-- logar no site) estiver cadastrado na tabela `admins`. Pra se adicionar:
--
--   1. Cadastre-se/entre no site (o seu próprio e-commerce) normalmente,
--      pelo botão "Minha conta", com o e-mail que você vai usar como dono
--      da loja.
--   2. No painel do Supabase → Authentication → Users, copie o seu "User
--      UID".
--   3. Rode no SQL Editor:
--        insert into public.admins (id) values ('cole-o-uuid-aqui');
