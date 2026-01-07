'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { generateWordDocument } from '@/utils/docx-generator';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface PrintButtonProps {
    lesson?: any; // We'll pass the full lesson object here
}

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-105 print:hidden flex items-center gap-2 z-50"
            title="Export as PDF (Print)"
        >
            <Download className="w-6 h-6" />
            <span className="font-semibold px-2">Export PDF</span>
        </button>
    )
}

export function HeaderExportButtons({ lesson }: PrintButtonProps) {
    const handleWordExport = async () => {
        if (!lesson) return;
        try {
            const blob = await generateWordDocument(lesson);
            const filename = `${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
            saveAs(blob, filename);
            toast.success("Word document downloaded!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to generate Word document");
        }
    };

    return (
        <div className="flex gap-2 print:hidden">
            <Button onClick={handleWordExport} variant="outline" className="hidden md:flex gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Export Word
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="hidden md:flex gap-2">
                <Download className="w-4 h-4" /> Export PDF
            </Button>
        </div>
    )
}
