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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Search, Check, CircleDashed } from 'lucide-react';
import type { OpenShiftInfo, Patient } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { patients as mockPatients } from '@/lib/data';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

// Mock data simulation - in a real app, this would be a query
const mockOpenShifts = [
    { patient: mockPatients[1], dayKey: '2024-10-09', shiftType: 'diurno' as const },
    { patient: mockPatients[0], dayKey: '2024-10-10', shiftType: 'diurno' as const },
    { patient: mockPatients[0], dayKey: '2024-10-10', shiftType: 'noturno' as const },
    { patient: mockPatients[2], dayKey: '2024-10-11', shiftType: 'diurno' as const },
    { patient: mockPatients[1], dayKey: '2024-10-12', shiftType: 'noturno' as const },
];

export function BulkPublishDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined, to: Date | undefined }>({
    from: new Date(new Date().setHours(0,0,0,0)),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  const [foundShifts, setFoundShifts] = React.useState<OpenShiftInfo[]>([]);
  const [selectedShifts, setSelectedShifts] = React.useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearchShifts = () => {
    setIsSearching(true);
    toast({
      title: 'Buscando Plantões',
      description: 'Buscando por vagas em aberto no período selecionado...',
    });
    
    // Simulate API call
    setTimeout(() => {
        const filtered = mockOpenShifts.filter(shift => {
            const shiftDate = new Date(shift.dayKey);
            return shiftDate >= (dateRange.from || new Date()) && shiftDate <= (dateRange.to || new Date());
        });
        setFoundShifts(filtered);
        setIsSearching(false);
    }, 1000);
  }

  const handleToggleSelect = (shiftKey: string) => {
    setSelectedShifts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shiftKey)) {
        newSet.delete(shiftKey);
      } else {
        newSet.add(shiftKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedShifts.size === foundShifts.length) {
      setSelectedShifts(new Set());
    } else {
      setSelectedShifts(new Set(foundShifts.map(s => `${s.patient.id}-${s.dayKey}-${s.shiftType}`)));
    }
  };
  
  const handlePublish = () => {
    toast({
        title: `${selectedShifts.size} Vagas Publicadas!`,
        description: `As vagas selecionadas agora estão visíveis para os profissionais.`
    });
    onOpenChange(false);
  }
  
  React.useEffect(() => {
    // Reset state when dialog is closed
    if (!isOpen) {
        setFoundShifts([]);
        setSelectedShifts(new Set());
    }
  }, [isOpen]);

  const renderShiftList = () => {
    if (isSearching) {
        return (
             <div className="min-h-[300px] flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground animate-pulse mb-4" />
                <h3 className="text-lg font-semibold">Buscando...</h3>
            </div>
        );
    }

    if (foundShifts.length > 0) {
        return (
            <div className="border rounded-md">
                 <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
                    <div className="flex items-center gap-3">
                        <Checkbox 
                            id="select-all"
                            checked={selectedShifts.size > 0 && selectedShifts.size === foundShifts.length}
                            onCheckedChange={handleSelectAll}
                        />
                        <Label htmlFor="select-all" className="font-semibold">
                            {foundShifts.length} vagas encontradas
                        </Label>
                    </div>
                 </div>
                <ScrollArea className="h-72">
                    <div className="p-2 space-y-2">
                    {foundShifts.map(shift => {
                        const shiftKey = `${shift.patient.id}-${shift.dayKey}-${shift.shiftType}`;
                        const isSelected = selectedShifts.has(shiftKey);
                        const formattedDate = new Date(shift.dayKey).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long'});
                        return (
                            <div key={shiftKey} 
                                onClick={() => handleToggleSelect(shiftKey)}
                                className={cn("flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors", isSelected ? 'bg-primary/10 border-primary' : 'bg-card hover:bg-accent/50')}>
                                <Checkbox checked={isSelected} />
                                <div className="flex-1">
                                    <p className="font-semibold">{shift.patient.name}</p>
                                    <p className="text-sm text-muted-foreground">{formattedDate} - Plantão {shift.shiftType}</p>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </ScrollArea>
            </div>
        )
    }

    return (
        <div className="min-h-[300px] flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center">
            <CircleDashed className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Aguardando busca</h3>
            <p className="text-sm text-muted-foreground mt-2">
                Selecione um período e clique em "Buscar Vagas Abertas" para listar os plantões.
            </p>
        </div>
    );
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publicação de Vagas em Massa</DialogTitle>
          <DialogDescription>
            Selecione um período para encontrar e publicar todas as vagas em aberto de uma só vez.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            <div className="flex items-end gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="grid gap-2 flex-1">
                    <Label>Período</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal bg-card",
                                !dateRange.from && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                <>
                                    {format(dateRange.from, "d 'de' LLL, y", { locale: ptBR })} -{" "}
                                    {format(dateRange.to, "d 'de' LLL, y", { locale: ptBR })}
                                </>
                                ) : (
                                format(dateRange.from, "d 'de' LLL, y", { locale: ptBR })
                                )
                            ) : (
                                <span>Escolha um período</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={(range) => range && setDateRange({ from: range.from, to: range.to })}
                            numberOfMonths={2}
                            locale={ptBR}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={handleSearchShifts} disabled={isSearching || !dateRange.from || !dateRange.to}>
                    <Search className="mr-2 h-4 w-4"/>
                    {isSearching ? 'Buscando...' : 'Buscar Vagas'}
                </Button>
            </div>

            {renderShiftList()}
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handlePublish} disabled={selectedShifts.size === 0}>
             <Check className="mr-2 h-4 w-4"/>
            Publicar Selecionados ({selectedShifts.size})
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
