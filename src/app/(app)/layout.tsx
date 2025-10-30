'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn(
        "flex flex-col transition-[margin-left] duration-300",
        isCollapsed ? "sm:ml-16" : "sm:ml-64"
      )}>
        {children}
      </div>
    </div>
  );
}
