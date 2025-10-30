'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, CheckCircle, FileText, FileUp, ChevronsLeft, ChevronsRight, Video, MessageCircle, History, XCircle } from 'lucide-react';
import type { Professional, Shift, OpenShiftInfo, ActiveShift, Patient, ShiftDetails } from '@/lib/types';
import { professionals, initialActiveShiftsData, patients as mockPatients } from '@/lib/data';
import { ProfessionalProfileDialog } from './professional-profile-dialog';
import { PublishVacancyDialog } from './publish-vacancy-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { CandidacyManagementDialog } from './candidacy-management-dialog';
import { ShiftChatDialog } from './shift-chat-dialog';
import { ShiftHistoryDialog } from './shift-history-dialog';
import { cn } from '@/lib/utils';
import { BulkPublishDialog } from './bulk-publish-dialog';
import { CandidacyListDialog } from './candidacy-list-dialog';
import { addDays, format, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';


type ShiftState = Shift | null | 'open' | 'pending';

const patients: Patient[] = mockPatients.map(p => ({...p, lowStockCount: 0, criticalStockCount: 0}));


const initialShifts: Record<string, ShiftState[]> = {
  // Semana atual (base 2024-10-07)
  'patient-123-2024-10-06': [ { professional: professionals.find(p => p.id === 'prof-1')!, shiftType: 'day' }, 'pending', ],
  'patient-123-2024-10-07': [ { professional: professionals.find(p => p.id === 'prof-2')!, shiftType: 'day' }, { professional: professionals.find(p => p.id === 'prof-3')!, shiftType: 'night' }, ],
  'patient-456-2024-10-09': [ 'open', { professional: professionals.find(p => p.id === 'prof-4')!, shiftType: 'night' }, ],
  'patient-789-2024-10-08': [ { professional: professionals.find(p => p.id === 'prof-2')!, shiftType: 'day' }, { professional: professionals.find(p => p.id === 'prof-1')!, shiftType: 'night' }, ],
  // Semana seguinte
  'patient-123-2024-10-14': [ 'open', 'open' ],
  'patient-456-2024-10-15': [ { professional: professionals.find(p => p.id === 'prof-5')!, shiftType: 'day' }, 'open' ],
  'patient-789-2024-10-16': [ 'pending', 'open'],
  // Mês seguinte
  'patient-123-2024-11-01': [ 'open', 'open' ],
};


type ViewPeriod = 'weekly' | 'biweekly' | 'monthly';

const periodConfig = {
  weekly: 7,
  biweekly: 15,
  monthly: 30,
};


const ShiftCard = ({ professional, onClick }: { professional: Professional, onClick: () => void }) => (
  <div onClick={onClick} className="flex items-center gap-2 p-2 rounded-lg bg-card border cursor-pointer hover:bg-accent">
    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${professional.avatarColor} text-white font-bold text-sm`}>
      {professional.initials}
    </div>
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

const ShiftScaleView = () => {
  const [shifts, setShifts] = React.useState(initialShifts);
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null);
  const [openShiftInfo, setOpenShiftInfo] = React.useState<{ patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno' } | null | 'from_scratch'>(null);
  const [candidacyShiftInfo, setCandidacyShiftInfo] = React.useState<OpenShiftInfo | null>(null);
  const [isCandidacyListOpen, setIsCandidacyListOpen] = React.useState(false);
  
  // Fix for hydration error: ensure the date is initialized consistently.
  // By creating a date from specific numbers, we avoid timezone parsing issues.
  const [currentDate, setCurrentDate] = React.useState(new Date(2024, 9, 7)); // Month is 0-indexed (9 = October)
  const [viewPeriod, setViewPeriod] = React.useState<ViewPeriod>('weekly');
  
  const [stats, setStats] = React.useState({ open: 0, pending: 0, filled: 0, totalPatients: patients.length });

  const numDays = periodConfig[viewPeriod];
  const displayedDays = Array.from({ length: numDays }, (_, i) => addDays(currentDate, i));

  React.useEffect(() => {
    let openCount = 0;
    let pendingCount = 0;
    let filledCount = 0;
    const patientSet = new Set<string>();

    displayedDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        patients.forEach(patient => {
            patientSet.add(patient.id);
            const shiftKey = `${patient.id}-${dayKey}`;
            const dayShifts = shifts[shiftKey] || ['open', 'open'];

            dayShifts.forEach(shift => {
                if (shift === 'open') {
                    openCount++;
                } else if (shift === 'pending') {
                    pendingCount++;
                } else if (shift) {
                    filledCount++;
                }
            });
        });
    });

    setStats({ open: openCount, pending: pendingCount, filled: filledCount, totalPatients: patientSet.size });
  }, [displayedDays, shifts]);


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
    const key = `${info.patient.id}-${info.dayKey}`;
    const shiftIndex = info.shiftType === 'diurno' ? 0 : 1;
    
    setShifts(prev => {
        const newShifts = { ...prev };
        const dayShifts = newShifts[key] ? [...newShifts[key]] : ['open', 'open'];
        dayShifts[shiftIndex] = 'pending';
        newShifts[key] = dayShifts;
        return newShifts;
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
        const { patient, dayKey, shiftType } = shift;
        const key = `${patient.id}-${dayKey}`;
        const shiftIndex = shiftType === 'diurno' ? 0 : 1;

        setShifts(prev => {
            const newShifts = { ...prev };
            const dayShifts = newShifts[key] ? [...newShifts[key]] : ['open', 'open'];
            dayShifts[shiftIndex] = { professional, shiftType: shiftType === 'diurno' ? 'day' : 'night' };
            newShifts[key] = dayShifts;
            return newShifts;
        });

        handleCloseCandidacy();
        setIsCandidacyListOpen(false);
        handleCloseProfile();
    }
  };
  
  const StatCard = ({ title, value, subValue, icon: Icon, className, onClick } : { title: string, value: string, subValue?: string, icon: React.ElementType, className?: string, onClick?: () => void }) => (
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
  
  const getPeriodLabel = () => {
    if (!displayedDays.length) return '';
    const start = displayedDays[0];
    const end = displayedDays[displayedDays.length - 1];
    const startFormat = format(start, 'd MMM', { locale: ptBR });
    const endFormat = format(end, 'd MMM, yyyy', { locale: ptBR });
    return `${startFormat} - ${endFormat}`;
  }

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
            <Button onClick={() => setOpenShiftInfo('from_scratch')}>
                <Plus className="mr-2 h-4 w-4" />
                Publicar Nova Vaga
            </Button>
        </div>
       </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard 
                title="Total de Pacientes"
                value={String(stats.totalPatients)}
                icon={UserPlus}
                onClick={() => console.log('Filter all patients')}
            />
            <StatCard 
                title="Vagas em Aberto"
                value={String(stats.open)}
                icon={FileText}
                className="text-amber-600"
                onClick={() => console.log('Filter open shifts')}
            />
            <StatCard 
                title="Vagas com Candidatos"
                value={String(stats.pending)}
                icon={UserPlus}
                className="text-blue-600"
                onClick={() => stats.pending > 0 && setIsCandidacyListOpen(true)}
            />
            <StatCard 
                title="Plantões Ocupados"
                value={String(stats.filled)}
                icon={CheckCircle}
                className="text-green-600"
                onClick={() => console.log('Filter filled shifts')}
            />
      </div>
      
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
                <tr>
                <th scope="col" className="sticky left-0 z-10 w-48 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/50 border-r">
                    Paciente
                </th>
                {displayedDays.map(day => (
                    <th key={day.toString()} scope="col" className="min-w-[18rem] px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                    const dayShifts = shifts[`${patient.id}-${dayKey}`] || ['open', 'open'];
                    const dayShift = dayShifts[0];
                    const nightShift = dayShifts[1];
                    
                    const renderShift = (shift: ShiftState, type: 'diurno' | 'noturno') => {
                        if (shift && typeof shift === 'object' && 'professional' in shift) {
                            return <ShiftCard professional={shift.professional} onClick={() => handleOpenProfile(shift.professional)} />;
                        }
                        if (shift === 'pending') {
                            return <PendingShiftCard onClick={() => handleOpenCandidacy(patient, dayKey, type)} />;
                        }
                        return <OpenShiftCard shiftType={type} urgent={patient.id === 'patient-456' && dayKey === '2024-10-09' && type === 'diurno'} onClick={() => handleOpenVacancy(patient, dayKey, type)} />;
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
        isOpen={openShiftInfo === 'from_scratch'}
        onOpenChange={handleCloseVacancy}
        onVacancyPublished={handleVacancyPublished}
        shiftInfo={null}
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
    const [selectedHistoryShift, setSelectedHistoryShift] = React.useState<ActiveShift | null>(null);


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

    const handleOpenHistory = (shift: ActiveShift) => {
        setSelectedHistoryShift(shift);
    }

    const handleCloseHistory = () => {
        setSelectedHistoryShift(null);
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Monitoramento em Tempo Real</CardTitle>
                <CardDescription>Acompanhe os plantões em andamento.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {activeShifts.map((shift, index) => (
                    <Card key={index} className="bg-muted/30">
                        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-4">
                                <Avatar className={`h-12 w-12 text-xl font-bold ${shift.professional.avatarColor}`}>
                                    <AvatarFallback className="bg-transparent text-white">{shift.professional.initials}</AvatarFallback>

                                </Avatar>
                                <div>
                                    <p className="font-semibold">{shift.patientName}</p>
                                    <p className="text-sm text-muted-foreground">{shift.professional.name} - {shift.shift}</p>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progresso do Plantão</span>
                                    <span>{shift.progress}%</span>
                                </div>
                                <Progress value={shift.progress} className="h-2" />
                            </div>

                            <div className="flex justify-around items-center text-sm">
                                <div className="flex items-center gap-2">
                                <CheckCircle className={`h-5 w-5 ${shift.checkIn ? 'text-green-500' : 'text-muted-foreground/50'}`} />
                                <span>{shift.checkIn || '--:--'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                <XCircle className={`h-5 w-5 ${shift.checkOut ? 'text-red-500' : 'text-muted-foreground/50'}`} />
                                <span>{shift.checkOut || '--:--'}</span>
                                </div>
                            </div>

                            <div className="text-sm">
                                <p className="font-semibold">Status Atual:</p>
                                <p className={shift.statusColor}>{shift.status}</p>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="icon"><Video className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" onClick={() => handleOpenChat(shift)}><MessageCircle className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" onClick={() => handleOpenHistory(shift)}><History className="h-4 w-4" /></Button>
                            </div>

                        </CardContent>
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
             {selectedHistoryShift && (
                <ShiftHistoryDialog
                    isOpen={!!selectedHistoryShift}
                    onOpenChange={handleCloseHistory}
                    shift={selectedHistoryShift}
                />
            )}
        </div>
    );
}

export function ShiftManagement() {
  const [activeTab, setActiveTab] = React.useState("scale");
  const [isBulkPublishing, setIsBulkPublishing] = React.useState(false);

  return (
    <>
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
              <ShiftScaleView />
          </TabsContent>
          <TabsContent value="monitoring" className="m-0">
              <ShiftMonitoringView />
          </TabsContent>
        </Tabs>
    </>
  );
}
