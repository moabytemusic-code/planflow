import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export function UserNav({ email, subscriptionTier }: { email?: string, subscriptionTier?: string }) {
    const initial = email ? email[0].toUpperCase() : 'U';
    const isPro = subscriptionTier === 'PRO';

    return (
        <div className="flex items-center gap-3">
            {isPro && (
                <div className="hidden md:flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 border border-yellow-500/50 shadow-sm">
                    <span className="text-[10px] font-bold text-yellow-900 uppercase tracking-wide">
                        Plan Flow Pro User
                    </span>
                </div>
            )}
            <Link href="/dashboard/profile">
                <Button variant="ghost" className={`relative h-10 w-10 rounded-full p-0 overflow-hidden border transition-all ${isPro ? 'ring-2 ring-yellow-400 border-yellow-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-indigo-500'}`}>
                    <span className={`font-bold ${isPro ? 'text-amber-600' : 'text-indigo-600 dark:text-indigo-400'}`}>{initial}</span>
                </Button>
            </Link>
            <div className="flex flex-col hidden md:flex">
                <span className="text-xs font-bold leading-none">{email?.split('@')[0]}</span>
                <span className="text-[10px] text-muted-foreground">{email}</span>
            </div>
            <form action={signout}>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-rose-500">
                    <LogOut className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
