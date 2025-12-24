import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { lessonPlanSchema } from '@/lib/schemas';
import { createClient } from '@/utils/supabase/server';
import db from '@/lib/db';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
    // 1. Authenticate User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    // 2. Parse Request
    const { prompt, lessonId } = await req.json();

    if (!prompt) {
        return new Response('Prompt is required', { status: 400 });
    }

    // 3. Initiate AI Stream
    console.log("Starting AI generation for prompt:", prompt);
    const userState = user ? await db.user.findUnique({ where: { email: user.email! }, select: { state: true } }) : null;
    const standardSystem = userState?.state ? `${userState.state} State Standards` : "Common Core State Standards";

    try {
        const result = await streamObject({
            model: openai('gpt-4o'),
            schema: lessonPlanSchema,
            prompt: `You are an expert curriculum developer. Create a detailed lesson plan based on the following request: "${prompt}". 
                 Ensure the plan is practical, engaging, and aligned with ${standardSystem}.
                 Set the 'standardsOrigin' field to "${standardSystem}".`,
            onFinish: async ({ object, error }) => {
                if (error) {
                    console.error("AI Generation Error:", error);
                }
                if (object) {
                    console.log("AI Generation Success:", object.topic);
                    if (lessonId) {
                        try {
                            await db.lessonPlan.update({
                                where: { id: lessonId },
                                data: { content: object as object }
                            })
                            console.log("Lesson updated in DB");
                        } catch (dbErr) {
                            console.error("DB Update Error:", dbErr);
                        }
                    }
                }
            }
        });

        console.log("Stream initiated successfully");
        return result.toTextStreamResponse();
    } catch (e) {
        console.error("Route Handler Error:", e);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: e }), { status: 500 });
    }


}
