'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, UserPlus, Clock, CheckCircle, XCircle, Video, MessageCircle, History, Users, CircleCheck, CircleX, Pill, Footprints, FileText, FileUp } from 'lucide-react';
import type { Professional, Shift, OpenShiftInfo, ActiveShift, Patient, ShiftDetails } from '@/lib/types';
import { professionals, initialActiveShiftsData, patients as mockPatients } from '@/lib/data';
import { ProfessionalProfileDialog } from './professional-profile-dialog';
import { PublishVacancyDialog } from './publish-vacancy-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { CandidacyManagementDialog } from './candidacy-management-dialog';
import { ShiftChatDialog } from './shift-chat-dialog';
import { useToast } from '@/hooks/use-toast';
import { ShiftHistoryDialog } from './shift-history-dialog';
import { cn } from '@/lib/utils';


type ShiftState = Shift | null | 'open' | 'pending';

const patients: Patient[] = mockPatients.map(p => ({...p, lowStockCount: 0, criticalStockCount: 0}));


const initialShifts: Record<string, ShiftState[]> = {
  'patient-123-2024-10-06': [
    { professional: professionals.find(p => p.id === 'prof-1')!, shiftType: 'day' },
    'pending',
  ],
  'patient-123-2024-10-07': [
    { professional: professionals.find(p => p.id === 'prof-2')!, shiftType: 'day' },
    { professional: professionals.find(p => p.id === 'prof-3')!, shiftType: 'night' },
  ],
  'patient-456-2024-10-09': [
    'open',
    { professional: professionals.find(p => p.id === 'prof-4')!, shiftType: 'night' },
  ],
   'patient-789-2024-10-08': [
    { professional: professionals.find(p => p.id === 'prof-2')!, shiftType: 'day' },
    { professional: professionals.find(p => p.id === 'prof-1')!, shiftType: 'night' },
  ],
};

const days = ['Segunda, 06', 'Terça, 07', 'Quarta, 08', 'Quinta, 09', 'Sexta, 10'];
const dayKeys = ['2024-10-06', '2024-10-07', '2024-10-08', '2024-10-09', '2024-10-10'];

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
        <Users className="h-5 w-5" />
        <span className="text-sm font-semibold">Candidaturas</span>
    </div>
);

const ShiftScaleView = () => {
  const [shifts, setShifts] = React.useState(initialShifts);
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null);
  const [openShiftInfo, setOpenShiftInfo] = React.useState<{ patient: Patient, dayKey: string, shiftType: 'diurno' | 'noturno' } | null | 'from_scratch'>(null);
  const [candidacyShiftInfo, setCandidacyShiftInfo] = React.useState<OpenShiftInfo | null>(null);

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

  const handleApproveProfessional = (professional: Professional) => {
    if (candidacyShiftInfo) {
        const { patient, dayKey, shiftType } = candidacyShiftInfo;
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

  return (
    <div className="p-4 sm:p-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard 
                title="Total de Pacientes"
                value="124"
                icon={Users}
                onClick={() => console.log('Filter all patients')}
            />
            <StatCard 
                title="Vagas em Aberto"
                value="17"
                subValue="1 Publicada / 16 Não Publicadas"
                icon={FileText}
                className="text-amber-600"
                onClick={() => console.log('Filter open shifts')}
            />
            <StatCard 
                title="Plantões Ocupados"
                value="352"
                icon={CheckCircle}
                className="text-green-600"
                onClick={() => console.log('Filter filled shifts')}
            />
          <div className="flex items-center justify-center gap-2 rounded-lg border bg-card text-card-foreground shadow-sm">
              <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-lg font-semibold">Outubro, 2024</div>
              <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
              </Button>
          </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="w-64 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Paciente
              </th>
              {days.map(day => (
                <th key={day} scope="col" className="min-w-64 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{patient.name}</div>
                </td>
                {dayKeys.map(dayKey => {
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
      {selectedProfessional && (
        <ProfessionalProfileDialog 
          professional={selectedProfessional}
          isOpen={!!selectedProfessional}
          onOpenChange={handleCloseProfile}
          onApprove={candidacyShiftInfo ? handleApproveProfessional : undefined}
        />
      )}
      
      <PublishVacancyDialog
        shiftInfo={openShiftInfo === 'from_scratch' ? null : openShiftInfo}
        isOpen={!!openShiftInfo}
        onOpenChange={handleCloseVacancy}
        onVacancyPublished={handleVacancyPublished}
      />
      
       {candidacyShiftInfo && (
        <CandidacyManagementDialog
          shiftInfo={candidacyShiftInfo}
          isOpen={!!candidacyShiftInfo}
          onOpenChange={handleCloseCandidacy}
          onOpenProfile={handleOpenProfile}
          onApprove={handleApproveProfessional}
        />
      )}
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
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handlePublishFromScratch = () => {
    // This will trigger the dialog to open in its "select patient" state
    setIsPublishing(true);
  };


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
        <div className='flex items-center gap-2'>
            <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Publicação em Massa
            </Button>
            <Button onClick={() => setIsPublishing(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Publicar Nova Vaga
            </Button>
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
         <PublishVacancyDialog
            isOpen={isPublishing}
            onOpenChange={setIsPublishing}
            shiftInfo={null}
        />
    </div>
  );
}

    
