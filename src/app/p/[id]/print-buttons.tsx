'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-105 print:hidden flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            <span className="font-semibold px-2">Export PDF</span>
        </button>
    )
}

export function HeaderPrintButton() {
    return (
        <Button onClick={() => window.print()} className="hidden md:flex gap-2 print:hidden" variant="outline">
            <Download className="w-4 h-4" /> Download PDF
        </Button>
    )
}
