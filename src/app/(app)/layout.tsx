
'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';

// Componente para garantir renderização apenas no cliente
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Ou um componente de loading/skeleton
  }

  return <>{children}</>;
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
      <ClientOnly>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={cn(
            "flex flex-col transition-[margin-left] duration-300",
            isMobile ? "sm:ml-0" : isCollapsed ? "sm:ml-16" : "sm:ml-64"
            )}>
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </main>
            </div>
        </div>
        <Toaster />
      </ClientOnly>
  );
}
