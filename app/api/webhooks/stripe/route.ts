import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  
  // FIX: In Next.js 15+, headers() must be awaited!
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ subscription_tier: 'pro' })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user tier:', error);
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }
      
      console.log(`User ${userId} upgraded to PRO successfully!`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}