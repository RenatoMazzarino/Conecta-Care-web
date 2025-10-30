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
import { CheckCircle, XCircle, MapPin, Camera, AlertTriangle, Fingerprint, Router, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export function ShiftAuditDialog({
  isOpen,
  onOpenChange,
  shift,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shift: ActiveShift;
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
             <Avatar className="h-10 w-10">
                <AvatarImage src={shift.professional.avatarUrl} alt={shift.professional.name} data-ai-hint={shift.professional.avatarHint} />
                <AvatarFallback>{shift.professional.initials}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle>Auditoria de Plantão</DialogTitle>
                <DialogDescription>
                    {shift.patientName} - {shift.professional.name} ({shift.shift})
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4 py-4">
            <div className="space-y-6">
                {/* CHECK-IN BLOCK */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CheckCircle className="w-5 h-5 text-green-600"/>
                            Check-in ({shift.checkIn || 'Pendente'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <p className="text-sm text-muted-foreground pb-2">Resumo das validações de segurança no início do plantão.</p>
                        <AuditVerificationItem label="Biometria Facial" status={shift.checkIn ? 'OK' : 'Pendente'} icon={Camera} />
                        <AuditVerificationItem label="Geolocalização" status={shift.checkIn ? 'OK' : 'Pendente'} icon={MapPin} />
                        <AuditVerificationItem label="Data e Hora" status={shift.checkIn ? 'OK' : 'Pendente'} icon={Fingerprint} />
                    </CardContent>
                </Card>

                 {/* BLE VALIDATION BLOCK */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Router className="w-5 h-5 text-blue-600"/>
                            Validação BLE
                        </CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground pb-2">Status das verificações de proximidade durante o plantão.</p>
                        <AuditVerificationItem label="Proximidade do Paciente" status={'OK'} icon={BadgeCheck} />
                        <p className="text-xs text-center text-muted-foreground pt-2">Em breve: Histórico de validações BLE.</p>
                    </CardContent>
                </Card>

                 {/* CHECK-OUT BLOCK */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <XCircle className={cn("w-5 h-5", shift.checkOut ? "text-red-600" : "text-muted-foreground")}/>
                            Check-out ({shift.checkOut || 'Pendente'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground pb-2">Resumo das validações de segurança no final do plantão.</p>
                        <AuditVerificationItem label="Biometria Facial" status={shift.checkOut ? 'OK' : 'Pendente'} icon={Camera} />
                        <AuditVerificationItem label="Geolocalização" status={shift.checkOut ? 'OK' : 'Pendente'} icon={MapPin} />
                        <AuditVerificationItem label="Data e Hora" status={shift.checkOut ? 'OK' : 'Pendente'} icon={Fingerprint} />
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
