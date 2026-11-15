import { NextResponse } from 'next/server';
import { checkCoupon } from '@/lib/coupons';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { code?: string; subtotal?: number } | null;
  if (!body?.code || typeof body.subtotal !== 'number') {
    return NextResponse.json({ valid: false, message: 'Cupom ou subtotal inválido.' }, { status: 400 });
  }

  const result = await checkCoupon(body.code, body.subtotal);
  return NextResponse.json(result);
}
