'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  ChatCircleDots,
  ChartLineUp,
  ClipboardText,
  CurrencyDollar,
  Heartbeat,
  ListChecks,
  SquaresFour,
  Users,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; weight?: any; className?: string }>;
};

type AppSidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

const primaryNav: NavItem[] = [
  { href: '/dashboard', label: 'Início', icon: SquaresFour },
  { href: '/shifts', label: 'Plantões', icon: CalendarBlank },
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/team', label: 'Equipe', icon: Heartbeat },
  { href: '/communications', label: 'Comunicações', icon: ChatCircleDots },
  { href: '/tasks', label: 'Tarefas', icon: ListChecks },
];

const secondaryNav: NavItem[] = [
  { href: '/inventory', label: 'Estoque', icon: ClipboardText },
  { href: '/financial', label: 'Financeiro', icon: CurrencyDollar },
  { href: '/reports', label: 'Relatórios', icon: ChartLineUp },
];

export function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const pathname = usePathname();
  const isMobileView = useIsMobile();
  const isDesktop = !isMobileView;

  const widthClass = isMobileView ? 'w-64' : isCollapsed ? 'w-16' : 'w-60';
  const hiddenOnMobile = isMobileView && !isMobileOpen;

  const handleCollapseClick = () => {
    if (isMobileView) {
      onMobileClose();
      return;
    }
    setIsCollapsed(!isCollapsed);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = pathname?.startsWith(item.href);
    const link = (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        onClick={isMobileView ? onMobileClose : undefined}
        className={cn(
          'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900',
          isActive && 'bg-slate-100 text-slate-900 ring-1 ring-slate-200',
          isCollapsed && isDesktop && 'justify-center px-0'
        )}
      >
        <Icon size={20} weight={isActive ? 'fill' : 'regular'} className="flex-shrink-0 text-slate-700" />
        <span
          className={cn(
            'truncate',
            isCollapsed && isDesktop && 'sr-only'
          )}
        >
          {item.label}
        </span>
      </Link>
    );

    if (isCollapsed && isDesktop) {
      return (
        <Tooltip key={item.href} delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-sm">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <>
      {isMobileView && isMobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[1px]" onClick={onMobileClose} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-12 z-40 h-[calc(100vh-3rem)] flex-col border-r border-slate-200 bg-white transition-all duration-300',
          isMobileView ? 'flex' : 'hidden sm:flex',
          widthClass,
          hiddenOnMobile ? '-translate-x-full' : 'translate-x-0',
          !isDesktop && 'shadow-fluent'
        )}
      >
        <TooltipProvider delayDuration={0}>
          <div className="flex items-center border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            {!isCollapsed || !isDesktop ? 'Navegação' : ''}
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-1">{primaryNav.map(renderNavItem)}</div>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <p
                className={cn(
                  'px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500',
                  isCollapsed && isDesktop && 'sr-only'
                )}
              >
                Operação
              </p>
              <div className="space-y-1">{secondaryNav.map(renderNavItem)}</div>
            </div>
          </nav>
          <div className="border-t border-slate-200 p-3">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                isCollapsed && isDesktop && 'justify-center px-2'
              )}
              onClick={handleCollapseClick}
            >
              {isCollapsed && isDesktop ? (
                <CaretRight className="h-5 w-5" weight="bold" />
              ) : (
                <>
                  <span>Recolher</span>
                  <CaretLeft className="h-5 w-5" weight="bold" />
                </>
              )}
            </Button>
          </div>
        </TooltipProvider>
      </aside>
    </>
  );
}
