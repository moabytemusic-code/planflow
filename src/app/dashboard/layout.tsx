import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserNav } from '@/components/user-nav'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Menu, LayoutDashboard, Library, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/lessons', label: 'Curriculum', icon: Library },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ]

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-4">
                    {/* Mobile Menu */}
                    <div className="flex md:hidden mr-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="pb-6 border-b">
                                    <SheetTitle className="text-left bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-2xl font-bold">
                                        PlanFlow
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-4 mt-6">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
                                        >
                                            <link.icon className="h-5 w-5 text-indigo-500" />
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link className="flex items-center space-x-2 group" href="/">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl tracking-tight hidden sm:block">PlanFlow</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-foreground/60"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav email={user.email} />
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </main>
        </div>
    )
}
