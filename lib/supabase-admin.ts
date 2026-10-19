import { createClient } from '@supabase/supabase-js';

// ⚠️ Service role — ignora RLS. Só importe este arquivo em código que roda
// no servidor (Route Handlers em app/api/**), NUNCA em um componente 'use
// client'. É o que o webhook do Mercado Pago usa pra atualizar pedidos e
// estoque sem depender da sessão de um cliente logado.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Supabase (service role) não configurado: defina SUPABASE_SERVICE_ROLE_KEY no .env.local / nas env vars da Vercel (pegue em Project Settings → API → service_role no Supabase).',
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
