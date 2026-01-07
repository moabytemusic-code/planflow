'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Clock, Edit2 } from 'lucide-react';
import { HeaderExportButtons, PrintButton } from './print-buttons';
import { updateLessonDetails } from '@/app/dashboard/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

interface LessonEditorProps {
    lesson: {
        id: string;
        title: string;
        date: string;
        duration: number;
        grade: string;
        content: LessonContent;
        startTime?: string;
    };
    isOwner: boolean;
}

export function LessonEditor({ lesson, isOwner }: LessonEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(lesson.title);
    const [grade, setGrade] = useState(lesson.grade);
    const [duration, setDuration] = useState(lesson.duration.toString());
    const [startTime, setStartTime] = useState(lesson.startTime || '');

    // Deep copy/parse content to avoid mutation issues
    const [content, setContent] = useState<LessonContent>(lesson.content || {});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateLessonDetails(lesson.id, {
                title,
                grade,
                duration: parseInt(duration),
                startTime,
                // @ts-expect-error Prisma JSON type mismatch
                content
            });
            toast.success('Lesson updated successfully');
            setIsEditing(false);
            router.refresh();
        } catch (e) {
            toast.error('Failed to update lesson');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateBlock = (index: number, field: string, value: string) => {
        if (!content.blocks) return;
        const newBlocks = [...content.blocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setContent({ ...content, blocks: newBlocks });
    };

    if (!isEditing) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
                <div className="max-w-4xl mx-auto space-y-8 print:max-w-none">
                    {/* Header */}
                    <div className="flex justify-between items-start print:hidden">
                        <div className="flex flex-col gap-4">
                            <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Link>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{lesson.title}</h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                                    {lesson.grade} • {lesson.duration} mins • {format(new Date(lesson.date), 'PPP')} {lesson.startTime ? `• ${lesson.startTime}` : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isOwner && (
                                <Button onClick={() => setIsEditing(true)} variant="secondary" className="gap-2">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </Button>
                            )}
                            <HeaderExportButtons lesson={lesson} />
                        </div>
                    </div>

                    {/* Print-only Header */}
                    <div className="hidden print:block mb-8 border-b pb-4">
                        <h1 className="text-4xl font-bold text-black">{lesson.title}</h1>
                        <p className="text-xl text-gray-600 mt-2">
                            {lesson.grade} • {lesson.duration} mins
                        </p>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none">
                        {/* Topic Banner */}
                        {content?.topic && (
                            <div className="bg-indigo-600 px-8 py-6 print:bg-transparent print:px-0 print:py-4">
                                <h2 className="text-xl font-bold text-white print:text-black">Topic: {content.topic}</h2>
                            </div>
                        )}

                        <div className="p-8 space-y-8 print:p-0">
                            {/* Objectives */}
                            {content?.learningObjectives && (
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Learning Objectives</h3>
                                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                        {content.learningObjectives.map((obj, i) => (
                                            <li key={i}>{obj}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Lesson Blocks */}
                            {content?.blocks && (
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Lesson Flow</h3>
                                    <div className="space-y-6">
                                        {content.blocks.map((block, i) => (
                                            <div key={i} className="group relative border-l-4 border-indigo-200 pl-6 py-2 hover:border-indigo-500 transition-colors print:border-l-2 print:border-black">
                                                <div className="flex justify-between items-baseline mb-2">
                                                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{block.title}</h4>
                                                    <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full print:bg-transparent print:border print:border-gray-300">
                                                        {block.duration} min
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{block.content}</p>

                                                {block.materials && block.materials.length > 0 && (
                                                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Materials:</span>
                                                        <span>{block.materials.join(', ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Differentiation */}
                            {content?.differentiation && (
                                <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 print:bg-transparent print:border print:border-gray-300">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Differentiation</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Struggling Learners</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{content.differentiation.strugglingStudents}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">Advanced Learners</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{content.differentiation.advancedStudents}</p>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                    <div className="text-center text-sm text-slate-400 print:hidden">
                        <p>Created with PlanFlow AI</p>
                    </div>
                </div>
                <PrintButton />
            </div>
        );
    }

    // --- EDIT MODE ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Editors */}
                <div className="flex justify-between items-start">
                    <div className="space-y-4 w-full">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Title</label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} className="font-bold text-lg" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Grade</label>
                                <Input value={grade} onChange={e => setGrade(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Duration (min)</label>
                                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Start Time</label>
                                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 space-y-8">

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Topic</label>
                        <Input
                            value={content.topic || ''}
                            onChange={e => setContent({ ...content, topic: e.target.value })}
                            className="text-lg font-bold"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-2 block">Lesson Blocks</label>
                        {content.blocks?.map((block, i) => (
                            <div key={i} className="border p-4 rounded-lg space-y-3 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-muted-foreground">Block Title</label>
                                        <Input
                                            value={block.title}
                                            onChange={e => updateBlock(i, 'title', e.target.value)}
                                            className="font-semibold"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs text-muted-foreground">Time</label>
                                        <Input
                                            value={block.duration}
                                            onChange={e => updateBlock(i, 'duration', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Content</label>
                                    <Textarea
                                        value={block.content}
                                        onChange={e => updateBlock(i, 'content', e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-2 block">Differentiation</label>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-indigo-600 mb-1 block">Struggling Learners</label>
                                <Textarea
                                    value={content.differentiation?.strugglingStudents || ''}
                                    onChange={e => setContent({
                                        ...content,
                                        differentiation: { ...content.differentiation, strugglingStudents: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-green-600 mb-1 block">Advanced Learners</label>
                                <Textarea
                                    value={content.differentiation?.advancedStudents || ''}
                                    onChange={e => setContent({
                                        ...content,
                                        differentiation: { ...content.differentiation, advancedStudents: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end gap-4 fixed bottom-8 right-8 z-50">
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="lg" className="shadow-lg">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading} size="lg" className="shadow-lg">
                        {loading && <Clock className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}
