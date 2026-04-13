import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // WE NOW ACCEPT 'priceId' FROM THE FRONTEND
    const { email, userId, priceId } = body;

    if (!userId || !priceId) {
      return NextResponse.json({ error: 'Missing User ID or Price ID' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{
        price: priceId, // DYNAMIC PRICE INJECTED HERE
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        userId: userId, 
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}