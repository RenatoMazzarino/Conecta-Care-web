
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Upload, Trash, Archive, UserCheck, ListFilter, X } from 'lucide-react';
import Link from 'next/link';
import type { Patient, Professional } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientTable } from '@/components/patients/patient-table';
import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { AssignmentDialog } from '@/components/patients/assignment-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';

export default function PatientsPage() {
  const { toast } = useToast();
  const [allPatients, setAllPatients] = React.useState<Patient[]>([]);
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>([]);
  const [selectedPatients, setSelectedPatients] = React.useState<Set<string>>(new Set());
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = React.useState(false);

  // State for filters
  const [searchTerm, setSearchTerm] = React.useState('');
  const [complexityFilter, setComplexityFilter] = React.useState('all');
  const [packageFilter, setPackageFilter] = React.useState('all');
  const [planFilter, setPlanFilter] = React.useState('all');
  const [supervisorFilter, setSupervisorFilter] = React.useState('all');
  const [cityFilter, setCityFilter] = React.useState('');
  const [stateFilter, setStateFilter] = React.useState('');

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setAllPatients(mockPatients);
      setProfessionals(mockProfessionals);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const supervisors = React.useMemo(() => 
    mockProfessionals.filter(p => p.role === 'Supervisor(a)'), 
    []
  );

  const resetFilters = () => {
    setSearchTerm('');
    setComplexityFilter('all');
    setPackageFilter('all');
    setPlanFilter('all');
    setSupervisorFilter('all');
    setCityFilter('');
    setStateFilter('');
  }

  const activeFilterCount = [
    searchTerm, 
    complexityFilter, 
    packageFilter, 
    planFilter, 
    supervisorFilter,
    cityFilter,
    stateFilter
  ].filter(f => f && f !== 'all').length;


  React.useEffect(() => {
    let results = allPatients;

    if (searchTerm) {
      results = results.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (complexityFilter !== 'all') {
      results = results.filter(p => p.complexity === complexityFilter);
    }
    if (packageFilter !== 'all') {
        results = results.filter(p => p.servicePackage === packageFilter);
    }
    if (planFilter !== 'all') {
        results = results.filter(p => p.financial.plan === planFilter);
    }
    if (supervisorFilter !== 'all') {
        results = results.filter(p => p.supervisorId === supervisorFilter);
    }
    if (cityFilter) {
      results = results.filter(p => p.address.city.toLowerCase().includes(cityFilter.toLowerCase()));
    }
    if (stateFilter) {
      results = results.filter(p => p.address.state.toLowerCase().includes(stateFilter.toLowerCase()));
    }

    setFilteredPatients(results);
  }, [searchTerm, complexityFilter, packageFilter, planFilter, supervisorFilter, cityFilter, stateFilter, allPatients]);

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
       
       <Collapsible className="mb-6">
        <div className="flex items-center justify-between p-4 border rounded-t-lg bg-card">
          <div className="relative w-full md:flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar paciente por nome..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CollapsibleTrigger asChild>
             <Button variant="outline">
              <ListFilter className="mr-2 h-4 w-4" />
              Filtros Avançados
              {activeFilterCount > 0 && <span className="ml-2 bg-primary text-primary-foreground h-5 w-5 text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
            <div className="p-6 bg-card border border-t-0 rounded-b-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Complexidade</Label>
                    <Select value={complexityFilter} onValueChange={setComplexityFilter}>
                        <SelectTrigger><SelectValue placeholder="Complexidade" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toda Complexidade</SelectItem>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pacote de Serviço</Label>
                    <Select value={packageFilter} onValueChange={setPackageFilter}>
                        <SelectTrigger><SelectValue placeholder="Pacote" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Pacotes</SelectItem>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                            <SelectItem value="Completo">Completo</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label>Vínculo</Label>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                        <SelectTrigger><SelectValue placeholder="Vínculo" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos Vínculos</SelectItem>
                            <SelectItem value="particular">Particular</SelectItem>
                            <SelectItem value="plano_de_saude">Plano de Saúde</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label>Supervisor</Label>
                    <Select value={supervisorFilter} onValueChange={setSupervisorFilter}>
                        <SelectTrigger><SelectValue placeholder="Supervisor" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos Supervisores</SelectItem>
                            {supervisors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input placeholder="Filtrar por cidade..." value={cityFilter} onChange={e => setCityFilter(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label>Estado (UF)</Label>
                      <Input placeholder="Filtrar por UF..." value={stateFilter} onChange={e => setStateFilter(e.target.value)} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button variant="ghost" onClick={resetFilters} disabled={activeFilterCount === 0}>
                        <X className="mr-2 h-4 w-4"/>
                        Limpar Filtros
                    </Button>
                </div>
            </div>
        </CollapsibleContent>
       </Collapsible>

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
            Comece adicionando seu primeiro paciente para gerenciar.
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
            Nenhum paciente corresponde aos filtros selecionados.
          </p>
           <Button variant="secondary" onClick={resetFilters}>Limpar Filtros</Button>
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
