'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AIPlanner } from '@/components/ai-planner'
import { DndContext, DragEndEvent, useDraggable, useDroppable, useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { updateLessonDate, deleteLesson } from '@/app/dashboard/actions'
import { ShareLessonDialog } from '@/components/share-lesson-dialog'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Lesson {
    id: string
    title: string
    date: Date | string
    duration: number
    grade: string
    content?: unknown
    startTime?: string | null
}

// ... (imports remain)

// ... (interfaces remain)

function LessonCard({ lesson }: { lesson: Lesson }) {
    return (
        <Card className="overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-lg border-l-4 border-l-indigo-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="p-3 space-y-2">
                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 break-words">
                    {lesson.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                    {lesson.startTime && (
                        <span className="bg-indigo-50 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {lesson.startTime}
                        </span>
                    )}
                    <span>{lesson.duration}m</span>
                    <span>{lesson.grade}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    {/* Stop propagation for button interaction */}
                    <div className="flex gap-2">
                        <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={async () => {
                                    if (confirm('Are you sure you want to delete this lesson? This cannot be undone.')) {
                                        try {
                                            await deleteLesson(lesson.id)
                                            toast.success('Lesson deleted')
                                        } catch {
                                            toast.error('Failed to delete lesson')
                                        }
                                    }
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                        <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                            <ShareLessonDialog lessonId={lesson.id} lessonTitle={lesson.title} />
                        </div>
                    </div>
                    <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                        <AIPlanner
                            lessonId={lesson.id}
                            existingTitle={lesson.title}
                            grade={lesson.grade}
                            hasContent={!!lesson.content && Object.keys(lesson.content as object).length > 0}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

function DraggableLesson({ lesson }: { lesson: Lesson }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: lesson.id,
        data: lesson
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`touch-none ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'opacity-100 hover:scale-[1.02]'} transition-transform duration-200`}
        >
            <LessonCard lesson={lesson} />
        </div>
    )
}

function DroppableDay({ day, children, isToday }: { day: Date, children: React.ReactNode, isToday: boolean }) {
    const { setNodeRef, isOver } = useDroppable({
        id: day.toISOString(),
        data: { date: day }
    })

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col border-r h-full last:border-r-0 min-w-[140px] md:min-w-0 transition-colors duration-300 ${isOver ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
        >
            <div className={`text-center py-3 border-b text-sm uppercase tracking-wide font-bold 
                ${isToday
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-muted/30 text-muted-foreground'}`}>
                {format(day, 'EEE d')}
            </div>
            <div className="flex-1 p-2 space-y-2 bg-slate-50/50 dark:bg-slate-900/20 min-h-[100px]">
                {children}
            </div>
        </div>
    )
}

export function WeeklyCalendar({ lessons = [] }: { lessons: Lesson[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

    // Navigation handlers
    const handlePrevWeek = () => setCurrentDate(prev => addDays(prev, -7))
    const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7))
    const handleToday = () => setCurrentDate(new Date())

    async function handleDragEnd(event: DragEndEvent) {
        // ... (same logic)
        const { active, over } = event
        if (over && active.id !== over.id) {
            const newDate = new Date(over.id as string)
            try {
                await updateLessonDate(active.id as string, newDate)
            } catch (error) {
                console.error("Failed to move lesson", error)
            }
        }
    }

    // Configure sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
            filter: (event: KeyboardEvent) => {
                const target = event.target as HTMLElement
                if (
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'SELECT' ||
                    target.isContentEditable
                ) {
                    return false
                }
                return true
            },
        })
    )

    // Render static grid for SSR (defaults to current week)
    if (!isMounted) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" disabled><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" disabled><ChevronRight className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" disabled>Today</Button>
                    </div>
                    <h2 className="text-lg font-semibold capitalize">
                        {format(new Date(), 'MMMM yyyy')}
                    </h2>
                </div>
                <div className="grid gap-4 grid-cols-7 border rounded-lg p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-[600px] overflow-x-auto min-w-[1200px]">
                    {days.map((day) => {
                        const dayLessons = lessons
                            .filter(lesson => isSameDay(new Date(lesson.date), day))
                            .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                        return (
                            <div key={day.toISOString()} className="flex flex-col border-r h-full last:border-r-0 min-w-[140px] md:min-w-0">
                                <div className={`text-center py-3 border-b text-sm uppercase tracking-wide font-bold ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white shadow-md' : 'bg-muted/30 text-muted-foreground'}`}>
                                    {format(day, 'EEE d')}
                                </div>
                                <div className="flex-1 p-2 space-y-2 bg-slate-50/50 dark:bg-slate-900/20 min-h-[100px]">
                                    {dayLessons.map(lesson => (
                                        <LessonCard key={lesson.id} lesson={lesson} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={handlePrevWeek}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={handleNextWeek}><ChevronRight className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={handleToday}>Today</Button>
                </div>
                <h2 className="text-lg font-semibold capitalize">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="grid gap-4 grid-cols-7 border rounded-lg p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-[600px] overflow-x-auto min-w-[1200px]">
                    {days.map((day) => {
                        const dayLessons = lessons
                            .filter(lesson => isSameDay(new Date(lesson.date), day))
                            .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))

                        return (
                            <DroppableDay key={day.toISOString()} day={day} isToday={isSameDay(day, new Date())}>
                                {dayLessons.map(lesson => (
                                    <DraggableLesson key={lesson.id} lesson={lesson} />
                                ))}
                            </DroppableDay>
                        )
                    })}
                </div>
            </DndContext>
        </div>
    )
}
