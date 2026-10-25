-- Migração 004 — bucket de Storage pras fotos de produto enviadas pelo
-- painel do lojista (em vez de só colar uma URL). Rode isso no SQL Editor
-- do Supabase depois da 003 (precisa da tabela public.admins já existir).

-- Bucket público: qualquer um lê (as fotos aparecem na vitrine), só admins
-- enviam/atualizam/removem.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Leitura pública.
drop policy if exists "Imagens de produtos são públicas para leitura" on storage.objects;
create policy "Imagens de produtos são públicas para leitura"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Só quem está em public.admins pode enviar.
drop policy if exists "Admins podem enviar imagens de produtos" on storage.objects;
create policy "Admins podem enviar imagens de produtos"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.uid() in (select id from public.admins)
  );

-- Só quem está em public.admins pode atualizar.
drop policy if exists "Admins podem atualizar imagens de produtos" on storage.objects;
create policy "Admins podem atualizar imagens de produtos"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.uid() in (select id from public.admins)
  );

-- Só quem está em public.admins pode remover.
drop policy if exists "Admins podem remover imagens de produtos" on storage.objects;
create policy "Admins podem remover imagens de produtos"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.uid() in (select id from public.admins)
  );
