import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export function UserNav({ email }: { email?: string }) {
    const initial = email ? email[0].toUpperCase() : 'U';

    return (
        <div className="flex items-center gap-3">
            <Link href="/dashboard/profile">
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 p-0 overflow-hidden border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-indigo-500 transition-all">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{initial}</span>
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
