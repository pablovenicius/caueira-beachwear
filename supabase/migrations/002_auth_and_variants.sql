-- Migração para quem já rodou o schema.sql anterior (produtos com a
-- coluna `stock` direta na tabela, sem variação de tamanho/cor).
-- Roda só uma vez; preserva os produtos já cadastrados.

create extension if not exists pgcrypto;

-- ---------- Variações: tamanho + cor ----------
create table if not exists public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size       text not null check (size in ('P','M','G','GG')),
  color_name text not null,
  color_hex  text not null,
  stock      int not null default 0 check (stock >= 0),
  unique (product_id, size, color_name)
);
create index if not exists product_variants_product_idx on public.product_variants (product_id);

alter table public.product_variants enable row level security;
create policy "Leitura pública de variações" on public.product_variants for select using (true);
create policy "Escrita em variações (temporário)" on public.product_variants for all using (true) with check (true);
alter publication supabase_realtime add table public.product_variants;

-- Migra o estoque total que cada produto já tinha para uma única variação
-- "M / Padrão" — depois, no /admin, quebre isso nos tamanhos e cores reais.
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select id, 'M', 'Padrão', '#2A1F16', stock
from public.products
where stock is not null and stock > 0;

alter table public.products drop column if exists stock;

-- ---------- Perfis de cliente, ligados ao Supabase Auth ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
create policy "Cliente vê o próprio perfil" on public.profiles for select using (auth.uid() = id);
create policy "Cliente edita o próprio perfil" on public.profiles for update using (auth.uid() = id);
