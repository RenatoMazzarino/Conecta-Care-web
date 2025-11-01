'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Professional } from '@/lib/types';
import { Star, Shield, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

export function TeamTable({ professionals }: { professionals: Professional[] }) {
  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Profissional</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Especialidade Principal</TableHead>
            <TableHead>Status COREN</TableHead>
            <TableHead>Avaliação</TableHead>
            <TableHead className="text-right w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((prof) => (
            <TableRow key={prof.id} className="group">
              <TableCell>
                <Link
                  href={`/team/${prof.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={prof.avatarUrl} alt={prof.name} data-ai-hint={prof.avatarHint} />
                    <AvatarFallback>{prof.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium group-hover:underline">{prof.name}</span>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{prof.role}</TableCell>
              <TableCell className="text-muted-foreground">{prof.specialties[0]}</TableCell>
              <TableCell>
                 <Badge variant={prof.corenStatus === 'active' ? 'secondary' : 'destructive'} className="py-1 px-2">
                    <Shield className="mr-1 h-3 w-3" />
                    {prof.corenStatus === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium">{prof.rating.toFixed(1)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/team/${prof.id}`}>Ver Perfil Completo</Link></DropdownMenuItem>
                        <DropdownMenuItem>Enviar Mensagem</DropdownMenuItem>
                         <DropdownMenuItem>Ver Escala</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Desativar Profissional</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
