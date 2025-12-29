'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Login Error:", error)
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Auto-confirm if focusing on MVP dev speed, or handle email confirmation properly.
    // For now, let's keep it standard but ensure we catch the error properly.

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // For local dev, this ensures the link redirects back correctly.
            emailRedirectTo: `${baseUrl}/auth/callback`,
        },
    })

    if (error) {
        console.error("Signup Error:", error)
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // If auto-confirm is enabled in Supabase (often default for dev), we can just login
    if (data.session) {
        redirect('/dashboard')
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=Check email to continue sign in process')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/callback?next=/dashboard/profile`,
    })

    if (error) {
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    return redirect('/login?message=Check your email for the password reset link')
}
