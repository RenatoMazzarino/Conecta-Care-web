'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
