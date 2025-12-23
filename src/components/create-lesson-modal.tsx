'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createLesson } from '@/app/dashboard/actions'

export function CreateLessonModal({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        try {
            await createLesson(formData)
            setOpen(false)
        } catch (e) {
            console.error(e)
            // Check if it's an auth error or other
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] backdrop-blur-md bg-white/95 dark:bg-gray-900/95 shadow-xl border-t border-white/20">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Lesson Plan</DialogTitle>
                        <DialogDescription>
                            Add basics here. Power up with AI later.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="title" className="sm:text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Intro to Algebra"
                                className="sm:col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="grade" className="sm:text-right">
                                Grade
                            </Label>
                            <div className="sm:col-span-3">
                                <Input name="grade" placeholder="e.g. 5th Grade" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="duration" className="sm:text-right">
                                Duration
                            </Label>
                            <Select name="duration" defaultValue="45">
                                <SelectTrigger className="sm:col-span-3">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 mins</SelectItem>
                                    <SelectItem value="45">45 mins</SelectItem>
                                    <SelectItem value="60">60 mins</SelectItem>
                                    <SelectItem value="90">90 mins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="date" className="sm:text-right">
                                Date
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                className="sm:col-span-3"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="startTime" className="sm:text-right">
                                Time
                            </Label>
                            <Input
                                id="startTime"
                                name="startTime"
                                type="time"
                                className="sm:col-span-3"
                                defaultValue="09:00"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Lesson'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
