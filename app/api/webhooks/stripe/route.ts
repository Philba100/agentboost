import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing webhook signature or server secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Signature Error: ${err.message}` }, { status: 400 });
  }

  // Handle relevant subscription lifecycle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier || 'pro';
      const customerEmail = session.customer_email || session.metadata?.email;

      if (userId && userId !== 'guest_conversion') {
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: tier,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Failed to update subscription profile:', error);
        } else {
          console.log(`[Subscription Active]: User ${userId} upgraded to ${tier.toUpperCase()}`);
        }
      } else if (customerEmail) {
        // Link by customer email if user checked out in guest sandbox mode
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const userMatch = users?.users?.find(
          (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
        );

        if (userMatch) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: tier,
              updated_at: new Date().toISOString()
            })
            .eq('id', userMatch.id);
          console.log(`[Guest Conversion]: User ${userMatch.id} provisioned with ${tier.toUpperCase()}`);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId && userId !== 'guest_conversion') {
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        console.log(`[Subscription Cancelled]: User ${userId} reverted to FREE tier.`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const tier = subscription.metadata?.tier || 'pro';
      const status = subscription.status;

      if (userId && userId !== 'guest_conversion') {
        const targetTier = status === 'active' ? tier : 'free';
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: targetTier,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}