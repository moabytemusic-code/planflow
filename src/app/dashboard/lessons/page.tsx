import { getLessons } from "@/app/dashboard/actions"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar, Clock, GraduationCap, FileText } from "lucide-react"
import Link from "next/link"

export default async function LessonsPage() {
    const lessons = await getLessons()

    return (
        <div className="space-y-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Curriculum Management</h1>
                        <p className="text-slate-500 dark:text-slate-400">A complete history of your curriculum.</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {lessons.length === 0 ? (
                        <Card className="bg-white/50 dark:bg-slate-900/50">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <FileText className="w-12 h-12 mb-4 opacity-20" />
                                <p>No lessons found.</p>
                                <Link href="/dashboard" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                    Create your first lesson
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        lessons.map((lesson) => (
                            <Link key={lesson.id} href={`/p/${lesson.id}`} className="block group">
                                <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary cursor-pointer">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{lesson.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(lesson.date), 'PPP')}
                                                </span>
                                                {lesson.startTime && (
                                                    <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                                                        {lesson.startTime}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {lesson.duration}m
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" />
                                                    {lesson.grade}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Status indicator could go here based on content presence */}
                                            <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 opacity-0 group-hover:opacity-100">
                                                View
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
