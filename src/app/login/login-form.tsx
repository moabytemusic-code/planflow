'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { login, signup, forgotPassword } from './actions';
import { HelpBubble } from '@/components/help-bubble';
import { InfoIcon, Loader2 } from 'lucide-react';

export function AuthForm({ searchParams }: {
    searchParams: { message?: string; error?: string }
}) {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [loading, setLoading] = useState(false);

    const handleFormAction = async (formData: FormData, action: (fd: FormData) => Promise<unknown>) => {
        setLoading(true);
        try {
            await action(formData);
        } catch (e) {
            // Error handling is mostly done via redirects in the actions
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-indigo-100 dark:border-indigo-950/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-600 shadow-indigo-200 shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join PlanFlow' : 'Reset Password'}
                </CardTitle>
                <CardDescription className="text-center text-slate-500 dark:text-slate-400">
                    {mode === 'login'
                        ? 'The smartest way to plan your curriculum'
                        : mode === 'signup'
                            ? 'Start your 14-day free trial today'
                            : 'Enter your email to receive a reset link'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 sticky top-0">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Register
                    </button>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                            {mode === 'signup' && (
                                <HelpBubble content="We'll send you a verification link. Simply click it to activate your account and get your 3 free credits.">
                                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 cursor-help font-medium">
                                        <InfoIcon className="w-3 h-3" /> How to create an account?
                                    </div>
                                </HelpBubble>
                            )}
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="teacher@example.com"
                            required
                            className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {mode !== 'forgot' && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                {mode === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => setMode('forgot')}
                                        className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    )}

                    {searchParams?.message && (
                        <div className="p-3 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 flex items-start gap-2">
                            <div className="mt-0.5">✓</div>
                            {searchParams.message}
                        </div>
                    )}

                    {searchParams?.error && (
                        <div className="p-3 text-sm font-medium text-rose-600 bg-rose-50 rounded-xl border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50 flex items-start gap-2">
                            <div className="mt-0.5 text-lg">!</div>
                            {searchParams.error}
                        </div>
                    )}

                    <Button
                        formAction={(fd) => handleFormAction(fd, mode === 'login' ? login : mode === 'signup' ? signup : forgotPassword)}
                        disabled={loading}
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-300 font-bold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            mode === 'login' ? 'Sign In Now' : mode === 'signup' ? 'Create My Account' : 'Send Reset Link'
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center mt-4 border-t pt-6 border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed px-4">
                    By continuing, you agree to our <a href="#" className="underline hover:text-indigo-500 italic">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-500 italic">Privacy Policy</a>.
                </p>
                {mode === 'forgot' && (
                    <button
                        onClick={() => setMode('login')}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold"
                    >
                        Actually, I remember my password
                    </button>
                )}
            </CardFooter>
        </Card>
    );
}
