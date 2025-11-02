
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { LayoutDashboard, Stethoscope, HeartPulse, Dumbbell, Apple, FolderKanban, Gavel } from 'lucide-react';
import { ProntuarioDashboard } from '@/components/prontuario/prontuario-dashboard';
import { ProntuarioEnfermagem } from '@/components/prontuario/prontuario-enfermagem';
import { ProntuarioMedico } from '@/components/prontuario/prontuario-medico';
import { ProntuarioFisioterapia } from '@/components/prontuario/prontuario-fisioterapia';
import { ProntuarioNutricao } from '@/components/prontuario/prontuario-nutricao';
import { ProntuarioDocumentos } from '@/components/prontuario/prontuario-documentos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import type { EditMode } from '../patients/patient-details-panel';

// Definição das abas do prontuário
export const prontuarioTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enfermagem', label: 'Enfermagem', icon: HeartPulse },
  { id: 'medico', label: 'Médico', icon: Stethoscope },
  { id: 'fisioterapia', label: 'Fisioterapia', icon: Dumbbell },
  { id: 'nutricao', label: 'Nutrição', icon: Apple },
  { id: 'documentos', label: 'Documentos', icon: FolderKanban },
  { id: 'juridico', label: 'Jurídico', icon: Gavel },
];

const ProntuarioJuridico: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle>Termos e Consentimentos</CardTitle>
        <CardDescription>
          Gerenciamento de consentimentos e documentos legais do paciente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-semibold">Termo de Consentimento para Tratamento de Dados (LGPD)</h4>
            <p className="text-sm text-muted-foreground mt-1">Assinado em 20 de Janeiro de 2023</p>
            <Button variant="link" asChild className="px-0 h-auto mt-2">
                <Link href="#" target="_blank">Visualizar Documento</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
);


type ProntuarioContentProps = {
    tabId: string;
    editMode: EditMode;
    setEditMode: (mode: EditMode) => void;
    editedData: Patient | null;
    setEditedData: (data: Patient | null) => void;
};

// Componente que renderiza o conteúdo da aba ativa
export function ProntuarioContent({ tabId, editMode, setEditMode, editedData, setEditedData }: ProntuarioContentProps) {
  switch (tabId) {
    case 'dashboard':
      return <ProntuarioDashboard editMode={editMode} setEditMode={setEditMode} editedData={editedData} setEditedData={setEditedData} />;
    case 'enfermagem':
      return <ProntuarioEnfermagem />;
    case 'medico':
        return <ProntuarioMedico />;
    case 'fisioterapia':
        return <ProntuarioFisioterapia />;
    case 'nutricao':
        return <ProntuarioNutricao />;
    case 'documentos':
        return <ProntuarioDocumentos />;
    case 'juridico':
        return <ProntuarioJuridico />;
    default:
      return <div>Conteúdo não encontrado.</div>;
  }
}
