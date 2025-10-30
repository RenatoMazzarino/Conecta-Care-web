'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ActiveShift } from '@/lib/types';
import { CheckCircle, XCircle, MapPin, Camera, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export function ShiftAuditDialog({
  isOpen,
  onOpenChange,
  shift,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shift: ActiveShift;
}) {

  const checkInStatus = {
      time: shift.checkIn,
      verified: !!shift.checkIn,
      late: shift.status === 'Atrasado' && !shift.checkOut
  }

  const checkOutStatus = {
      time: shift.checkOut,
      verified: !!shift.checkOut
  }

  const AuditItem = ({ icon: Icon, title, status, details, variant = 'default' }: { icon: React.ElementType, title: string, status: string, details: string, variant?: 'default' | 'success' | 'warning' | 'error' }) => {
    const colors = {
        default: 'text-muted-foreground',
        success: 'text-green-600',
        warning: 'text-amber-600',
        error: 'text-red-600',
    }
    return (
         <div className={cn("flex items-start gap-4 p-4 rounded-lg", variant === 'success' ? 'bg-green-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-muted/50')}>
            <Icon className={cn("h-6 w-6 mt-1 flex-shrink-0", colors[variant])} />
            <div className="flex-1">
                <p className="font-semibold">{title}</p>
                <p className={cn("text-lg font-bold", colors[variant])}>{status}</p>
                <p className="text-xs text-muted-foreground">{details}</p>
            </div>
        </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
             <Avatar className="h-10 w-10">
                <AvatarImage src={shift.professional.avatarUrl} alt={shift.professional.name} data-ai-hint={shift.professional.avatarHint} />
                <AvatarFallback>{shift.professional.initials}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle>Auditoria de Plantão</DialogTitle>
                <DialogDescription>
                    {shift.patientName} - {shift.professional.name}
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            <AuditItem
                icon={CheckCircle}
                title="Check-in"
                status={checkInStatus.time ? `${checkInStatus.time}` : "Pendente"}
                details={checkInStatus.late ? "Check-in realizado com atraso." : "Horário de início do plantão."}
                variant={checkInStatus.verified ? (checkInStatus.late ? 'warning' : 'success') : 'default'}
            />
            <AuditItem
                icon={XCircle}
                title="Check-out"
                status={checkOutStatus.time || "Pendente"}
                details="Horário de término do plantão."
                variant={checkOutStatus.verified ? 'error' : 'default'}
            />

             <div className="border-t pt-4 space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Verificações de Segurança (Em Breve)</h3>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground"/>
                        <span>Verificação de Localização</span>
                    </div>
                    <Badge variant="outline">Não Verificado</Badge>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
                    <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground"/>
                        <span>Reconhecimento Facial</span>
                    </div>
                    <Badge variant="outline">Não Verificado</Badge>
                </div>
            </div>
        </div>
        
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
