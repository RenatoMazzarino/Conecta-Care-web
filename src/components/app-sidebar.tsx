'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardList,
  BotMessageSquare,
  Settings,
  HeartPulse,
  Users,
  LineChart,
  DollarSign,
  CalendarCheck,
  MessageSquareWarning,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/shifts', label: 'Plantões', icon: CalendarCheck },
  { href: '/inventory', label: 'Estoque', icon: ClipboardList },
  { href: '/communications', label: 'Comunicações', icon: MessageSquareWarning },
  { href: '/team', label: 'Equipe', icon: Users },
  { href: '/financial', label: 'Financeiro', icon: DollarSign },
  { href: '/reports', 'label': 'Relatórios', icon: LineChart },
  { href: '/assistant', label: 'AI Assistant', icon: BotMessageSquare },
];

export function AppSidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (isCollapsed: boolean) => void }) {
  const pathname = usePathname();
  
  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-card sm:flex transition-[width] duration-300",
        isCollapsed ? "w-16" : "w-64"
    )}>
       <TooltipProvider delayDuration={0}>
      <div className="flex h-full max-h-screen flex-col">
        <div className={cn(
            "flex h-16 items-center border-b px-6",
            isCollapsed && "px-0 justify-center"
        )}>
          <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-primary">
            <HeartPulse className="h-6 w-6" />
            <span className={cn("transition-opacity", isCollapsed && "opacity-0 w-0")}>CareSync</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-2 px-4 text-sm font-medium">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                 <Tooltip>
                    <TooltipTrigger asChild>
                         <Link
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent',
                                pathname === item.href && 'bg-accent text-primary',
                                isCollapsed && 'justify-center'
                            )}
                            >
                            <item.icon className="h-5 w-5" />
                            <span className={cn('whitespace-nowrap transition-opacity', isCollapsed && 'opacity-0 w-0')}>{item.label}</span>
                        </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                        <TooltipContent side="right" align="center">
                            {item.label}
                        </TooltipContent>
                    )}
                 </Tooltip>
              </li>
            ))}
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
                    Expandir
                </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
      </TooltipProvider>
    </aside>
  );
}
