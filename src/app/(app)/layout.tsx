
'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
      <>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={cn(
            "flex flex-col transition-[margin-left] duration-300",
            isCollapsed ? "sm:ml-16" : "sm:ml-64"
            )}>
            {children}
            </div>

            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
                    size="icon"
                >
                    <MessageSquarePlus className="h-7 w-7" />
                    <span className="sr-only">Abrir Chat Interno</span>
                </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                <p>Chat Interno</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
        </div>
        <Toaster />
      </>
  );
}
