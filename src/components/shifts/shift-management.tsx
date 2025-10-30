'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, CheckCircle, FileUp, ChevronsLeft, ChevronsRight, CircleHelp, AlertTriangle, MessageSquare, ListFilter, UserCheck } from 'lucide-react';
import type { Professional, Shift, OpenShiftInfo, Patient, ShiftDetails } from '@/lib/types';
import { professionals, initialShifts, patients as mockPatients } from '@/lib/data';
import { ProfessionalProfileDialog } from './professional-profile-dialog';
import { PublishVacancyDialog } from './publish-vacancy-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CandidacyManagementDialog } from './candidacy-management-dialog';
import { cn } from '@/lib/utils';
import { BulkPublishDialog } from './bulk-publish-dialog';
import { CandidacyListDialog } from './candidacy-list-dialog';
import { addDays, format, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShiftDetailsDialog } from './shift-details-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DirectAssignmentDialog } from './direct-assignment-dialog';


type GridShiftState = {
  shift?: Shift;
  professional?: Professional;
  patient: Patient;
  status: 'open' | 'pending' | 'filled' | 'active' | 'completed' | 'issue';
  isUrgent?: boolean;
};

type ViewPeriod = 'weekly' | 'biweekly' | 'monthly';
type StatusFilter = 'all' | 'open' | 'pending' | 'filled';


const allPatients: Patient[] = mockPatients.map(p => ({...p, lowStockCount: 0, criticalStockCount: 0}));


const periodConfig = {
  weekly: 7,
  biweekly: 15,
  monthly: 30,
};

const statusConfig: { [key in GridShiftState['status']]: { base: string, border: string, text: string } } = {
  active: { base: 'bg-blue-100 dark:bg-blue-950 hover:bg-blue-200/60 dark:hover:bg-blue-900', border: 'border-l-blue-500', text: 'text-blue-800 dark:text-blue-200' },
  issue: { base: 'bg-amber-100 dark:bg-amber-950 hover:bg-amber-200/60 dark:hover:bg-amber-900', border: 'border-l-amber-500', text: 'text-amber-800 dark:text-amber-200' },
  completed: { base: 'bg-green-100 dark:bg-green-950 hover:bg-green-200/60 dark:hover:bg-green-900', border: 'border-l-green-500', text: 'text-green-800 dark:text-green-200' },
  filled: { base: 'bg-secondary hover:bg-secondary/80', border: 'border-l-gray-400', text: 'text-secondary-foreground' },
  pending: { base: 'bg-blue-100 dark:bg-blue-950 hover:bg-blue-200/60 dark:hover:bg-blue-900 border-blue-500', border: 'border-l-blue-500', text: 'text-blue-800 dark:text-blue-200' },
  open: { base: 'bg-card hover:bg-accent', border: 'border-l-border', text: 'text-foreground' },
};


