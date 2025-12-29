'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface HelpBubbleProps {
    content: string;
    children?: React.ReactNode;
}

export function HelpBubble({ content, children }: HelpBubbleProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children || <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />}
            </TooltipTrigger>
            <TooltipContent>
                <p className="max-w-xs">{content}</p>
            </TooltipContent>
        </Tooltip>
    )
}
