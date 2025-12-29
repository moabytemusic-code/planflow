import { AuthForm } from './login-form'

export default async function LoginPage(props: {
    searchParams: Promise<{ message: string; error: string }>
}) {
    const searchParams = await props.searchParams

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-200/40 dark:bg-purple-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full flex justify-center py-12">
                <AuthForm searchParams={searchParams} />
            </div>

            {/* Subtle Footer */}
            <div className="absolute bottom-6 left-0 w-full text-center text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                Securely encrypted by PlanFlow Authentication
            </div>
        </div>
    )
}
