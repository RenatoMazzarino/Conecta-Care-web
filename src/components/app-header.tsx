'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BotMessageSquare,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  HeartPulse,
  Home,
  LineChart,
  LogOut,
  MessageSquareWarning,
  PanelLeft,
  Search,
  Settings,
  User,
  Users,
  Package,
  AlertCircle,
  CheckSquare,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { logoutAction } from '@/app/logout/actions';
import { Input } from './ui/input';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { mockNotifications } from '@/lib/data';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
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
  { href: '/tasks', label: 'Tarefas', icon: CheckSquare },
];

const secondaryNavItems = [
  { href: '/inventory', label: 'Estoque', icon: ClipboardList },
  { href: '/financial', label: 'Financeiro', icon: DollarSign },
  { href: '/reports', 'label': 'Relatórios', icon: LineChart },
  { href: '/assistant', label: 'AI Assistant', icon: BotMessageSquare },
];

const iconMap: { [key in Notification['type']]: { icon: React.ElementType, color: string } } = {
    supply: { icon: Package, color: 'text-blue-500' },
    alert: { icon: AlertCircle, color: 'text-red-500' },
    info: { icon: Bell, color: 'text-gray-500' },
};

function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays === 1) return 'Ontem';
    return `${diffInDays}d atrás`;
}


export function AppHeader() {
  const pathname = usePathname();

  const renderNavItem = (item: any) => {
    if (item.subItems) {
      return (
         <Collapsible key={item.id}>
            <CollapsibleTrigger className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground w-full">
              <item.icon className="h-5 w-5" />
              {item.label}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-10 mt-2 space-y-4">
              {item.subItems.map((sub: any) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <sub.icon className="h-5 w-5" />
                  {sub.label}
                </Link>
              ))}
            </CollapsibleContent>
         </Collapsible>
      )
    }

    return (
       <Link
          href={item.href}
          key={item.href}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
    )
  }


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <HeartPulse className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">CareSync Home</span>
            </Link>
            {navItems.map(renderNavItem)}
            <hr className="my-2" />
            {secondaryNavItems.map(renderNavItem)}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquisar..."
          className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

       <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link href="/assistant">
                <BotMessageSquare className="h-5 w-5" />
                <span className="sr-only">AI Assistant</span>
            </Link>
        </Button>

       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative overflow-hidden rounded-full">
                {mockNotifications.length > 0 && <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />}
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notificações</span>
                <Badge variant="secondary">{mockNotifications.length}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
            {mockNotifications.map(notif => {
                const Icon = iconMap[notif.type].icon;
                const color = iconMap[notif.type].color;
                return (
                    <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-2 cursor-pointer">
                        <Icon className={cn("h-5 w-5 mt-1 flex-shrink-0", color)} />
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-tight whitespace-normal">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(notif.timestamp)}</p>
                        </div>
                    </DropdownMenuItem>
                )
            })}
            </div>
            <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
                <Link href="/communications" className="justify-center cursor-pointer">
                    Ver todas as comunicações
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="https://picsum.photos/seed/nurse/36/36"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
              data-ai-hint="nurse avatar"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={logoutAction}>
            <DropdownMenuItem asChild>
                <button type="submit" className="w-full cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
