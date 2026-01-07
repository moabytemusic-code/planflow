import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Define the schema for the output
const viralHooksSchema = z.object({
    hooks: z.array(z.object({
        type: z.string().describe('The style of the hook (e.g., "TikTok Challenge", "Mind-Blowing Fact", "Storytime")'),
        content: z.string().describe('The actual script or opener for the teacher to say'),
        explanation: z.string().describe('Briefly explain why this works for this age group'),
    })).length(3)
});

export async function POST(req: Request) {
    try {
        const { topic, grade } = await req.json();

        const { object } = await generateObject({
            model: openai('gpt-4o'),
            schema: viralHooksSchema,
            prompt: `You are a Gen Alpha marketing expert turned teacher. 
      Create 3 high-engagement "Viral Hooks" to start a lesson on "${topic}" for ${grade} students.
      
      The goal is to grab attention immediately using current trends, memes, analogies (Minecraft, Roblox, Skibidi, MrBeast, etc.), or mind-blowing comparisons that strictly appeal to students in 2024-2025.
      
      Do NOT be "cringe" - be legitimately interesting or humorously relatable.
      `,
        });

        return NextResponse.json(object);
    } catch (error) {
        console.error('Error generating hooks:', error);
        return NextResponse.json({ error: 'Failed to generate hooks' }, { status: 500 });
    }
}
