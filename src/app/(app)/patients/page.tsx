
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Upload, Trash, Archive, UserCheck } from 'lucide-react';
import Link from 'next/link';
import type { Patient, Professional } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientTable } from '@/components/patients/patient-table';
import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { AssignmentDialog } from '@/components/patients/assignment-dialog';


export default function PatientsPage() {
  const { toast } = useToast();
  const [allPatients, setAllPatients] = React.useState<Patient[]>([]);
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPatients, setSelectedPatients] = React.useState<Set<string>>(new Set());
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = React.useState(false);

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setAllPatients(mockPatients);
      setProfessionals(mockProfessionals);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  React.useEffect(() => {
    if (allPatients) {
      const matchesSearch = allPatients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredPatients(matchesSearch);
    } else {
      setFilteredPatients([]);
    }
  }, [searchTerm, allPatients]);

  const handleSelectionChange = (newSelection: Set<string>) => {
    setSelectedPatients(newSelection);
  }
  
  const handleDeleteSelected = () => {
    toast({
        title: `${selectedPatients.size} paciente(s) excluídos.`,
        description: "A lista de pacientes foi atualizada (simulação).",
        variant: "destructive"
    });
    setAllPatients(prev => prev.filter(p => !selectedPatients.has(p.id)));
    setSelectedPatients(new Set());
  }
  
  const handleAssignmentSuccess = () => {
    toast({
        title: 'Pacientes Atribuídos',
        description: 'A atribuição de supervisor e escalista foi registrada com sucesso.'
    });
    setSelectedPatients(new Set());
  }

  const noData = !isLoading && !allPatients.length;

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
          <p className="text-muted-foreground">Gerencie todos os pacientes em um só lugar.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar paciente por nome..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {selectedPatients.size > 0 ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {selectedPatients.size} selecionado(s)
                    </span>
                     <Button variant="outline" size="sm" onClick={() => setIsAssignmentDialogOpen(true)}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Atribuir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="mr-2 h-4 w-4" />
                      Arquivar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Importar</Button>
                    <Button><UserPlus className="mr-2 h-4 w-4"/> Adicionar Paciente</Button>
                </div>
            )}
        </div>
      </div>
      {isLoading ? (
        <div className="rounded-lg border shadow-sm">
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : noData ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-96">
          <div className="text-lg font-semibold mb-2">Nenhum paciente encontrado.</div>
          <p className="mb-4 text-sm text-muted-foreground">
            {searchTerm 
              ? `Nenhum paciente corresponde à sua busca por "${searchTerm}".` 
              : "Comece adicionando seu primeiro paciente para gerenciar."
            }
          </p>
            <Button asChild>
              <Link href="#">Adicionar Paciente</Link>
          </Button>
        </div>
      ) : filteredPatients.length > 0 ? (
        <PatientTable 
            patients={filteredPatients} 
            professionals={professionals}
            selectedPatients={selectedPatients}
            onSelectionChange={handleSelectionChange}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-96">
          <div className="text-lg font-semibold mb-2">Nenhum paciente encontrado.</div>
          <p className="mb-4 text-sm text-muted-foreground">
            {searchTerm
              ? `Nenhum paciente corresponde à sua busca por "${searchTerm}".`
              : 'Seu perfil ainda não está cadastrado como paciente. Solicite suporte.'}
          </p>
        </div>
      )}
      
      <AssignmentDialog
        isOpen={isAssignmentDialogOpen}
        onOpenChange={setIsAssignmentDialogOpen}
        selectedPatientIds={Array.from(selectedPatients)}
        allPatients={allPatients}
        allProfessionals={professionals}
        onSuccess={handleAssignmentSuccess}
      />
    </>
  );
}
