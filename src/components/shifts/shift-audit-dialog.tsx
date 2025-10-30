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
import type { Shift, Professional, Patient } from '@/lib/types';
import { Camera, Fingerprint, Router, BadgeCheck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export function ShiftAuditDialog({
  isOpen,
  onOpenChange,
  shift,
  professional,
  patient,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift;
  professional?: Professional;
  patient?: Patient;
}) {

  const AuditVerificationItem = ({ label, status, icon: Icon }: { label: string, status: 'OK' | 'Pendente' | 'Falha', icon: React.ElementType }) => {
    const statusConfig = {
      'OK': { text: 'OK', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
      'Pendente': { text: 'Pendente', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
      'Falha': { text: 'Falha', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    }
    const config = statusConfig[status];

    return (
      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 text-muted-foreground", config.color)} />
          <span>{label}</span>
        </div>
        <Badge variant="outline" className={cn("font-mono text-xs", config.bg, config.color)}>{config.text}</Badge>
      </div>
    )
  };
  
  if (!shift || !professional || !patient) return null;
  
  const checkInStatus = shift.checkInStatus || 'Pendente';
  const checkOutStatus = shift.checkOutStatus || 'Pendente';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
             {professional && (
                <Avatar className="h-10 w-10">
                    <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
                    <AvatarFallback>{professional.initials}</AvatarFallback>
                </Avatar>
             )}
            <div>
                <DialogTitle>Auditoria de Plantão</DialogTitle>
                <DialogDescription>
                    {patient?.name} - {professional?.name} ({shift.shiftType})
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4 py-4 -mx-4 px-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Verificação de Check-in ({shift.checkIn || 'Pendente'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <AuditVerificationItem label="Biometria Facial" status={checkInStatus} icon={Camera} />
                        <AuditVerificationItem label="Geolocalização" status={checkInStatus} icon={MapPin} />
                        <AuditVerificationItem label="Data e Hora" status={checkInStatus} icon={Fingerprint} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Validação BLE
                        </CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground pb-2">Status das verificações de proximidade durante o plantão.</p>
                        <AuditVerificationItem label="Proximidade do Paciente" status={'OK'} icon={BadgeCheck} />
                        <p className="text-xs text-center text-muted-foreground pt-2">Em breve: Histórico de validações BLE.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Verificação de Check-out ({shift.checkOut || 'Pendente'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <AuditVerificationItem label="Biometria Facial" status={checkOutStatus} icon={Camera} />
                        <AuditVerificationItem label="Geolocalização" status={checkOutStatus} icon={MapPin} />
                        <AuditVerificationItem label="Data e Hora" status={checkOutStatus} icon={Fingerprint} />
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
        
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
