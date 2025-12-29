'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (priceId: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create checkout session');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e: unknown) {
            console.error(e)
            const message = e instanceof Error ? e.message : "An error occurred";
            alert(message)
        } finally {
            setLoading(false);
        }
    }

    // Replace this with your actual Stripe Price ID from your dashboard
    const PRO_PRICE_ID = 'price_1ShgazBa3LVp9FtONj5gynyn';

    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl w-full space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits to your classroom.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Free Plan */}
                    <div className="p-8 border rounded-xl shadow-sm bg-white dark:bg-gray-800 flex flex-col items-center">
                        <h3 className="text-2xl font-bold">Free</h3>
                        <p className="text-4xl font-bold my-4">$0<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                        <div className="text-sm text-gray-500 mb-8 space-y-2">
                            <p>3 AI Credits / Month</p>
                            <p>Basic Calendar Access</p>
                        </div>
                        <Button variant="outline" className="w-full mt-auto" onClick={() => window.location.href = '/login'}>
                            Get Started
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 border-2 border-primary rounded-xl shadow-lg bg-white dark:bg-gray-800 relative flex flex-col items-center transform scale-105">
                        <div className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold">Pro</h3>
                        <p className="text-4xl font-bold my-4">$19<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                        <div className="text-sm text-gray-500 mb-8 space-y-2">
                            <p>Unlimited AI Credits</p>
                            <p>Advanced Calendar Features</p>
                            <p>Priority Support</p>
                        </div>
                        <Button
                            className="w-full mt-auto"
                            onClick={() => handleSubscribe(PRO_PRICE_ID)}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Upgrade to Pro'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
