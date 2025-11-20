'use client';

import Link from 'next/link';
import { CaretDown, List, MagnifyingGlass } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { logoutAction } from '@/app/logout/actions';

type AppHeaderProps = {
  onToggleMobileSidebar?: () => void;
};

export function AppHeader({ onToggleMobileSidebar }: AppHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-white/10 bg-[#0F2B45] text-white shadow-sm">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-3 px-3 sm:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10 sm:hidden"
          onClick={onToggleMobileSidebar}
        >
          <List weight="bold" className="h-5 w-5" />
          <span className="sr-only">Abrir navegação</span>
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10 text-sm font-semibold leading-none tracking-tight">
            CC
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Conecta Care</p>
            <p className="text-[11px] text-white/70">Enterprise</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative w-[200px] sm:w-[260px] lg:w-[320px]">
            <MagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
              weight="bold"
            />
            <Input
              type="search"
              placeholder="Pesquisar"
              className="h-9 w-full rounded-md border border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/70 backdrop-blur focus-visible:ring-white/60"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-left text-sm font-medium text-white shadow-sm transition hover:bg-white/10">
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarImage src="https://picsum.photos/seed/cc-admin/64/64" alt="Usuário" />
                  <AvatarFallback className="bg-white/10 text-white">CC</AvatarFallback>
                </Avatar>
                <span className="hidden text-xs leading-tight sm:block">
                  <span className="block">Renata</span>
                  <span className="text-[11px] text-white/70">Gestão de Operações</span>
                </span>
                <CaretDown className="hidden h-4 w-4 text-white/70 sm:block" weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={logoutAction}>
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full cursor-pointer text-left">
                    Sair
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