const ActiveShiftCard = ({ shift, professional, patient, onClick }: { shift: Shift, professional: Professional, patient: Patient, onClick: () => void }) => {
  const config = statusConfig[shift.status] || statusConfig.active;

  return (
    <div onClick={onClick} className={cn("relative flex flex-col gap-2 p-2 rounded-lg border-l-4 transition-colors cursor-pointer", config.base, config.border)}>
       {shift.hasNotification && (
        <MessageSquare className="absolute top-1.5 right-1.5 h-4 w-4 text-green-500 fill-green-500/20" />
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

const FilledShiftCard = ({ professional, onClick }: { professional: Professional, onClick: () => void }) => {
  const config = statusConfig.filled;
  return (
    <div onClick={onClick} className={cn("relative flex items-center gap-2 p-2 rounded-lg border-l-4 transition-colors cursor-pointer", config.base, config.border)}>
       <MessageSquare className="absolute top-1.5 right-1.5 h-4 w-4 text-muted-foreground/20" />
       <Avatar className="h-8 w-8">
          <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
          <AvatarFallback>{professional.initials}</AvatarFallback>
        </Avatar>
      <span className="text-sm font-medium truncate text-foreground">{professional.name}</span>
    </div>
  )
};

const OpenShiftCard = ({ shiftType, urgent = false, onClick }: { shiftType: string, urgent?: boolean, onClick: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-2 p-2 rounded-lg border-2 border-dashed cursor-pointer hover:bg-accent ${urgent ? 'border-destructive text-destructive' : 'border-muted-foreground'}`}>
    {urgent ? (
       <AlertTriangle className="h-5 w-5 text-destructive" />
    ) : (
      <Plus className="h-5 w-5 text-muted-foreground" />
    )}
    <span className={`text-sm font-semibold ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>{urgent ? 'URGENTE' : ''} Preencher {shiftType}</span>
  </div>
);

const PendingShiftCard = ({ onClick }: { onClick: () => void }) => {
    const config = statusConfig.pending;
    return (
        <div onClick={onClick} className={cn("flex items-center gap-2 p-2 rounded-lg border-l-4 cursor-pointer", config.base, config.border)}>
            <UserPlus className={cn("h-5 w-5", config.text)} />
            <span className={cn("text-sm font-semibold", config.text)}>Candidaturas</span>
        </div>
    );
}

export function ShiftManagement() {
  const [shiftsData, setShiftsData] = React.useState<Shift[]>(initialShifts);
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null);
  const [openShiftInfo, setOpenShiftInfo] = React.useState<{ patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno' } | null | 'from_scratch'>(null);
  const [candidacyShiftInfo, setCandidacyShiftInfo] = React.useState<OpenShiftInfo | null>(null);
  const [isCandidacyListOpen, setIsCandidacyListOpen] = React.useState(false);
  const [isBulkPublishing, setIsBulkPublishing] = React.useState(false);
  const [detailsShift, setDetailsShift] = React.useState<{shift: Shift, professional?: Professional, patient: Patient} | null>(null);
  const [assignmentShiftInfo, setAssignmentShiftInfo] = React.useState<OpenShiftInfo | null>(null);
  const [decisionDialogOpen, setDecisionDialogOpen] = React.useState(false);
  const [currentDecisionShift, setCurrentDecisionShift] = React.useState<OpenShiftInfo | null>(null);

  const [currentDate, setCurrentDate] = React.useState(() => {
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    return startOfWeek(utcDate, { weekStartsOn: 0 }); // Sunday
  });
  
  const [viewPeriod, setViewPeriod] = React.useState<ViewPeriod>('weekly');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>(allPatients);

  const numDays = periodConfig[viewPeriod];

  const displayedDays = React.useMemo(() =>
    Array.from({ length: numDays }, (_, i) => addDays(currentDate, i)),
    [currentDate, numDays]
  );
  
  const gridShifts = React.useMemo(() => {
    const grid: { [key: string]: (GridShiftState | null)[] } = {};
    
    allPatients.forEach(patient => {
      displayedDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        
        const getGridState = (shiftType: 'diurno' | 'noturno'): GridShiftState | null => {
          let shift = shiftsData.find(s => s.patientId === patient.id && s.dayKey === dayKey && s.shiftType === shiftType);
          
          if (!shift) return { status: 'open', isUrgent: false, patient };
          
          const professional = professionals.find(p => p.id === shift?.professionalId);

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
  }, [shiftsData, displayedDays]);

  const stats = React.useMemo(() => {
    let openCount = 0;
    let pendingCount = 0;
    let filledCount = 0;

    Object.values(gridShifts).flat().forEach(shift => {
      if (!shift) return;
      if (shift.status === 'open') openCount++;
      if (shift.status === 'pending') pendingCount++;
      if (shift.status === 'filled' || shift.status === 'active' || shift.status === 'completed' || shift.status === 'issue') filledCount++;
    });

    return { open: openCount, pending: pendingCount, filled: filledCount };
  }, [gridShifts]);


   React.useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredPatients(allPatients);
      return;
    }
    
    const patientIdsWithStatus = new Set<string>();
    
    const filledStatuses: GridShiftState['status'][] = ['filled', 'active', 'completed', 'issue'];

    Object.values(gridShifts).flat().forEach(shift => {
      if (!shift) return;
      
      const match = (statusFilter === 'filled' && filledStatuses.includes(shift.status)) || shift.status === statusFilter;

      if (match) {
        patientIdsWithStatus.add(shift.patient.id);
      }
    });

    setFilteredPatients(allPatients.filter(p => patientIdsWithStatus.has(p.id)));

  }, [statusFilter, gridShifts]);


  const handleDateChange = (days: number) => {
    setCurrentDate(prev => addDays(prev, days));
  };


  const handleOpenProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
  };

  const handleCloseProfile = () => {
    setSelectedProfessional(null);
  };
  
  const handleOpenVacancy = (patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno') => {
    setCurrentDecisionShift({ patient, dayKey, shiftType });
    setDecisionDialogOpen(true);
  };

  const handlePublishFromScratch = () => {
    setOpenShiftInfo('from_scratch');
  }

  const handleCloseVacancy = () => {
    setOpenShiftInfo(null);
  };

  const handleVacancyPublished = (info: ShiftDetails) => {
     setShiftsData(prev => {
        const existingIndex = prev.findIndex(s => s.patientId === info.patient.id && s.dayKey === info.dayKey && s.shiftType === info.shiftType);
        if (existingIndex > -1) {
            const updatedShifts = [...prev];
            updatedShifts[existingIndex] = { ...updatedShifts[existingIndex], status: 'pending' };
            return updatedShifts;
        }
        return [...prev, { patientId: info.patient.id, dayKey: info.dayKey, shiftType: info.shiftType, status: 'pending' }];
    });
  }

  const handleOpenCandidacy = (patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno') => {
    setCandidacyShiftInfo({ patient, dayKey, shiftType });
  }

  const handleCloseCandidacy = () => {
    setCandidacyShiftInfo(null);
  }
  
  const handleApproveProfessional = (professional: Professional, shift: OpenShiftInfo) => {
    if (shift) {
        setShiftsData(prev => {
            const existingIndex = prev.findIndex(s => s.patientId === shift.patient.id && s.dayKey === shift.dayKey && s.shiftType === shift.shiftType);
            const newShift: Shift = {
                patientId: shift.patient.id,
                professionalId: professional.id,
                dayKey: shift.dayKey,
                shiftType: shift.shiftType,
                status: 'filled'
            };
            if (existingIndex > -1) {
                const updatedShifts = [...prev];
                updatedShifts[existingIndex] = newShift;
                return updatedShifts;
            }
            return [...prev, newShift];
        });
        
        handleCloseCandidacy();
        setIsCandidacyListOpen(false);
        setAssignmentShiftInfo(null);
        handleCloseProfile();
    }
  };

  const handleOpenAssignment = () => {
    if (currentDecisionShift) {
        setAssignmentShiftInfo(currentDecisionShift);
    }
  };
  
  const handleOpenPublication = () => {
    if (currentDecisionShift) {
        setOpenShiftInfo(currentDecisionShift);
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

  return (
    <div className="p-4 sm:p-6">
       <div className="flex items-center justify-between gap-4 mb-6">
         <div className="flex items-center gap-2">
           <Button variant={viewPeriod === 'weekly' ? 'default' : 'outline'} size="sm" onClick={() => setViewPeriod('weekly')}>Semanal</Button>
           <Button variant={viewPeriod === 'biweekly' ? 'default' : 'outline'} size="sm" onClick={() => setViewPeriod('biweekly')}>Quinzenal</Button>
           <Button variant={viewPeriod === 'monthly' ? 'default' : 'outline'} size="sm" onClick={() => setViewPeriod('monthly')}>Mensal</Button>
         </div>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <div className='flex items-center gap-1'>
                  <Button variant="ghost" size="icon" onClick={() => handleDateChange(-numDays)}><ChevronsLeft className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDateChange(-1)}><ChevronLeft className="h-5 w-5" /></Button>
              </div>
              <div className="text-foreground text-center w-48">
                  {getPeriodLabel()}
              </div>
              <div className='flex items-center gap-1'>
                  <Button variant="ghost" size="icon" onClick={() => handleDateChange(1)}><ChevronRight className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDateChange(numDays)}><ChevronsRight className="h-5 w-5" /></Button>
              </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" onClick={() => setIsBulkPublishing(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Publicação em Massa
            </Button>
            <Button onClick={handlePublishFromScratch}>
                <Plus className="mr-2 h-4 w-4" />
                Publicar Nova Vaga
            </Button>
        </div>
       </div>

       <div className="grid gap-6 md:grid-cols-5 mb-6">
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
      
      <div className="rounded-lg border bg-card overflow-x-auto">
        <div className="relative">
            <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
                <tr>
                <th scope="col" className="sticky left-0 z-20 w-48 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/50 border-r">
                    Paciente
                </th>
                {displayedDays.map(day => (
                    <th key={day.toISOString()} scope="col" className="min-w-[18rem] px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     {format(day, "eeee, dd", { locale: ptBR })}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                    <td className="sticky left-0 z-10 px-6 py-4 whitespace-nowrap bg-card group-hover:bg-accent/50 border-r">
                      <div className="text-sm font-medium text-foreground">{patient.name}</div>
                    </td>
                    {displayedDays.map(day => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const dayShifts = gridShifts[`${patient.id}-${dayKey}`] || [null, null];
                    const dayShift = dayShifts[0];
                    const nightShift = dayShifts[1];
                    
                    const renderShift = (shiftState: GridShiftState | null, type: 'diurno' | 'noturno') => {
                        if (!shiftState) return <OpenShiftCard shiftType={type} onClick={() => handleOpenVacancy(patient, dayKey, type)} />;
                        
                        const { shift, professional, status, isUrgent, patient } = shiftState;

                        if ((status === 'active' || status === 'issue' || status === 'completed') && professional && shift) {
                            return <ActiveShiftCard shift={shift} professional={professional} patient={patient} onClick={() => setDetailsShift({ shift, professional, patient })} />;
                        }
                        if (status === 'filled' && professional) {
                            return <FilledShiftCard professional={professional} onClick={() => handleOpenProfile(professional!)} />;
                        }
                        if (status === 'pending') {
                            return <PendingShiftCard onClick={() => handleOpenCandidacy(patient, dayKey, type)} />;
                        }
                        
                        return <OpenShiftCard shiftType={type} urgent={isUrgent} onClick={() => handleOpenVacancy(patient, dayKey, type)} />;
                    }

                    return (
                        <td key={dayKey} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                            {renderShift(dayShift, 'diurno')}
                            {renderShift(nightShift, 'noturno')}
                        </div>
                        </td>
                    )
                    })}
                </tr>
                ))}
                 {filteredPatients.length === 0 && (
                    <tr>
                        <td colSpan={numDays + 1} className="text-center text-muted-foreground p-12">
                            Nenhum paciente encontrado para o filtro "{statusFilter}".
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
      {selectedProfessional && (
        <ProfessionalProfileDialog 
          professional={selectedProfessional}
          isOpen={!!selectedProfessional}
          onOpenChange={handleCloseProfile}
          onApprove={(prof) => candidacyShiftInfo && handleApproveProfessional(prof, candidacyShiftInfo)}
        />
      )}
      
      <PublishVacancyDialog
        isOpen={openShiftInfo === 'from_scratch' || (openShiftInfo !== null && typeof openShiftInfo === 'object')}
        onOpenChange={handleCloseVacancy}
        onVacancyPublished={handleVacancyPublished}
        shiftInfo={openShiftInfo === 'from_scratch' ? null : openShiftInfo}
      />

      <BulkPublishDialog
          isOpen={isBulkPublishing}
          onOpenChange={setIsBulkPublishing}
        />
      
       {candidacyShiftInfo && (
        <CandidacyManagementDialog
          shiftInfo={candidacyShiftInfo}
          isOpen={!!candidacyShiftInfo}
          onOpenChange={handleCloseCandidacy}
          onOpenProfile={handleOpenProfile}
          onApprove={(prof) => handleApproveProfessional(prof, candidacyShiftInfo)}
        />
      )}

      <CandidacyListDialog
          isOpen={isCandidacyListOpen}
          onOpenChange={setIsCandidacyListOpen}
          onOpenProfile={handleOpenProfile}
          onApprove={handleApproveProfessional}
      />
      
      {detailsShift && (
        <ShiftDetailsDialog
          isOpen={!!detailsShift}
          onOpenChange={() => setDetailsShift(null)}
          shift={detailsShift.shift}
          professional={detailsShift.professional}
          patient={detailsShift.patient}
          onOpenProfile={handleOpenProfile}
        />
      )}
      
       <AlertDialog open={decisionDialogOpen} onOpenChange={setDecisionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Como você deseja preencher esta vaga?</AlertDialogTitle>
            <AlertDialogDescription>
              Você pode publicar a vaga para que os profissionais se candidatem ou pode atribuir
              diretamente um profissional específico da sua equipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleOpenAssignment} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <UserCheck className="mr-2 h-4 w-4" /> Atribuir Diretamente
            </AlertDialogAction>
            <AlertDialogAction onClick={handleOpenPublication}>
              <FileUp className="mr-2 h-4 w-4" /> Publicar Vaga
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {assignmentShiftInfo && (
        <DirectAssignmentDialog
          isOpen={!!assignmentShiftInfo}
          onOpenChange={() => setAssignmentShiftInfo(null)}
          shiftInfo={assignmentShiftInfo}
          onApprove={handleApproveProfessional}
        />
      )}
    </div>
  );
}
