import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/supabase';
import { AdminGate } from '@/components/admin/AdminGate';

export const metadata: Metadata = { title: 'Painel do lojista' };
export const dynamic = 'force-dynamic'; // sempre busca os dados mais recentes, sem cache

export default async function AdminPage() {
  // Busca com o cliente anônimo — por isso o controle de quem pode ver essa
  // página de fato é feito no cliente, pelo AdminGate (login + tabela admins).
  const products = await getAllProducts();
  return <AdminGate initialProducts={products} />;
}
import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { getAllProducts } from '@/lib/supabase';
import { AdminGate } from '@/components/admin/AdminGate';

export const metadata: Metadata = { title: 'Painel do lojista' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  noStore();
  const products = await getAllProducts();
  return <AdminGate initialProducts={products} />;
}