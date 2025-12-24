'use client'

import { useState } from 'react'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { lessonPlanSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Share2, Eye } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'

export function AIPlanner({
    lessonId,
    existingTitle,
    grade,
    hasContent = false
}: {
    lessonId: string,
    existingTitle: string,
    grade: string,
    hasContent?: boolean
}) {
    const [open, setOpen] = useState(false)

    const { object, submit, isLoading, error } = useObject({
        api: '/api/generate-lesson',
        schema: lessonPlanSchema,
    })

    if (hasContent) {
        return (
            <Link href={`/p/${lessonId}`} className="w-full block">
                <Button variant="outline" size="sm" className="gap-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">
                    <Eye className="w-4 h-4" />
                    See Details
                </Button>
            </Link>
        )
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const prompt = formData.get('prompt') as string

        // Pass lessonId so the server can save it when finished
        submit({ prompt: `Create a lesson for "${existingTitle}" for grade level "${grade}". Context: ${prompt}`, lessonId })
    }

    const handlePrint = () => {
        window.print()
    }

    const handleShare = () => {
        const url = `${window.location.origin}/p/${lessonId}`
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 w-full">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Generate
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
                <DialogHeader className="print:hidden">
                    <DialogTitle>Lesson Details</DialogTitle>
                    <DialogDescription>
                        Generate or view the detailed lesson plan.
                    </DialogDescription>
                </DialogHeader>

                {!object && !isLoading && (
                    <form onSubmit={handleSubmit} className="space-y-4 print:hidden">
                        <Textarea
                            name="prompt"
                            placeholder={`Describe what you want for this ${grade} lesson...`}
                            className="min-h-[100px]"
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button type="submit" className="w-full">Generate Plan</Button>
                    </form>
                )}

                {error && (
                    <div className="text-red-500 text-sm print:hidden">{error.message}</div>
                )}

                {(isLoading || object) && (
                    <div className="space-y-6 mt-4 print:block">
                        {isLoading && !object && (
                            <div className="flex items-center justify-center p-8 print:hidden">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {object?.topic && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 border p-6 rounded-md bg-white dark:bg-slate-900 shadow-sm print:border-none print:shadow-none print:p-0">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h1 className="font-bold text-2xl text-gray-900 dark:text-gray-100">{object.topic}</h1>
                                        <div className="flex gap-2 text-sm font-medium text-indigo-600">
                                            <span className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">{object.gradeLevel}</span>
                                            {/* We could add duration here if it was in the AI schema, but it's on the parent card */}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 print:hidden">
                                        <Button variant="outline" size="sm" onClick={handleShare}>
                                            <Share2 className="w-4 h-4 mr-2" /> Share
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
                                            Print
                                        </Button>
                                    </div>
                                </div>

                                {object.learningObjectives && (
                                    <div className="prose dark:prose-invert max-w-none">
                                        {object.standards && object.standards.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Standards</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {object.standards.map((std, i) => (
                                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                                            {std}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Objectives</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {object.learningObjectives.map((obj, i) => (
                                                <li key={i}>{obj}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Lesson Flow</h3>
                                    {object.blocks?.map((block, i) => (
                                        <div key={i} className="border-l-2 border-indigo-200 pl-4 py-1 space-y-1">
                                            <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-200">
                                                <span>{block?.title}</span>
                                                <span className="text-sm text-gray-500">{block?.duration} min</span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{block?.content}</p>
                                            {block?.materials && block.materials.length > 0 && (
                                                <div className="text-sm text-gray-500 mt-2">
                                                    <span className="font-medium">Materials:</span> {block.materials.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {object.differentiation && (
                                    <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Support</h4>
                                            <p className="text-sm text-gray-600 italic">{object.differentiation.strugglingStudents}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Challenge</h4>
                                            <p className="text-sm text-gray-600 italic">{object.differentiation.advancedStudents}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
