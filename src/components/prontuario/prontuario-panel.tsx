'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ProntuarioDashboard } from '@/components/prontuario/prontuario-dashboard';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { ProntuarioUploadDialog } from '../prontuario/prontuario-upload-dialog';
import type { EditMode } from '@/app/(app)/patients/[patientId]/page';

interface ProntuarioPanelProps {
  patient: Patient | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProntuarioPanel({ patient, isOpen, onOpenChange }: ProntuarioPanelProps) {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [editedData, setEditedData] = React.useState<Patient | null>(null);

  React.useEffect(() => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient)));
    }
  }, [patient]);

  if (!patient) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col bg-muted/30 shadow-lg">
           <SheetHeader className="p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                    <SheetTitle className="text-2xl font-bold">
                        Prontuário de {patient.displayName}
                    </SheetTitle>
                    <SheetDescription>
                        Timeline, medicações e documentos do paciente.
                    </SheetDescription>
                </div>
                <Button onClick={() => setIsUploadOpen(true)}><Upload className="w-4 h-4 mr-2"/> Anexar Documento</Button>
              </div>
            </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
             <ProntuarioDashboard 
                editMode={'none' as EditMode} // No edit mode for now in prontuario panel
                setEditMode={() => {}}
                editedData={editedData}
                setEditedData={setEditedData}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ProntuarioUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </>
  );
}
