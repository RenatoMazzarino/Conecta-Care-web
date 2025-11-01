
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, CheckCircle, FileUp, ChevronsLeft, ChevronsRight, CircleHelp, AlertTriangle, ListFilter } from 'lucide-react';
import type { Professional, Shift, OpenShiftInfo, Patient } from '@/lib/types';
import { ProfessionalProfileDialog } from './professional-profile-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { BulkPublishDialog } from './bulk-publish-dialog';
import { CandidacyListDialog } from './candidacy-list-dialog';
import { addDays, format, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShiftDetailsDialog } from './shift-details-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShiftMobileView } from './shift-mobile-view';
import { ShiftGridView } from './shift-grid-view';
import { patients as mockPatients, professionals as mockProfessionals, initialShifts } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';


type ViewPeriod = 'weekly' | 'biweekly' | 'monthly';
type StatusFilter = 'all' | 'open' | 'pending' | 'filled';

const periodConfig = {
  weekly: 7,
  biweekly: 15,
  monthly: 30,
};

export function ShiftManagement() {
  const { toast } = useToast();
  const adminFeaturesEnabled = true;

  const [allPatients, setAllPatients] = React.useState<Patient[]>([]);
  const [shiftsData, setShiftsData] = React.useState<Shift[]>([]);
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAllPatients(mockPatients);
      setShiftsData(initialShifts);
      setProfessionals(mockProfessionals);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null);
  const [isCandidacyListOpen, setIsCandidacyListOpen] = React.useState(false);
  const [isBulkPublishing, setIsBulkPublishing] = React.useState(false);
  const [detailsShift, setDetailsShift] = React.useState<{shift: Shift, professional?: Professional, patient: Patient} | null>(null);
  
  const [currentDate, setCurrentDate] = React.useState(() => {
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    return startOfWeek(utcDate, { weekStartsOn: 0 }); // Sunday
  });
  
  const [viewPeriod, setViewPeriod] = React.useState<ViewPeriod>('weekly');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>([]);

  const isMobile = useIsMobile();
  const numDays = isMobile ? 3 : periodConfig[viewPeriod];

  const displayedDays = React.useMemo(() =>
    Array.from({ length: numDays }, (_, i) => addDays(currentDate, i)),
    [currentDate, numDays]
  );

  const gridShifts = React.useMemo(() => {
    const grid: { [key: string]: (GridShiftState | null)[] } = {};
    if (!allPatients || !shiftsData) return grid;

    allPatients.forEach(patient => {
      displayedDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        
        const getGridState = (shiftType: 'diurno' | 'noturno'): GridShiftState | null => {
          let shift = shiftsData.find(s => s.patientId === patient.id && s.dayKey === dayKey && s.shiftType === shiftType);
          
          if (!shift) {
              const id = `${patient.id}-${dayKey}-${shiftType}`;
              shift = { id, patientId: patient.id, dayKey, shiftType, status: 'open' };
          }
          
          const professional = professionals?.find(p => p.id === shift?.professionalId);

          return {
            shift,
            professional,
            patient,
            status: shift.status,
            isUrgent: shift.isUrgent
          };
        };

        grid[`${patient.id}-${dayKey}`] = [getGridState('diurno'), getGridState('noturno')];
      });
    });
    return grid;
  }, [shiftsData, allPatients, professionals, displayedDays]);

  const stats = React.useMemo(() => {
    let openCount = 0;
    let pendingCount = 0;
    let filledCount = 0;

    Object.values(gridShifts).flat().forEach(shiftState => {
      if (!shiftState) return;
      const { status } = shiftState.shift;
      if (status === 'open') openCount++;
      if (status === 'pending') pendingCount++;
      if (['filled', 'active', 'completed', 'issue'].includes(status)) filledCount++;
    });

    return { open: openCount, pending: pendingCount, filled: filledCount };
  }, [gridShifts]);


   React.useEffect(() => {
    if (!allPatients) {
        setFilteredPatients([]);
        return;
    }
    if (statusFilter === 'all') {
      setFilteredPatients(allPatients);
      return;
    }
    
    const patientIdsWithStatus = new Set<string>();
    const filledStatuses: GridShiftState['status'][] = ['filled', 'active', 'completed', 'issue'];

    Object.values(gridShifts).flat().forEach(shiftState => {
      if (!shiftState) return;
      const { shift } = shiftState;
      const match = (statusFilter === 'filled' && filledStatuses.includes(shift.status)) || shift.status === statusFilter;

      if (match) {
        patientIdsWithStatus.add(shift.patientId);
      }
    });

    setFilteredPatients(allPatients.filter(p => patientIdsWithStatus.has(p.id)));

  }, [statusFilter, gridShifts, allPatients]);


  const handleDateChange = (days: number) => {
    setCurrentDate(prev => addDays(prev, days));
  };


  const handleOpenProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
  };

  const handleCloseProfile = () => {
    setSelectedProfessional(null);
  };
  
  const handleShiftClick = (shiftState: GridShiftState) => {
    setDetailsShift({
      shift: shiftState.shift,
      professional: shiftState.professional,
      patient: shiftState.patient,
    });
  }

  const handlePublishFromScratch = () => {
    // This will open the details dialog in "create new shift" mode
    const dummyShift: Shift = {
        id: `new-shift-${Date.now()}`,
        patientId: '',
        dayKey: format(new Date(), 'yyyy-MM-dd'),
        shiftType: 'diurno',
        status: 'open',
    };
     setDetailsShift({
      shift: dummyShift,
      patient: {} as Patient, // A blank patient, the user will select one in the modal
      professional: undefined
    });
  }
  
  const handleApproveProfessional = (professional: Professional, shift: Shift) => {
    if (shift) {
        setShiftsData(prevShifts => {
            const existingShift = prevShifts.find(s => s.id === shift.id);
            if (existingShift) {
                return prevShifts.map(s => s.id === shift.id ? { ...s, professionalId: professional.id, status: 'filled' } : s);
            }
            // If shift doesn't exist (e.g. was 'open' and thus virtual), add it
            return [...prevShifts, { ...shift, professionalId: professional.id, status: 'filled' }];
        });

        toast({
            title: 'Profissional Aprovado!',
            description: `${professional.name} foi alocado para o plantão.`,
        });

        setIsCandidacyListOpen(false);
        setDetailsShift(null); // Close the main dialog
        handleCloseProfile();
    }
  };

  const StatCard = ({ title, value, icon: Icon, className, isActive, onClick }: { title: string, value: string | number, icon: React.ElementType, className?: string, isActive?: boolean, onClick?: () => void }) => (
    <Card onClick={onClick} className={cn("hover:shadow-md transition-shadow", onClick && "cursor-pointer", isActive && "ring-2 ring-primary")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={cn("h-5 w-5 text-muted-foreground", className)} />
        </CardHeader>
        <CardContent>
            <div className={cn("text-2xl font-bold", className)}>{value}</div>
        </CardContent>
    </Card>
  );

  const StatProgressCard = ({ title, value, total }: { title: string; value: number; total: number; }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{percentage}%</div>
                <p className="text-xs text-muted-foreground">
                    {value} de {total} vagas preenchidas
                </p>
                <Progress value={percentage} className="mt-2 h-2" />
            </CardContent>
        </Card>
    );
};
  
 const getPeriodLabel = () => {
    if (!displayedDays.length) return '';
    const start = displayedDays[0];
    const end = displayedDays[displayedDays.length - 1];
    const startFormat = 'd \'de\' LLL';
    const endFormat = 'd \'de\' LLL, yyyy';

    if (start.getUTCFullYear() !== end.getUTCFullYear()) {
      return `${format(start, 'd MMM, yy', { locale: ptBR })} - ${format(end, 'd MMM, yy', { locale: ptBR })}`;
    }
    if (start.getUTCMonth() !== end.getUTCMonth()) {
      return `${format(start, startFormat, { locale: ptBR })} - ${format(end, endFormat, { locale: ptBR })}`;
    }
    return `${format(start, 'd')} - ${format(end, endFormat, { locale: ptBR })}`;
  }

  const totalShifts = stats.open + stats.pending + stats.filled;

  const viewHandlers = {
      handleOpenProfile,
      handleShiftClick,
  };
  
  if (isLoading || isMobile === undefined) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
            <Skeleton className="h-[60vh] w-full" />
        </div>
    )
  }

  if (!adminFeaturesEnabled) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Gestão de plantões indisponível</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Sua conta não possui permissão para acessar o módulo administrativo de plantões.</p>
          <p>
            Solicite a um administrador que habilite o recurso definindo{' '}
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs font-semibold">
              NEXT_PUBLIC_ENABLE_ADMIN_FEATURES=1
            </code>{' '}
            no ambiente ou utilize um usuário com privilégios administrativos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-2">
           {!isMobile && (
              <>
                <Button variant={viewPeriod === 'weekly' ? 'default' : 'outline'} size="sm" onClick={() => setViewPeriod('weekly')}>Semanal</Button>
                <Button variant={viewPeriod === 'biweekly' ? 'default' : 'outline'} size="sm" onClick={() => setViewPeriod('biweekly')}>Quinzenal</Button>
                <Button variant={viewPeriod === 'monthly' ? 'default' : 'outline'} size="sm" onClick={() => setViewPeriod('monthly')}>Mensal</Button>
              </>
           )}
         </div>
          <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Button variant="ghost" size="icon" onClick={() => handleDateChange(isMobile ? -1 : -numDays)}><ChevronsLeft className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDateChange(-1)}><ChevronLeft className="h-5 w-5" /></Button>
              <div className="text-foreground text-center w-40 sm:w-48">
                  {isMobile ? format(currentDate, "eeee, dd/MM", { locale: ptBR }) : getPeriodLabel()}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDateChange(1)}><ChevronRight className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDateChange(isMobile ? 1 : numDays)}><ChevronsRight className="h-5 w-5" /></Button>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" onClick={() => setIsBulkPublishing(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Publicar em Massa
            </Button>
            <Button onClick={handlePublishFromScratch}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Vaga
            </Button>
        </div>
       </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatCard 
                title="Todos os Plantões"
                value={totalShifts}
                icon={ListFilter}
                className="text-primary"
                onClick={() => setStatusFilter('all')}
                isActive={statusFilter === 'all'}
            />
             <StatCard 
                title="Vagas em Aberto"
                value={stats.open}
                icon={CircleHelp}
                className="text-amber-600"
                onClick={() => setStatusFilter('open')}
                isActive={statusFilter === 'open'}
            />
            <StatCard 
                title="Vagas com Candidatos"
                value={stats.pending}
                icon={UserPlus}
                className="text-blue-600"
                onClick={() => stats.pending > 0 && setIsCandidacyListOpen(true)}
                isActive={statusFilter === 'pending'}
            />
            <StatCard 
                title="Plantões Ocupados"
                value={stats.filled}
                icon={CheckCircle}
                className="text-green-600"
                onClick={() => setStatusFilter('filled')}
                isActive={statusFilter === 'filled'}
            />
             <StatProgressCard 
                title="Taxa de Ocupação"
                value={stats.filled}
                total={totalShifts}
            />
      </div>
      
      {isMobile ? (
        <ShiftMobileView 
          patients={filteredPatients}
          days={displayedDays}
          gridShifts={gridShifts}
          handlers={viewHandlers}
        />
      ) : (
        <ShiftGridView
          patients={filteredPatients}
          days={displayedDays}
          gridShifts={gridShifts}
          handlers={viewHandlers}
        />
      )}
      
      {selectedProfessional && professionals && (
        <ProfessionalProfileDialog 
          professional={selectedProfessional}
          isOpen={!!selectedProfessional}
          onOpenChange={handleCloseProfile}
          onApprove={detailsShift ? (prof) => handleApproveProfessional(prof, detailsShift.shift) : undefined}
        />
      )}
      
      <BulkPublishDialog
          isOpen={isBulkPublishing}
          onOpenChange={setIsBulkPublishing}
        />
      
      {professionals && <CandidacyListDialog
          isOpen={isCandidacyListOpen}
          onOpenChange={setIsCandidacyListOpen}
          onOpenProfile={handleOpenProfile}
          onApprove={(prof, shiftInfo) => handleApproveProfessional(prof, shiftInfo as unknown as Shift)}
      />}
      
      {detailsShift && (
        <ShiftDetailsDialog
          isOpen={!!detailsShift}
          onOpenChange={() => setDetailsShift(null)}
          shift={detailsShift.shift}
          professional={detailsShift.professional}
          patient={detailsShift.patient}
          onOpenProfile={handleOpenProfile}
          onApprove={handleApproveProfessional}
          onVacancyPublished={() => {}}
        />
      )}
    </div>
  );
}

