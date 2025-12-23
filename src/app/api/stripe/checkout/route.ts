import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { priceId } = await req.json();

        // 1. Get or create internal User record
        let dbUser = await db.user.findUnique({
            where: { email: user.email! }
        });

        if (!dbUser) {
            // Fallback sync if they signed up but didn't trigger previous logic
            dbUser = await db.user.create({
                data: {
                    id: user.id,
                    email: user.email!,
                }
            });
        }

        // 2. Get or create Stripe Customer
        let stripeCustomerId = dbUser.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email!,
                metadata: {
                    userId: user.id,
                }
            });
            stripeCustomerId = customer.id;

            await db.user.update({
                where: { id: user.id },
                data: { stripeCustomerId }
            });
        }

        // 3. Create Checkout Session
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/dashboard?success=true`,
            cancel_url: `${origin}/pricing?canceled=true`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
