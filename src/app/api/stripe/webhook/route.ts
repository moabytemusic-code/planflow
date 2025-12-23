import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;

        if (!session?.metadata?.userId) {
            return new NextResponse('User id is required', { status: 400 });
        }

        // Upsert Subscription
        await db.subscription.create({
            data: {
                userId: session.metadata.userId,
                stripeSubId: subscription.id,
                status: subscription.status,
                // @ts-expect-error Stripe v20 type mismatch
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        })

        // Update User Tier
        await db.user.update({
            where: { id: session.metadata.userId },
            data: {
                subscriptionTier: 'PRO',
                credits: 100 // Reset/Bump credits for Pro
            }
        })
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;

        // Renew logic: extend date
        await db.subscription.update({
            where: { stripeSubId: subscription.id },
            data: {
                // @ts-expect-error Stripe v20 type mismatch
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: subscription.status
            }
        })
    }

    return new NextResponse(null, { status: 200 });
}
