-- Cupons de desconto. A validação de verdade acontece no servidor (rotas
-- /api/coupon/validate e /api/checkout, com a service role key, que ignora
-- RLS) — por isso não existe política pública de leitura aqui: ninguém
-- de fora consegue listar os códigos ativos direto no banco.

create table if not exists public.coupons (
  code           text primary key,
  discount_type  text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  min_subtotal   numeric(10,2) not null default 0,
  max_uses       int,                    -- null = sem limite de usos
  used_count     int not null default 0,
  active         boolean not null default true,
  expires_at     timestamptz,
  created_at     timestamptz not null default now()
);

alter table public.coupons enable row level security;

-- Só o lojista gerencia cupons pelo painel admin (futuro); a validação no
-- checkout usa a service role key, que já ignora RLS.
create policy "Admin gerencia cupons"
  on public.coupons for all
  using (public.is_admin())
  with check (public.is_admin());

-- Um cupom de boas-vindas de exemplo — troque o código/valor ou apague
-- antes de publicar, se preferir.
insert into public.coupons (code, discount_type, discount_value, min_subtotal)
values ('BEMVINDA10', 'percent', 10, 0)
on conflict (code) do nothing;
