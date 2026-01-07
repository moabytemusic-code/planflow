'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                toast.success(data.message || 'Subscribed!');
            } else {
                toast.error(data.error || 'Something went wrong.');
            }
        } catch {
            toast.error('Failed to subscribe.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-green-700">You&apos;re in!</h3>
                <p className="text-sm text-green-600">Keep an eye on your inbox for your first freebie.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border shadow-sm">
            <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 mb-2">
                    <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Get 1 Free AI Lesson Hook Every Week</h2>
                <p className="text-slate-500">
                    Not ready to join? No problem. Join 2,000+ teachers getting &quot;Viral Hook&quot; ideas delivered to their inbox every Sunday night.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="teacher@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 bg-white dark:bg-slate-950"
                    />
                    <Button type="submit" disabled={loading} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Newsletter'}
                    </Button>
                </form>
                <p className="text-xs text-slate-400">Unsubscribe anytime. We hate spam too.</p>
            </div>
        </div>
    );
}
