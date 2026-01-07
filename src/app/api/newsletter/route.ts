import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const { email } = schema.parse(json);

        // Initial check to avoid duplicates (Prisma would throw, but this is cleaner)
        const existing = await db.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ success: true, message: 'Actually, you were already signed up!' });
        }

        await db.newsletterSubscriber.create({
            data: { email },
        });

        return NextResponse.json({ success: true, message: 'Welcome to the inner circle.' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
