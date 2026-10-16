-- Caueira Beachwear · esquema Supabase (Postgres)
-- Para um projeto NOVO, do zero: rode este arquivo inteiro no SQL Editor.
-- Se você já rodou a versão anterior do schema (produtos com a coluna
-- `stock` direta, sem variações), use supabase/migrations/002_auth_and_variants.sql
-- em vez deste arquivo — ele preserva os produtos que você já cadastrou.

create extension if not exists pgcrypto;

-- ---------- Produtos ----------
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2) not null check (price >= 0),
  image_url   text,
  category    text not null check (category in ('Biquínis','Maiôs','Saídas de Praia')),
  tag         text,                      -- selo opcional: "Mais Vendido", "Lançamento", "Promoção"...
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index products_category_idx on public.products (category);
create index products_active_idx   on public.products (active);

-- ---------- Variações: tamanho + cor, cada uma com seu próprio estoque ----------
create table public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size       text not null check (size in ('P','M','G','GG')),
  color_name text not null,
  color_hex  text not null,
  stock      int not null default 0 check (stock >= 0),
  unique (product_id, size, color_name)
);

create index product_variants_product_idx on public.product_variants (product_id);

-- ---------- Perfis de cliente, ligados ao Supabase Auth ----------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

-- Cria o perfil automaticamente quando alguém se registra pelo AuthModal
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Row Level Security ----------
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.profiles enable row level security;

create policy "Leitura pública de produtos"
  on public.products for select using (true);

create policy "Leitura pública de variações"
  on public.product_variants for select using (true);

-- ⚠️ Temporário: ainda libera escrita pra qualquer requisição com a anon
-- key, autenticada ou não — o /admin não distingue "cliente logado" de
-- "dono da loja". Antes de divulgar a loja publicamente, crie uma forma
-- de marcar quem é lojista (ex.: uma tabela `admins` com os UUIDs
-- autorizados) e troque estas duas políticas por algo como
-- `using (auth.uid() in (select id from public.admins))`.
create policy "Escrita em produtos (temporário)"
  on public.products for all using (true) with check (true);

create policy "Escrita em variações (temporário)"
  on public.product_variants for all using (true) with check (true);

-- Cada cliente só vê e edita o próprio perfil
create policy "Cliente vê o próprio perfil"
  on public.profiles for select using (auth.uid() = id);

create policy "Cliente edita o próprio perfil"
  on public.profiles for update using (auth.uid() = id);

-- ---------- Realtime (toggle de ativo/estoque no admin) ----------
alter publication supabase_realtime add table public.products, public.product_variants;

-- ---------- Produtos de exemplo, já com variações ----------
with p1 as (
  insert into public.products (name, description, price, image_url, category, tag, active)
  values ('Biquíni Sol Poente', 'Modelagem que valoriza a silhueta, com recortes pensados para mobilidade no mar.',
          289.90, 'https://picsum.photos/seed/caueira-p1/800/1000', 'Biquínis', 'Mais Vendido', true)
  returning id
)
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select id, v.size, v.color_name, v.color_hex, v.stock from p1,
  (values ('P','Terracota','#B85A3C',6), ('M','Terracota','#B85A3C',9), ('G','Terracota','#B85A3C',2), ('GG','Terracota','#B85A3C',0),
          ('P','Areia','#D9C3A0',4),     ('M','Areia','#D9C3A0',5),     ('G','Areia','#D9C3A0',3))
  as v(size, color_name, color_hex, stock);

with p2 as (
  insert into public.products (name, description, price, image_url, category, tag, active)
  values ('Biquíni Maré Alta', 'Tecido com proteção UV50+ e secagem rápida.',
          259.90, 'https://picsum.photos/seed/caueira-p2/800/1000', 'Biquínis', 'Lançamento', true)
  returning id
)
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select id, v.size, v.color_name, v.color_hex, v.stock from p2,
  (values ('P','Mar','#3E6E70',8), ('M','Mar','#3E6E70',10), ('G','Mar','#3E6E70',9), ('GG','Mar','#3E6E70',4))
  as v(size, color_name, color_hex, stock);

with p3 as (
  insert into public.products (name, description, price, image_url, category, tag, active)
  values ('Maiô Caueira', 'Peça única, forro duplo, sem transparência.',
          349.90, 'https://picsum.photos/seed/caueira-p3/800/1000', 'Maiôs', 'Edição Limitada', true)
  returning id
)
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select id, v.size, v.color_name, v.color_hex, v.stock from p3,
  (values ('P','Ouro','#C4903F',1), ('M','Ouro','#C4903F',3), ('G','Ouro','#C4903F',2), ('GG','Ouro','#C4903F',1))
  as v(size, color_name, color_hex, stock);
