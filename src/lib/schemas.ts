import { z } from 'zod';

// Define the schema for a lesson plan block
export const lessonBlockSchema = z.object({
    title: z.string().describe('Title of this specific section (e.g., "Warm-up", "Direct Instruction")'),
    duration: z.number().describe('Duration in minutes for this block'),
    content: z.string().describe('Detailed instructions, script, or activity description for the teacher'),
    materials: z.array(z.string()).describe('List of materials needed for this specific block'),
});

// Define the schema for the entire lesson plan
export const lessonPlanSchema = z.object({
    topic: z.string().describe('The main topic of the lesson'),
    gradeLevel: z.string().describe('Target grade level'),
    standardsOrigin: z.string().describe('The origin of the standards used (e.g., "Common Core", "Texas TEKS", "Virginia SOL")'),
    standards: z.array(z.string()).describe('List of Common Core State Standards addressed (e.g. CCSS.MATH.CONTENT.4.NF.B.3)'),
    learningObjectives: z.array(z.string()).describe('List of specific learning objectives (SWBAT)'),
    blocks: z.array(lessonBlockSchema).describe('Chronological blocks of the lesson'),
    differentiation: z.object({
        strugglingStudents: z.string().describe('Strategies for supporting struggling students'),
        advancedStudents: z.string().describe('Strategies for challenging advanced students'),
    }),
    assessment: z.string().describe('Formative or summative assessment strategy'),
});

export type LessonPlanAIStructure = z.infer<typeof lessonPlanSchema>;
