import { getSupabaseAdmin } from '@/lib/supabase-admin';

export interface CouponCheck {
  valid: boolean;
  message: string;
  code?: string;
  discount?: number; // em reais, já calculado pro subtotal informado
}

/**
 * Valida um cupom pro subtotal atual e devolve o valor do desconto em
 * reais (nunca maior que o subtotal). Roda só no servidor, com a service
 * role key — por isso a tabela coupons não precisa de política pública de
 * leitura (ver migration 009).
 */
export async function checkCoupon(rawCode: string, subtotal: number): Promise<CouponCheck> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, message: 'Informe um cupom.' };

  const supabaseAdmin = getSupabaseAdmin();
  const { data: coupon, error } = await supabaseAdmin.from('coupons').select('*').eq('code', code).maybeSingle();

  if (error) return { valid: false, message: 'Não deu pra validar o cupom agora. Tente de novo.' };
  if (!coupon || !coupon.active) return { valid: false, message: 'Cupom inválido.' };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, message: 'Esse cupom expirou.' };
  }
  if (coupon.max_uses != null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, message: 'Esse cupom já atingiu o limite de usos.' };
  }
  if (subtotal < coupon.min_subtotal) {
    return { valid: false, message: `Esse cupom vale a partir de ${coupon.min_subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.` };
  }

  const raw = coupon.discount_type === 'percent' ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
  const discount = Math.min(subtotal, Math.round(raw * 100) / 100);

  return { valid: true, message: 'Cupom aplicado!', code, discount };
}

/** Chamado só depois que o pedido foi criado de verdade, pra contabilizar o uso. */
export async function registerCouponUse(code: string): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from('coupons').select('used_count').eq('code', code).maybeSingle();
  if (!data) return;
  await supabaseAdmin.from('coupons').update({ used_count: data.used_count + 1 }).eq('code', code);
}
