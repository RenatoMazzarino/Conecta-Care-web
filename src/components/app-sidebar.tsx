'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardList,
  BotMessageSquare,
  Settings,
  HeartPulse,
  Users,
  Calendar,
  LineChart,
  DollarSign,
  FileText,
  CalendarCheck,
  MessageSquare,
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
  { href: '/schedule', label: 'Agenda', icon: Calendar },
  { href: '/shifts', label: 'Plantões', icon: CalendarCheck },
  { href: '/inventory', label: 'Estoque', icon: ClipboardList },
  { href: '/communications', label: 'Comunicações', icon: MessageSquare },
  { href: '/team', label: 'Equipe', icon: Users },
  { href: '/financial', label: 'Financeiro', icon: DollarSign },
  { href: '/reports', 'label': 'Relatórios', icon: LineChart },
  { href: '/assistant', label: 'AI Assistant', icon: BotMessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-card sm:flex">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-primary">
            <HeartPulse className="h-6 w-6" />
            <span className="">CareSync Home</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-2 px-4 text-sm font-medium">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                    pathname === item.href && 'bg-accent text-primary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto p-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings coming soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
