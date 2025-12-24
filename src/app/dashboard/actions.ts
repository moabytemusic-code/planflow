'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import db from '@/lib/db'
import { Prisma } from '@prisma/client'
import { Resend } from 'resend'
import { ShareInvitationEmail } from '@/components/emails/share-invitation'


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
            OR: [
                { userId: dbUser.id },
                { shares: { some: { userEmail: user.email! } } }
            ]
        },
        orderBy: {
            date: 'asc'
        },
        include: {
            shares: true // Optional: if we want to show sharing status
        }
    })
}

export async function shareLesson(lessonId: string, email: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Verify ownership
    const lesson = await db.lessonPlan.findUnique({
        where: { id: lessonId, userId: user.id }
    })

    if (!lesson) throw new Error('Lesson not found or you do not have permission to share it.')

    // Check if target user exists to link userId immediately
    const targetUser = await db.user.findUnique({ where: { email } })

    await db.lessonShare.create({
        data: {
            lessonId,
            userEmail: email,
            userId: targetUser?.id,
            permission: 'EDIT'
        }
    })

    // Fetch inviter details for the email
    const inviter = await db.user.findUnique({ where: { id: user.id } })
    const inviterName = inviter?.name || user.email || 'A colleague'

    try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
            from: 'PlanFlow <onboarding@resend.dev>',
            to: email,
            subject: `Invitation to collaborate on "${lesson.title}"`,
            react: ShareInvitationEmail({
                inviterName,
                lessonTitle: lesson.title,
                lessonId: lesson.id
            }) as React.ReactNode
        })
    } catch (error) {
        console.error('Failed to send share email:', error)
        // Don't block the UI flow, just log the error
    }

    revalidatePath('/dashboard')
    return { success: true }
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

    // Check for ownership OR edit permission via share
    const lesson = await db.lessonPlan.findFirst({
        where: {
            id: lessonId,
            OR: [
                { userId: user.id },
                { shares: { some: { userEmail: user.email!, permission: 'EDIT' } } }
            ]
        }
    })

    if (!lesson) throw new Error('Unauthorized: You cannot edit this lesson.')

    await db.lessonPlan.update({
        where: { id: lessonId },
        data: { ...data }
    })

    revalidatePath('/dashboard')
    revalidatePath(`/p/${lessonId}`) // Revalidate the public page too
    return { success: true }
}

export async function deleteLesson(lessonId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Verify ownership - ONLY owners can delete
    const lesson = await db.lessonPlan.findUnique({
        where: {
            id: lessonId,
            userId: user.id
        }
    })

    if (!lesson) throw new Error('Unauthorized: You can only delete lessons you created.')

    await db.lessonPlan.delete({
        where: { id: lessonId }
    })

    revalidatePath('/dashboard')
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

export async function updateProfile(data: { name?: string; theme?: string; state?: string }) {
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

export async function revalidateDashboard() {
    revalidatePath('/dashboard')
}
