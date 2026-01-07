import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, BorderStyle } from "docx";

interface LessonContent {
    topic?: string;
    learningObjectives?: string[];
    blocks?: Array<{
        title: string;
        duration: string;
        content: string;
        materials?: string[];
    }>;
    differentiation?: {
        strugglingStudents?: string;
        advancedStudents?: string;
    };
    [key: string]: unknown;
}

interface LessonData {
    title: string;
    grade: string;
    duration: number; // in minutes
    date: string; // ISO string
    content: LessonContent;
}

export const generateWordDocument = async (lesson: LessonData): Promise<Blob> => {
    const { title, grade, duration, content } = lesson;

    // Helper to create a section header
    const createSectionHeader = (text: string) => {
        return new Paragraph({
            text: text.toUpperCase(),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 400, after: 200 },
            border: {
                bottom: {
                    color: "E2E8F0",
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 6,
                },
            },
        });
    };

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Title
                    new Paragraph({
                        text: title,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 },
                    }),

                    // Meta Info (Grade • Duration)
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [
                            new TextRun({
                                text: `${grade} • ${duration} minutes`,
                                size: 24, // 12pt
                                color: "64748B", // Slate-500
                            }),
                        ],
                    }),

                    // Topic
                    ...(content.topic ? [
                        new Paragraph({
                            text: `Topic: ${content.topic}`,
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 400 },
                        })
                    ] : []),

                    // Learning Objectives
                    ...(content.learningObjectives && content.learningObjectives.length > 0 ? [
                        createSectionHeader("Learning Objectives"),
                        ...content.learningObjectives.map(obj =>
                            new Paragraph({
                                text: obj,
                                bullet: { level: 0 },
                                spacing: { after: 100 },
                            })
                        )
                    ] : []),

                    // Lesson Flow
                    ...(content.blocks && content.blocks.length > 0 ? [
                        createSectionHeader("Lesson Flow"),
                        ...content.blocks.flatMap(block => [
                            new Paragraph({
                                text: block.title,
                                heading: HeadingLevel.HEADING_4,
                                spacing: { before: 200, after: 50 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Duration: ${block.duration} min`,
                                        italics: true,
                                        size: 20,
                                        color: "64748B"
                                    })
                                ],
                                spacing: { after: 100 }
                            }),
                            new Paragraph({
                                text: block.content,
                                spacing: { after: 200 }
                            }),
                            ...(block.materials && block.materials.length > 0 ? [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: "Materials: ", bold: true }),
                                        new TextRun({ text: block.materials.join(", ") })
                                    ],
                                    spacing: { after: 200 }
                                })
                            ] : [])
                        ])
                    ] : []),

                    // Differentiation
                    ...(content.differentiation ? [
                        createSectionHeader("Differentiation"),

                        // Struggling
                        ...(content.differentiation.strugglingStudents ? [
                            new Paragraph({
                                spacing: { before: 200, after: 100 },
                                children: [
                                    new TextRun({
                                        text: "For Struggling Learners:",
                                        bold: true,
                                        color: "4F46E5" // Indigo
                                    })
                                ]
                            }),
                            new Paragraph({
                                text: content.differentiation.strugglingStudents,
                                spacing: { after: 200 }
                            })
                        ] : []),

                        // Advanced
                        ...(content.differentiation.advancedStudents ? [
                            new Paragraph({
                                spacing: { before: 200, after: 100 },
                                children: [
                                    new TextRun({
                                        text: "For Advanced Learners:",
                                        bold: true,
                                        color: "16A34A" // Green
                                    })
                                ]
                            }),
                            new Paragraph({
                                text: content.differentiation.advancedStudents,
                                spacing: { after: 200 }
                            })
                        ] : [])
                    ] : []),

                    // Footer branding
                    new Paragraph({
                        text: "Generated with PlanFlow AI",
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800 },
                        children: [
                            new TextRun({
                                text: "Generated with PlanFlow AI",
                                italics: true,
                                color: "94A3B8",
                                size: 16
                            })
                        ]
                    })
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};
