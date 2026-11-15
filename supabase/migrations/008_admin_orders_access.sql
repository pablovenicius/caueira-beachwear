-- Dá ao lojista (quem está em public.admins) acesso de leitura a TODOS os
-- pedidos e itens de pedido, e permissão pra corrigir manualmente o status
-- de um pedido. Até agora só existia a política "Cliente vê os próprios
-- pedidos" — então o painel admin não conseguia listar vendas nenhuma.
--
-- Rode isso no SQL Editor do Supabase (Database → SQL Editor → New query).

create policy "Admin vê todos os pedidos"
  on public.orders for select
  using (public.is_admin());

create policy "Admin vê todos os itens de pedido"
  on public.order_items for select
  using (public.is_admin());

create policy "Admin corrige status do pedido"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());
