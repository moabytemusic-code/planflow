'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import db from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function createLesson(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const grade = formData.get('grade') as string
    const duration = parseInt(formData.get('duration') as string)
    const dateStr = formData.get('date') as string
    const startTime = formData.get('startTime') as string

    // Set time to noon to avoid timezone shifts when saving/retrieving
    const date = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date()

    // Ensure user exists in Prisma DB (sync with Supabase Auth)
    // In a production app, use Supabase Triggers for this.
    let dbUser = await db.user.findUnique({
        where: { email: user.email! }
    })

    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                id: user.id, // reliable link if we use Supabase ID
                email: user.email!,
                subscriptionTier: 'FREE'
            }
        })
    }

    await db.lessonPlan.create({
        data: {
            title,
            grade,
            duration,
            date,
            startTime, // Save optional time
            content: {}, // Empty for now, AI will fill this later
            userId: dbUser.id
        }
    })

    revalidatePath('/dashboard')
    return { success: true }
}

export async function getLessons() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    let dbUser = await db.user.findUnique({
        where: { email: user.email! }
    })

    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                id: user.id,
                email: user.email!,
                subscriptionTier: 'FREE',
                credits: 3
            }
        })
    }

    return await db.lessonPlan.findMany({
        where: {
            userId: dbUser.id
        },
        orderBy: {
            date: 'asc'
        }
    })
}

export async function updateLessonDate(lessonId: string, newDate: Date) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    await db.lessonPlan.update({
        where: {
            id: lessonId,
            userId: user.id // Ensure ownership
        },
        data: {
            date: newDate
        }
    })

    revalidatePath('/dashboard')
}

export async function updateLessonDetails(lessonId: string, data: {
    title?: string,
    grade?: string,
    duration?: number,
    startTime?: string,
    content?: Prisma.InputJsonValue
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    await db.lessonPlan.update({
        where: {
            id: lessonId,
            userId: user.id
        },
        data: {
            ...data
        }
    })

    revalidatePath('/dashboard')
    revalidatePath(`/p/${lessonId}`) // Revalidate the public page too
    return { success: true }
}

export async function getUserData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    let dbUser = await db.user.findUnique({
        where: { email: user.email! }
    })

    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                id: user.id,
                email: user.email!,
                subscriptionTier: 'FREE',
                credits: 3
            }
        })
    }

    return dbUser
}

export async function updateProfile(data: { name?: string; theme?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    try {
        await db.user.update({
            where: { email: user.email! },
            data: {
                ...data
            }
        })
        revalidatePath('/dashboard/profile')
        return { success: true }
    } catch (error) {
        console.error('Prisma Profile Update Error:', error)
        throw error
    }
}