export type GridShiftState = {
  shift: Shift;
  professional?: Professional;
  patient: Patient;
  status: 'open' | 'pending' | 'filled' | 'active' | 'completed' | 'issue';
  isUrgent?: boolean;
};

export const statusConfig: { [key in GridShiftState['status']]: { base: string, border: string, text: string } } = {
  active: { base: 'bg-blue-100 dark:bg-blue-950 hover:bg-blue-200/60 dark:hover:bg-blue-900', border: 'border-l-blue-500', text: 'text-blue-800 dark:text-blue-200' },
  issue: { base: 'bg-amber-100 dark:bg-amber-950 hover:bg-amber-200/60 dark:hover:bg-amber-900', border: 'border-l-amber-500', text: 'text-amber-800 dark:text-amber-200' },
  completed: { base: 'bg-green-100 dark:bg-green-950 hover:bg-green-200/60 dark:hover:bg-green-900', border: 'border-l-green-500', text: 'text-green-800 dark:text-green-200' },
  filled: { base: 'bg-secondary hover:bg-secondary/80', border: 'border-l-gray-400', text: 'text-secondary-foreground' },
  pending: { base: 'bg-blue-100 dark:bg-blue-950 hover:bg-blue-200/60 dark:hover:bg-blue-900 border-blue-500', border: 'border-l-blue-500', text: 'text-blue-800 dark:text-blue-200' },
  open: { base: 'bg-card hover:bg-accent', border: 'border-l-border', text: 'text-foreground' },
};


