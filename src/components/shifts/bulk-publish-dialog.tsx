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
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import type { OpenShiftInfo, Patient } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function BulkPublishDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined, to: Date | undefined }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  const handleSearchShifts = () => {
    toast({
      title: 'Buscando Plantões',
      description: 'Buscando por vagas em aberto no período selecionado...',
    });
    // In the next step, we will implement the logic to show the found shifts
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
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
                                "w-full justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                                    {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                                </>
                                ) : (
                                format(dateRange.from, "LLL dd, y", { locale: ptBR })
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
                <Button onClick={handleSearchShifts}>
                    <Search className="mr-2 h-4 w-4"/>
                    Buscar Vagas Abertas
                </Button>
            </div>

            <div className="min-h-[300px] flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center">
                <h3 className="text-lg font-semibold">Aguardando busca</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Selecione um período e clique em "Buscar Vagas Abertas" para listar os plantões.
                </p>
            </div>
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled>Publicar Selecionados (0)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    