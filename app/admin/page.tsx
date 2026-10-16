import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/supabase';
import { AdminPanel } from '@/components/admin/AdminPanel';

export const metadata: Metadata = { title: 'Painel do lojista' };
export const dynamic = 'force-dynamic'; // sempre busca os dados mais recentes, sem cache

export default async function AdminPage() {
  const products = await getAllProducts();
  return <AdminPanel initialProducts={products} />;
}
