
'use client';

import * as React from 'react';
import type { Patient, ShiftType } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
    GridShiftState, 
    ActiveShiftCard, 
    FilledShiftCard, 
    PendingShiftCard, 
    OpenShiftCard 
} from './shift-management';

interface ShiftGridViewProps {
  patients: Patient[];
  days: Date[];
  gridShifts: { [key: string]: (GridShiftState | null)[] };
  handlers: {
    handleOpenProfile: (professional: any) => void;
    handleShiftClick: (shiftState: GridShiftState) => void;
  };
}

export function ShiftGridView({ patients, days, gridShifts, handlers }: ShiftGridViewProps) {
  
  const renderShift = (shiftState: GridShiftState | null, type: ShiftType, patient: Patient, dayKey: string) => {
    if (!shiftState) {
        // This case should ideally not happen with the new logic, but as a fallback:
        const dummyShift: GridShiftState = {
            shift: { id: `${patient.id}-${dayKey}-${type}`, patientId: patient.id, dayKey, shiftType: type, status: 'scheduled' },
            patient: patient,
            status: 'scheduled'
        }
        return <OpenShiftCard shiftType={type} onClick={() => handlers.handleShiftClick(dummyShift)} />;
    }
    
    const { shift, professional, status, isUrgent } = shiftState;

    if (['in_progress', 'cancelled', 'completed'].includes(status) && professional && shift) {
        return <ActiveShiftCard shift={shift} professional={professional} onClick={() => handlers.handleShiftClick(shiftState)} />;
    }
    if (status === 'assigned' && professional) {
        return <FilledShiftCard professional={professional} onClick={() => handlers.handleShiftClick(shiftState)} />;
    }
    if (status === 'published') {
        return <PendingShiftCard onClick={() => handlers.handleShiftClick(shiftState)} />;
    }
    
    return <OpenShiftCard shiftType={type} urgent={isUrgent} onClick={() => handlers.handleShiftClick(shiftState)} />;
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
        <div className="relative">
            <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
                <tr>
                <th scope="col" className="sticky left-0 z-20 w-48 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/50 border-r">
                    Paciente
                </th>
                {days.map(day => (
                    <th key={day.toISOString()} scope="col" className="min-w-[18rem] px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider capitalize">
                     {format(day, "eeee, dd", { locale: ptBR })}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {patients.map((patient) => (
                <tr key={patient.id}>
                    <td className="sticky left-0 z-10 px-6 py-4 whitespace-nowrap bg-card group-hover:bg-accent/50 border-r">
                      <div className="text-sm font-medium text-foreground">{patient.name}</div>
                    </td>
                    {days.map(day => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const dayShifts = gridShifts[`${patient.id}-${dayKey}`] || [null, null];
                    const dayShift = dayShifts[0];
                    const nightShift = dayShifts[1];
                    
                    return (
                        <td key={dayKey} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                            {renderShift(dayShift, 'diurno', patient, dayKey)}
                            {renderShift(nightShift, 'noturno', patient, dayKey)}
                        </div>
                        </td>
                    )
                    })}
                </tr>
                ))}
                 {patients.length === 0 && (
                    <tr>
                        <td colSpan={days.length + 1} className="text-center text-muted-foreground p-12">
                            Nenhum paciente encontrado para os filtros selecionados.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
  );
}

    
