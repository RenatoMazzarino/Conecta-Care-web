'use client';

import Link from 'next/link';
import {
  Home,
  ClipboardList,
  BotMessageSquare,
  PanelLeft,
  HeartPulse,
  LogOut,
  Settings,
  Users,
  LineChart,
  DollarSign,
  CalendarCheck,
  MessageSquareWarning,
  User,
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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { logoutAction } from '@/app/logout/actions';
import { useUser } from '@/firebase';

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


export function AppHeader({ title }: { title: string }) {
  const { user } = useUser();

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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
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

      <div className="flex-1">
        <h1 className="font-semibold text-xl font-headline">{title}</h1>
      </div>

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
           {user && (
              <>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-xs text-muted-foreground">Seu UID de Admin</div>
                  <div className="font-mono text-xs cursor-text" onClick={(e) => e.stopPropagation()}>{user.uid}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
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
                <button type="submit" className="w-full">
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
