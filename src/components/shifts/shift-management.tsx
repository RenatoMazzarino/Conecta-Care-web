'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, CheckCircle, FileText, FileUp, ChevronsLeft, ChevronsRight, Video, MessageCircle, ClipboardCheck, XCircle } from 'lucide-react';
import type { Professional, Shift, OpenShiftInfo, ActiveShift, Patient, ShiftDetails } from '@/lib/types';
import { professionals, initialActiveShiftsData, patients as mockPatients, initialShifts } from '@/lib/data';
import { ProfessionalProfileDialog } from './professional-profile-dialog';
import { PublishVacancyDialog } from './publish-vacancy-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CandidacyManagementDialog } from './candidacy-management-dialog';
import { ShiftChatDialog } from './shift-chat-dialog';
import { ShiftAuditDialog } from './shift-audit-dialog';
import { cn } from '@/lib/utils';
import { BulkPublishDialog } from './bulk-publish-dialog';
import { CandidacyListDialog } from './candidacy-list-dialog';
import { addDays, format, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type GridShiftState = {
  professional?: Professional;
  status: 'open' | 'pending' | 'filled';
};

const patients: Patient[] = mockPatients.map(p => ({...p, lowStockCount: 0, criticalStockCount: 0}));

type ViewPeriod = 'weekly' | 'biweekly' | 'monthly';

const periodConfig = {
  weekly: 7,
  biweekly: 15,
  monthly: 30,
};


const ShiftCard = ({ professional, onClick }: { professional: Professional, onClick: () => void }) => (
  <div onClick={onClick} className="flex items-center gap-2 p-2 rounded-lg bg-card border cursor-pointer hover:bg-accent">
     <Avatar className="h-8 w-8">
        <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint} />
        <AvatarFallback>{professional.initials}</AvatarFallback>
      </Avatar>
    <span className="text-sm font-medium truncate">{professional.name}</span>
  </div>
);

