'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardList,
  BotMessageSquare,
  Users,
  LineChart,
  DollarSign,
  CalendarCheck,
  MessageSquareWarning,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  HeartPulse,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/shifts', label: 'Plantões', icon: CalendarCheck },
  { 
    id: 'pessoas',
    label: 'Pessoas', 
    icon: Users,
    subItems: [
      { href: '/patients', label: 'Pacientes', icon: User },
      { href: '/team', label: 'Equipe', icon: HeartPulse }
    ]
  },
  { href: '/communications', label: 'Comunicações', icon: MessageSquareWarning },
];

const secondaryNavItems = [
  { href: '/inventory', label: 'Estoque', icon: ClipboardList },
  { href: '/financial', label: 'Financeiro', icon: DollarSign },
  { href: '/reports', 'label': 'Relatórios', icon: LineChart },
  { href: '/assistant', label: 'AI Assistant', icon: BotMessageSquare },
];

export function AppSidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (isCollapsed: boolean) => void }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
   React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isMobile, setIsCollapsed]);

  const renderNavItem = (item: any) => {
    const isActive = item.href === pathname;

    if (item.subItems) {
      const isChildActive = item.subItems.some((sub: any) => sub.href === pathname);
      return (
        <Collapsible key={item.id} defaultOpen={isChildActive}>
          <Tooltip>
            <TooltipTrigger asChild>
               <CollapsibleTrigger className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent w-full',
                  isChildActive && 'text-primary',
                   isCollapsed && 'justify-center'
                )}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className={cn('whitespace-nowrap transition-opacity', isCollapsed && 'w-0 opacity-0')}>{item.label}</span>
                  {!isCollapsed && <ChevronDown className="h-4 w-4 ml-auto transition-transform [&[data-state=open]]:rotate-180" />}
              </CollapsibleTrigger>
            </TooltipTrigger>
             {isCollapsed && (
                <TooltipContent side="right" align="center">
                    {item.label}
                </TooltipContent>
            )}
          </Tooltip>
           <CollapsibleContent className={cn("pl-7 pr-2 space-y-1", isCollapsed && "hidden")}>
              {item.subItems.map((subItem: any) => {
                 const isSubItemActive = subItem.href === pathname;
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent',
                        isSubItemActive && 'bg-accent text-primary',
                    )}
                    >
                    <subItem.icon className="h-4 w-4 shrink-0" />
                    <span>{subItem.label}</span>
                </Link>
                )
              })}
           </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
       <Tooltip key={item.href}>
          <TooltipTrigger asChild>
               <Link
                  href={item.href}
                  className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent',
                      isActive && 'bg-accent text-primary',
                      isCollapsed && 'justify-center'
                  )}
                  >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className={cn('whitespace-nowrap transition-opacity', isCollapsed && 'w-0 opacity-0')}>{item.label}</span>
              </Link>
          </TooltipTrigger>
          {isCollapsed && (
              <TooltipContent side="right" align="center">
                  {item.label}
              </TooltipContent>
          )}
       </Tooltip>
    );
  }

  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-card sm:flex transition-[width] duration-300",
        isCollapsed ? "w-16" : "w-64"
    )}>
       <TooltipProvider delayDuration={0}>
      <div className="flex h-full max-h-screen flex-col">
        <div className={cn(
            "flex h-16 items-center border-b px-6",
            isCollapsed && "justify-center px-2"
        )}>
          <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-primary">
            <HeartPulse className="h-6 w-6" />
            <span className={cn("transition-opacity", isCollapsed && "w-0 opacity-0")}>CareSync</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 text-sm font-medium">
          <ul className="flex flex-col gap-1">
            {navItems.map(item => <li key={item.id || item.href}>{renderNavItem(item)}</li>)}
          </ul>
           <hr className="my-4" />
           <ul className="flex flex-col gap-1">
            {secondaryNavItems.map(item => <li key={item.id || item.href}>{renderNavItem(item)}</li>)}
          </ul>
        </nav>
        <div className={cn("mt-auto p-4 border-t", isCollapsed && "p-2")}>
          <Tooltip>
            <TooltipTrigger asChild>
                 <Button onClick={() => setIsCollapsed(!isCollapsed)} variant="ghost" className="w-full justify-center">
                    {isCollapsed ? <ChevronRight className="h-5 w-5"/> : <ChevronLeft className="h-5 w-5" />}
                    <span className="sr-only">{isCollapsed ? 'Expandir' : 'Recolher'}</span>
                </Button>
            </TooltipTrigger>
             {isCollapsed && (
                <TooltipContent side="right" align="center">
                    {isCollapsed ? 'Expandir' : 'Recolher'}
                </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
      </TooltipProvider>
    </aside>
  );
}