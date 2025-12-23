
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { Metadata } from 'next';
import { LessonEditor } from './lesson-editor';
import { createClient } from '@/utils/supabase/server';

// Force dynamic since we are fetching specific IDs
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>
}

async function getLesson(id: string) {
    // In a real app, you might check a "isPublic" flag.
    // For this MVP, knowing the ID allows access (unlisted link).
    return await db.lessonPlan.findUnique({
        where: { id },
        include: { user: { select: { email: true } } } // Optional: show author
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const lesson = await getLesson(id);
    if (!lesson) return { title: 'Lesson Not Found' };
    return {
        title: `${lesson.title} - PlanFlow`,
        description: `View this lesson plan for ${lesson.grade}: ${lesson.title}`,
    };
}

export default async function PublicLessonPage({ params }: Props) {
    const { id } = await params;
    const lesson = await getLesson(id);

    if (!lesson) {
        notFound();
    }

    // Auth check for ownership
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isOwner = user?.id === lesson.userId;

    // Convert date to string for client component to handle safely
    const serializedLesson = {
        ...lesson,
        date: lesson.date.toISOString(),
        content: lesson.content as Parameters<typeof LessonEditor>[0]['lesson']['content'],
        startTime: lesson.startTime ?? undefined
    };

    return (
        <LessonEditor lesson={serializedLesson} isOwner={!!isOwner} />
    )
}
