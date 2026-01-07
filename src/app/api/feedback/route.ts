/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { message, email, type } = await req.json();

        const { data, error } = await resend.emails.send({
            from: 'PlanFlow Feedback <feedback@planflow.io>', // Update this to a verified domain if you have one, or use 'onboarding@resend.dev' for testing
            to: ['delivered@resend.dev'], // Send to yourself (or delivered@resend.dev for testing)
            subject: `[PlanFlow Feedback] ${type}`,
            html: `
        <h3>New Feedback Received</h3>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>User:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f1f1f1; padding: 10px; border-left: 4px solid #333;">
            ${message}
        </blockquote>
      `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
