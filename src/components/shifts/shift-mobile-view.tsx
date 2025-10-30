'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Patient } from '@/lib/types';
import { 
    GridShiftState, 
    ActiveShiftCard, 
    FilledShiftCard, 
    PendingShiftCard, 
    OpenShiftCard 
} from './shift-management';
import { cn } from '@/lib/utils';

interface ShiftMobileViewProps {
  patients: Patient[];
  days: Date[];
  gridShifts: { [key: string]: (GridShiftState | null)[] };
  handlers: {
    handleOpenProfile: (professional: any) => void;
    handleOpenVacancy: (patient: any, dayKey: string, shiftType: 'diurno' | 'noturno') => void;
    handleOpenCandidacy: (patient: any, dayKey: string, shiftType: 'diurno' | 'noturno') => void;
    setDetailsShift: (details: any) => void;
  };
}

export function ShiftMobileView({ patients, days, gridShifts, handlers }: ShiftMobileViewProps) {

  const renderShift = (shiftState: GridShiftState | null, type: 'diurno' | 'noturno', patient: Patient, dayKey: string) => {
    if (!shiftState) return <OpenShiftCard shiftType={type} onClick={() => handlers.handleOpenVacancy(patient, dayKey, type)} />;
    
    const { shift, professional, status, isUrgent } = shiftState;

    if ((status === 'active' || status === 'issue' || status === 'completed') && professional && shift) {
        return <ActiveShiftCard shift={shift} professional={professional} patient={patient} onClick={() => handlers.setDetailsShift({ shift, professional, patient })} />;
    }
    if (status === 'filled' && professional) {
        return <FilledShiftCard professional={professional} onClick={() => handlers.handleOpenProfile(professional!)} />;
    }
    if (status === 'pending') {
        return <PendingShiftCard onClick={() => handlers.handleOpenCandidacy(patient, dayKey, type)} />;
    }
    
    return <OpenShiftCard shiftType={type} urgent={isUrgent} onClick={() => handlers.handleOpenVacancy(patient, dayKey, type)} />;
  }

  return (
    <div className="space-y-4">
      {days.map(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const dayShiftsForPatients = patients.map(patient => ({
          patient,
          shifts: gridShifts[`${patient.id}-${dayKey}`] || [null, null],
        }));

        const hasShifts = dayShiftsForPatients.some(p => p.shifts[0] || p.shifts[1]);

        if (!hasShifts) return null;

        return (
          <div key={dayKey} className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold text-lg mb-4 capitalize">
              {format(day, "eeee, dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <div className="space-y-4">
              {dayShiftsForPatients.map(({ patient, shifts }) => (
                <div key={patient.id} className="grid grid-cols-[auto_1fr] gap-4 items-start">
                  <div className="flex flex-col items-center pt-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground mt-1 w-12 text-center truncate">{patient.name}</span>
                  </div>
                  <div className="space-y-2">
                    {renderShift(shifts[0], 'diurno', patient, dayKey)}
                    {renderShift(shifts[1], 'noturno', patient, dayKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
