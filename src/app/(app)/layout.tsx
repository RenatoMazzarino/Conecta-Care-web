
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
    return null;
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
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile) {
      setIsCollapsed(false);
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const desktopMarginClass = isCollapsed ? 'sm:ml-16' : 'sm:ml-60';

  return (
    <ClientOnly>
      <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
        <AppHeader onToggleMobileSidebar={() => setIsMobileOpen((open) => !open)} />
        <div className="flex flex-1 overflow-hidden pt-12">
          <AppSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            onMobileClose={() => setIsMobileOpen(false)}
          />
          <main
            className={cn('flex flex-1 flex-col overflow-hidden transition-[margin-left] duration-300', desktopMarginClass)}
          >
            <div className="flex-1 overflow-auto bg-slate-50 px-4 py-4 sm:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ClientOnly>
  );
}
