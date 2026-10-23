import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

type WebhookPayload = {
  _type?: string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret);

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    revalidateTag('sanity');
    revalidatePath('/');
    revalidatePath('/visual');
    revalidatePath('/audio');
    revalidatePath('/shop');

    return NextResponse.json({
      revalidated: true,
      type: body?._type ?? null,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Revalidate webhook error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 },
    );
  }
}
