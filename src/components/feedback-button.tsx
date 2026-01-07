'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner';

export function FeedbackButton({ userEmail }: { userEmail?: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('General Feedback');

    const handleSubmit = async () => {
        if (!message) return;
        setLoading(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                body: JSON.stringify({ message, email: userEmail, type }),
            });

            if (res.ok) {
                setOpen(false);
                setMessage('');
                toast.success("Feedback sent! Thank you for helping us improve.");
            }
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="fixed bottom-4 right-4 shadow-lg rounded-full h-10 px-4 bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 text-indigo-600 hover:bg-indigo-50 z-50 flex items-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    Feedback
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Feedback</DialogTitle>
                    <DialogDescription>
                        Found a bug? Have a feature idea? Let us know directly.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General Feedback">General Feedback</SelectItem>
                                <SelectItem value="Bug Report">Bug Report</SelectItem>
                                <SelectItem value="Feature Request">Feature Request</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you think..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading || !message} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Feedback'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
