'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Shift, Professional, Patient } from '@/lib/types';
import { Camera, Fingerprint, BadgeCheck, MapPin, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export function ShiftAuditDialog({
  shift,
  professional,
  patient,
}: {
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
    <Accordion type="single" collapsible className="w-full border rounded-lg p-2 bg-card">
      <AccordionItem value="audit" className="border-b-0">
        <AccordionTrigger className="p-2 rounded-md hover:bg-accent/50">
           <div className='flex flex-col items-start'>
                <h4 className="font-semibold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary"/>Auditoria</h4>
                <div className="space-y-1 text-sm text-muted-foreground font-normal text-left mt-2">
                    <div className="flex justify-between"><span>Check-in:</span><span className="font-mono text-green-600 ml-2">{shift.checkIn} (OK)</span></div>
                    <div className="flex justify-between"><span>Check-out:</span><span className="font-mono text-muted-foreground ml-2">{shift.checkOut || 'Pendente'}</span></div>
                </div>
           </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
           <div className="space-y-4 p-2">
              <div>
                  <h5 className="font-semibold text-sm mb-2">Check-in</h5>
                  <div className="space-y-1">
                      <AuditVerificationItem label="Biometria Facial" status={checkInStatus} icon={Camera} />
                      <AuditVerificationItem label="Geolocalização" status={checkInStatus} icon={MapPin} />
                      <AuditVerificationItem label="Data e Hora" status={checkInStatus} icon={Fingerprint} />
                  </div>
              </div>
              <div>
                  <h5 className="font-semibold text-sm mb-2">Validação BLE</h5>
                  <div className="space-y-1">
                      <AuditVerificationItem label="Proximidade do Paciente" status={'OK'} icon={BadgeCheck} />
                  </div>
              </div>
              <div>
                  <h5 className="font-semibold text-sm mb-2">Check-out</h5>
                   <div className="space-y-1">
                      <AuditVerificationItem label="Biometria Facial" status={checkOutStatus} icon={Camera} />
                      <AuditVerificationItem label="Geolocalização" status={checkOutStatus} icon={MapPin} />
                      <AuditVerificationItem label="Data e Hora" status={checkOutStatus} icon={Fingerprint} />
                  </div>
              </div>
           </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
