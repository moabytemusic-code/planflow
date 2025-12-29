import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLessons, getUserData } from "./actions"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { CreateLessonModal } from "@/components/create-lesson-modal"
import { HelpBubble } from "@/components/help-bubble"
import Link from "next/link"

export default async function DashboardPage() {
    const rawLessons = await getLessons().catch(err => {
        console.error("Failed to fetch lessons:", err);
        return [];
    });
    const userData = await getUserData()
    // Serialize Date objects to avoid Client Component warnings
    const lessons = rawLessons.map(l => ({
        ...l,
        date: l.date.toISOString(),
        createdAt: l.createdAt.toISOString()
    }))

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 relative overflow-hidden">
            {/* Ambient Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-indigo-950/20 dark:via-purple-900/10 dark:to-blue-900/20 -z-10 pointer-events-none" />

            <div className="flex items-center justify-between space-y-2 relative z-10">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        Weekly Planner
                        <HelpBubble content="Your central hub. Drag lessons to reschedule, or click them for AI details." />
                    </h2>
                    <p className="text-muted-foreground mt-1 text-lg">Manage your curriculum with AI precision.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateLessonModal>
                        <Button className="shadow-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300">
                            <Plus className="mr-2 h-4 w-4" /> Create Lesson
                        </Button>
                    </CreateLessonModal>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-indigo-500 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Total Lessons
                            <HelpBubble content="Total number of lessons created." />
                        </CardTitle>
                        <Link href="/dashboard/lessons">
                            <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-primary">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{lessons.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +0 from last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-purple-500 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Credits Remaining
                            <HelpBubble content="Deploy your AI assistant. Upgrade for unlimited power." />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{userData?.credits ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {userData?.subscriptionTier === 'PRO' ? 'Gold Tier' : 'Free Tier'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden ring-1 ring-slate-900/5">
                <WeeklyCalendar lessons={lessons} />
            </div>
        </div>
    )
}
