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