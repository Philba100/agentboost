import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userId, priceId, tier = 'pro' } = body;

    // Resolve domain for checkout redirection
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_API_URL || 'https://agentboost-seven.vercel.app';

    // Fallback price IDs if custom Stripe IDs are not set in environment
    const resolvedPriceId =
      priceId ||
      (tier === 'enterprise'
        ? process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID);

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'No valid Stripe Price ID configured for this subscription tier.' },
        { status: 400 }
      );
    }

    // Determine metadata: link to existing Supabase user if logged in
    let customerUserId = userId;

    if (!customerUserId && email) {
      // Look up existing user by email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const existing = users?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (existing) {
        customerUserId = existing.id;
      }
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?payment=success&tier=${tier}`,
      cancel_url: `${origin}/dashboard?payment=cancelled`,
      metadata: {
        userId: customerUserId || 'guest_conversion',
        tier: tier,
        email: email || '',
      },
      subscription_data: {
        metadata: {
          userId: customerUserId || 'guest_conversion',
          tier: tier,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Creation Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to initialize payment gateway' },
      { status: 500 }
    );
  }
}