export const ActiveShiftCard = ({ shift, professional, onClick }: { shift: Shift, professional: Professional, onClick: () => void }) => {
  const config = statusConfig[shift.status] || statusConfig.active;

  return (
    <div onClick={onClick} className={cn("relative flex flex-col gap-2 p-2 rounded-lg border-l-4 transition-colors cursor-pointer", config.base, config.border)}>
       {shift.hasNotification && (
        <AlertTriangle className="absolute top-1.5 right-1.5 h-4 w-4 text-amber-500 fill-amber-500/20" />
      )}
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
            <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
            <AvatarFallback>{professional.initials}</AvatarFallback>
        </Avatar>
        <span className={cn("text-sm font-semibold truncate", config.text)}>{professional.name}</span>
      </div>
      {shift.progress !== undefined && (
        <div className="px-1 pb-1">
           <Progress value={shift.progress} className="h-1.5 w-full" />
        </div>
      )}
    </div>
  )
};

export const FilledShiftCard = ({ professional, onClick }: { professional: Professional, onClick: () => void }) => {
  const config = statusConfig.filled;
  return (
    <div onClick={onClick} className={cn("relative flex items-center gap-2 p-2 rounded-lg border-l-4 transition-colors cursor-pointer", config.base, config.border)}>
       <AlertTriangle className="absolute top-1.5 right-1.5 h-4 w-4 text-muted-foreground/20" />
       <Avatar className="h-8 w-8">
          <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
          <AvatarFallback>{professional.initials}</AvatarFallback>
        </Avatar>
      <span className="text-sm font-medium truncate text-foreground">{professional.name}</span>
    </div>
  )
};

export const OpenShiftCard = ({ shiftType, urgent = false, onClick }: { shiftType: string, urgent?: boolean, onClick: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-2 p-2 rounded-lg border-2 border-dashed cursor-pointer hover:bg-accent ${urgent ? 'border-destructive text-destructive' : 'border-muted-foreground'}`}>
    {urgent ? (
       <AlertTriangle className="h-5 w-5 text-destructive" />
    ) : (
      <Plus className="h-5 w-5 text-muted-foreground" />
    )}
    <span className={`text-sm font-semibold ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>{urgent ? 'URGENTE' : ''} Preencher {shiftType}</span>
  </div>
);

export const PendingShiftCard = ({ onClick }: { onClick: () => void }) => {
    const config = statusConfig.pending;
    return (
        <div onClick={onClick} className={cn("flex items-center gap-2 p-2 rounded-lg border-l-4 cursor-pointer", config.base, config.border)}>
            <UserPlus className={cn("h-5 w-5", config.text)} />
            <span className={cn("text-sm font-semibold", config.text)}>Candidaturas</span>
        </div>
    );
}

    
