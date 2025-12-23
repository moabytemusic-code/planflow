'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getUserData, updateProfile } from '../actions';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, CheckCircle2, User, Mail, CreditCard, Palette } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    name?: string | null;
    subscriptionTier: string;
    credits: number;
    theme: string;
}

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        async function loadData() {
            const data = await getUserData();
            if (data) {
                setUserData(data);
                setName(data.name || '');
            }
        }
        loadData();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({ name });
            toast.success('Profile updated');
            // Refresh local state
            if (userData) {
                setUserData({ ...userData, name });
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        try {
            await updateProfile({ theme: newTheme });
        } catch (error: unknown) {
            console.error('Failed to sync theme to DB:', error);
            const message = error instanceof Error ? error.message : 'Failed to sync theme to DB';
            toast.error(message);
        }
    };

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-pulse text-muted-foreground">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Account Details */}
                <Card className="shadow-lg border-t-4 border-t-indigo-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>Update your basic account details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email Address
                                </Label>
                                <Input id="email" value={userData.email} disabled className="bg-muted ring-0 cursor-not-allowed" />
                                <p className="text-[10px] text-muted-foreground italic">Email changes are restricted at this time.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Subscription & Stats */}
                <Card className="shadow-lg border-t-4 border-t-purple-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-500" />
                            Plan & Usage
                        </CardTitle>
                        <CardDescription>Your current subscription and resource usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Plan</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    {userData.subscriptionTier} TIER
                                </p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">AI Credits Remaining</span>
                                <span className="font-bold">{userData.credits} / 3</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-500"
                                    style={{ width: `${(userData.credits / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50 dark:border-purple-900/50 dark:hover:bg-purple-900/20">
                            Upgrade to Pro
                        </Button>
                    </CardContent>
                </Card>

                {/* Theme Selection */}
                <Card className="shadow-lg border-t-4 border-t-emerald-500 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-emerald-500" />
                            Theme Preferences
                        </CardTitle>
                        <CardDescription>Choose the look and feel of your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Light Theme */}
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`group relative p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200'}`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-white shadow-md rounded-full text-amber-500">
                                        <Sun className="w-6 h-6" />
                                    </div>
                                    <span className="font-semibold">Light Mode</span>
                                </div>
                                {theme === 'light' && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-emerald-500" />}
                            </button>

                            {/* Dark Theme */}
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`group relative p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200'}`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-slate-900 shadow-md rounded-full text-indigo-400">
                                        <Moon className="w-6 h-6" />
                                    </div>
                                    <span className="font-semibold">Dark Mode</span>
                                </div>
                                {theme === 'dark' && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-emerald-500" />}
                            </button>

                            {/* Midnight Theme */}
                            <button
                                onClick={() => handleThemeChange('midnight')}
                                className={`group relative p-4 rounded-xl border-2 transition-all ${theme === 'midnight' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200'}`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-indigo-950 shadow-md rounded-full text-indigo-200">
                                        <Monitor className="w-6 h-6" />
                                    </div>
                                    <span className="font-semibold">Midnight Sky</span>
                                </div>
                                {theme === 'midnight' && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-emerald-500" />}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
