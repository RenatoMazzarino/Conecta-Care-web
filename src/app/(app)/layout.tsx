
'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BotMessageSquare } from 'lucide-react';


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
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </main>
            </div>
        </div>
        <Toaster />
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Button asChild className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
                        <Link href="/assistant">
                            <BotMessageSquare className="h-7 w-7" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>AI Assistant</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </>
  );
}
