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
import { shareLesson } from '@/app/dashboard/actions'
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ShareLessonDialog({
    lessonId,
    lessonTitle
}: {
    lessonId: string
    lessonTitle: string
}) {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await shareLesson(lessonId, email)
            toast.success('Lesson shared successfully!')
            setOpen(false)
            setEmail('')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to share lesson'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-indigo-600">
                    <UserPlus className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share Lesson</DialogTitle>
                    <DialogDescription>
                        Invite a collaborator to edit &quot;{lessonTitle}&quot;.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Collaborator Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="colleague@school.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Invite
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