const OpenShiftCard = ({ shiftType, urgent = false, onClick }: { shiftType: string, urgent?: boolean, onClick: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-2 p-2 rounded-lg border-2 border-dashed cursor-pointer hover:bg-accent ${urgent ? 'border-destructive text-destructive' : 'border-muted-foreground'}`}>
    {urgent ? (
       <UserPlus className="h-5 w-5 text-destructive" />
    ) : (
      <Plus className="h-5 w-5 text-muted-foreground" />
    )}
    <span className={`text-sm font-semibold ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>{urgent ? 'URGENTE' : ''} Preencher {shiftType}</span>
  </div>
);

const PendingShiftCard = ({ onClick }: { onClick: () => void }) => (
    <div onClick={onClick} className="flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-amber-500 text-amber-600 cursor-pointer hover:bg-amber-50">
        <UserPlus className="h-5 w-5" />
        <span className="text-sm font-semibold">Candidaturas</span>
    </div>
);

const ShiftScaleView = ({ isBulkPublishing, setIsBulkPublishing }: { isBulkPublishing: boolean, setIsBulkPublishing: (value: boolean) => void }) => {
  const [shiftsData, setShiftsData] = React.useState<Shift[]>(initialShifts);
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null);
  const [openShiftInfo, setOpenShiftInfo] = React.useState<{ patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno' } | null | 'from_scratch'>(null);
  const [candidacyShiftInfo, setCandidacyShiftInfo] = React.useState<OpenShiftInfo | null>(null);
  const [isCandidacyListOpen, setIsCandidacyListOpen] = React.useState(false);
  
  const [currentDate, setCurrentDate] = React.useState(() => {
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    return startOfWeek(utcDate, { weekStartsOn: 0 }); // Sunday
  });

  const [viewPeriod, setViewPeriod] = React.useState<ViewPeriod>('weekly');
  
  const [stats, setStats] = React.useState({ open: 0, pending: 0, filled: 0 });

  const numDays = periodConfig[viewPeriod];
  
  const displayedDays = React.useMemo(() => 
    Array.from({ length: numDays }, (_, i) => addDays(currentDate, i)),
    [currentDate, numDays]
  );
  
  const gridShifts = React.useMemo(() => {
    const grid: Record<string, (GridShiftState | null)[]> = {};
    
    patients.forEach(patient => {
      displayedDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const shiftKey = `${patient.id}-${dayKey}`;

        const dayShiftData = shiftsData.find(s => s.patientId === patient.id && s.dayKey === dayKey && s.shiftType === 'diurno');
        const nightShiftData = shiftsData.find(s => s.patientId === patient.id && s.dayKey === dayKey && s.shiftType === 'noturno');

        const getGridState = (shift: Shift | undefined): GridShiftState | null => {
          if (!shift) return { status: 'open' };
          if (shift.status === 'pending') return { status: 'pending' };
          if (shift.professionalId) {
            const professional = professionals.find(p => p.id === shift.professionalId);
            if(professional) return { professional, status: 'filled' };
          }
          return { status: 'open' };
        };

        grid[shiftKey] = [getGridState(dayShiftData), getGridState(nightShiftData)];
      });
    });
    return grid;
  }, [shiftsData, displayedDays]);

  React.useEffect(() => {
    let openCount = 0;
    let pendingCount = 0;
    let filledCount = 0;

    Object.values(gridShifts).flat().forEach(shift => {
      if (!shift) return;
      if (shift.status === 'open') openCount++;
      if (shift.status === 'pending') pendingCount++;
      if (shift.status === 'filled') filledCount++;
    });

    setStats({ open: openCount, pending: pendingCount, filled: filledCount });
  }, [gridShifts, displayedDays]);


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
    setOpenShiftInfo({ patient, dayKey, shiftType });
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
                dayKey: shift.dayKey,
                shiftType: shift.shiftType,
                professionalId: professional.id,
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
        handleCloseProfile();
    }
  };
  
  const StatCard = ({ title, value, subValue, icon: Icon, className, onClick }: { title: string, value: string | number, subValue?: string, icon: React.ElementType, className?: string, onClick?: () => void }) => (
    <Card onClick={onClick} className={cn("hover:shadow-md transition-shadow", onClick && "cursor-pointer")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", className)}>{title}</CardTitle>
            <Icon className={cn("h-5 w-5 text-muted-foreground", className)} />
        </CardHeader>
        <CardContent>
            <div className={cn("text-2xl font-bold", className)}>{value}</div>
            {subValue && (
                <p className="text-xs text-muted-foreground">{subValue}</p>
            )}
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
    const startFormat = format(start, 'd MMM', { locale: ptBR });
    const endFormat = format(end, 'd MMM, yyyy', { locale: ptBR });
    return `${startFormat} - ${endFormat}`;
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

       <div className="grid gap-6 md:grid-cols-4 mb-6">
             <StatProgressCard 
                title="Taxa de Ocupação"
                value={stats.filled}
                total={totalShifts}
            />
            <StatCard 
                title="Vagas em Aberto"
                value={stats.open}
                icon={FileText}
                className="text-amber-600"
            />
            <StatCard 
                title="Vagas com Candidatos"
                value={stats.pending}
                icon={UserPlus}
                className="text-blue-600"
                onClick={() => stats.pending > 0 && setIsCandidacyListOpen(true)}
            />
            <StatCard 
                title="Plantões Ocupados"
                value={stats.filled}
                icon={CheckCircle}
                className="text-green-600"
            />
      </div>
      
      <div className={cn(
        "rounded-lg border bg-card overflow-x-auto",
        viewPeriod === 'weekly' && 'overflow-x-auto',
        (viewPeriod === 'biweekly' || viewPeriod === 'monthly') && 'overflow-x-scroll'
        )}>
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
                {patients.map((patient) => (
                <tr key={patient.id}>
                    <td className="sticky left-0 z-10 px-6 py-4 whitespace-nowrap bg-card group-hover:bg-accent/50 border-r">
                      <div className="text-sm font-medium text-foreground">{patient.name}</div>
                    </td>
                    {displayedDays.map(day => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const dayShifts = gridShifts[`${patient.id}-${dayKey}`] || [null, null];
                    const dayShift = dayShifts[0];
                    const nightShift = dayShifts[1];
                    
                    const renderShift = (shift: GridShiftState | null, type: 'diurno' | 'noturno') => {
                        if (!shift) return <OpenShiftCard shiftType={type} onClick={() => handleOpenVacancy(patient, dayKey, type)} />;
                        if (shift.status === 'filled' && shift.professional) {
                            return <ShiftCard professional={shift.professional} onClick={() => handleOpenProfile(shift.professional!)} />;
                        }
                        if (shift.status === 'pending') {
                            return <PendingShiftCard onClick={() => handleOpenCandidacy(patient, dayKey, type)} />;
                        }
                        const isUrgent = patient.id === 'patient-456' && dayKey === format(addDays(new Date(), 2), 'yyyy-MM-dd') && type === 'diurno';
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
    </div>
  );
}



const ShiftMonitoringView = () => {
    const [activeShifts, setActiveShifts] = React.useState<ActiveShift[]>(initialActiveShiftsData);
    const [selectedChatShift, setSelectedChatShift] = React.useState<ActiveShift | null>(null);
    const [selectedAuditShift, setSelectedAuditShift] = React.useState<ActiveShift | null>(null);


    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveShifts(prevShifts => 
                prevShifts.map(shift => {
                    if (shift.progress >= 100) return shift;

                    // Update progress
                    let newProgress = shift.progress < 100 ? shift.progress + 1 : 100;
                    
                    // Simulate check-in for the late professional
                    if (shift.status === 'Atrasado' && newProgress > 20 && !shift.checkIn) {
                        return {
                            ...shift,
                            progress: newProgress,
                            checkIn: '08:15',
                            status: 'Sem Intercorrências',
                            statusColor: 'text-green-600'
                        };
                    }

                    // Simulate checkout
                    if(newProgress >= 100 && !shift.checkOut) {
                         return {
                            ...shift,
                            progress: 100,
                            checkOut: shift.shift.includes('DIURNO') ? '20:05' : '08:05',
                            status: 'Finalizado',
                            statusColor: 'text-muted-foreground'
                        };
                    }
                    
                    return { ...shift, progress: newProgress };
                })
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleOpenChat = (shift: ActiveShift) => {
        setSelectedChatShift(shift);
    }
    
    const handleCloseChat = () => {
        setSelectedChatShift(null);
    }

    const handleOpenAudit = (shift: ActiveShift) => {
        setSelectedAuditShift(shift);
    }

    const handleCloseAudit = () => {
        setSelectedAuditShift(null);
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Monitoramento em Tempo Real</CardTitle>
                <CardDescription>Acompanhe os plantões em andamento.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeShifts.map((shift, index) => (
                    <Card key={index} className="bg-muted/30 flex flex-col">
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 text-xl font-bold">
                                     <AvatarImage src={shift.professional.avatarUrl} alt={shift.professional.name} data-ai-hint={shift.professional.avatarHint} />
                                    <AvatarFallback>{shift.professional.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{shift.professional.name}</p>
                                    <p className="text-sm text-muted-foreground">{shift.patientName} - {shift.shift}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                             <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progresso do Plantão</span>
                                    <span>{shift.progress}%</span>
                                </div>
                                <Progress value={shift.progress} className="h-2" />
                            </div>
                             <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                <CheckCircle className={`h-5 w-5 ${shift.checkIn ? 'text-green-500' : 'text-muted-foreground/50'}`} />
                                <div>
                                    <p className="text-xs text-muted-foreground">Check-in</p>
                                    <p className="font-medium">{shift.checkIn || '--:--'}</p>
                                </div>
                                </div>
                                <div className="flex items-center gap-2">
                                <XCircle className={`h-5 w-5 ${shift.checkOut ? 'text-red-500' : 'text-muted-foreground/50'}`} />
                                 <div>
                                    <p className="text-xs text-muted-foreground">Check-out</p>
                                    <p className="font-medium">{shift.checkOut || '--:--'}</p>
                                </div>
                                </div>
                            </div>
                             <div>
                                <p className="text-xs font-semibold">Status Atual:</p>
                                <p className={cn("font-medium", shift.statusColor)}>{shift.status}</p>
                            </div>
                        </CardContent>
                         <div className="flex items-center justify-end gap-2 p-4 border-t">
                            <Button variant="outline" size="icon"><Video className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" onClick={() => handleOpenChat(shift)}><MessageCircle className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" onClick={() => handleOpenAudit(shift)}><ClipboardCheck className="h-4 w-4" /></Button>
                        </div>
                    </Card>
                ))}
            </CardContent>
            </Card>
            {selectedChatShift && (
                <ShiftChatDialog
                    isOpen={!!selectedChatShift}
                    onOpenChange={handleCloseChat}
                    shift={selectedChatShift}
                />
            )}
             {selectedAuditShift && (
                <ShiftAuditDialog
                    isOpen={!!selectedAuditShift}
                    onOpenChange={handleCloseAudit}
                    shift={selectedAuditShift}
                />
            )}
        </div>
    );
}

export function ShiftManagement() {
  const [activeTab, setActiveTab] = React.useState("scale");
  const [isBulkPublishing, setIsBulkPublishing] = React.useState(false);

  return (
    <div className="flex-1 flex flex-col">
       <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-card">
         <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                  <TabsTrigger value="scale">Gestão de Escala</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoramento em Tempo Real</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
       </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="scale" className="m-0">
              <ShiftScaleView isBulkPublishing={isBulkPublishing} setIsBulkPublishing={setIsBulkPublishing} />
          </TabsContent>
          <TabsContent value="monitoring" className="m-0">
              <ShiftMonitoringView />
          </TabsContent>
        </Tabs>
    </div>
  );
}
