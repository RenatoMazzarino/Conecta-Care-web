'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { ProntuarioUploadDialog } from '../prontuario/prontuario-upload-dialog';
import { ProntuarioContent, prontuarioTabs } from './prontuario-tabs';
import type { ProntuarioEditMode } from './prontuario-dashboard';
import { cn } from '@/lib/utils';

interface ProntuarioPanelProps {
  patient: Patient | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const tabPanelBackgrounds = [
  'bg-sky-50 text-sky-900',
  'bg-pink-50 text-pink-900',
  'bg-emerald-50 text-emerald-900',
  'bg-amber-50 text-amber-900',
  'bg-violet-50 text-violet-900',
  'bg-blue-50 text-blue-900',
  'bg-rose-50 text-rose-900',
];

const panelSurfaceBackgrounds = [
  'bg-sky-50',
  'bg-pink-50',
  'bg-emerald-50',
  'bg-amber-50',
  'bg-violet-50',
  'bg-blue-50',
  'bg-rose-50',
];

const tabAccentStrips = [
  'bg-sky-500',
  'bg-pink-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-blue-500',
  'bg-rose-500',
];

const tabBase =
  'group relative text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary';

export function ProntuarioPanel({ patient, isOpen, onOpenChange }: ProntuarioPanelProps) {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [editedData, setEditedData] = React.useState<Patient | null>(null);
  const [activeTab, setActiveTab] = React.useState(prontuarioTabs[0].id);
  const [editMode, setEditMode] = React.useState<ProntuarioEditMode>('none');

  React.useEffect(() => {
    if (patient) {
      setEditedData(JSON.parse(JSON.stringify(patient)));
    }
  }, [patient]);

  React.useEffect(() => {
    if (!isOpen) {
      setActiveTab(prontuarioTabs[0].id);
      setEditMode('none');
    }
  }, [isOpen]);

  if (!patient) return null;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setEditMode('none');
  };

  const activeIndex = Math.max(prontuarioTabs.findIndex((tab) => tab.id === activeTab), 0);
  const contentBgClass = tabPanelBackgrounds[activeIndex] ?? 'bg-white';
  const panelBgClass = panelSurfaceBackgrounds[activeIndex] ?? 'bg-white';

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className={cn('w-full sm:max-w-[95vw] lg:max-w-[90vw] xl-max-w-[85vw] p-0 flex flex-col border-none shadow-none overflow-hidden', panelBgClass)}>
          <SheetHeader className="px-6 pt-4 pb-3 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold">Prontuário de {patient.displayName}</SheetTitle>
                <SheetDescription>Organização completa das evoluções, agendas e documentos do paciente.</SheetDescription>
              </div>
              <Button onClick={() => setIsUploadOpen(true)}>
                <Upload className="w-4 h-4 mr-2" /> Anexar Documento
              </Button>
            </div>
          </SheetHeader>

          <div className="-mt-4 flex flex-1 overflow-hidden z-10 px-0 pb-0">
            <div className="relative flex-1 pl-8 pr-4 sm:pl-10 sm:pr-6 py-0 z-20 bg-transparent overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col gap-0 items-start absolute left-0 top-[-10px] hidden lg:flex z-50">
                {prontuarioTabs.map((tab, index) => {
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={cn(
                        tabBase,
                        'w-12 h-32 rounded-l-[30px] border relative overflow-hidden justify-center transition-none',
                        index > 0 && '-mt-4',
                        `${tabPanelBackgrounds[index % tabPanelBackgrounds.length]} border-transparent`,
                      )}
                      style={{ zIndex: activeTab === tab.id ? 100 : 40 - index }}
                    >
                      <span
                        className={cn('absolute left-0 top-0 h-full w-2', tabAccentStrips[index % tabAccentStrips.length])}
                        aria-hidden
                      />
                      <div className="flex items-center gap-1 text-xs font-semibold select-none pl-2" style={{ transform: 'rotate(-90deg)' }}>
                        <tab.icon className="w-4 h-4 opacity-80 shrink-0" />
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className={cn('flex-1 min-h-full ml-2 sm:ml-4 -mt-4 bg-white pr-0 sm:pr-0', contentBgClass)}>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto pl-6 pr-2 sm:pl-8 sm:pr-4 py-6">
                    <ProntuarioContent
                      tabId={activeTab}
                      editMode={editMode}
                      setEditMode={setEditMode}
                      editedData={editedData}
                      setEditedData={setEditedData}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t bg-white px-4 py-3 flex gap-2 overflow-x-auto lg:hidden">
            {prontuarioTabs.map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <button
        type="button"
        className="fixed top-4 left-4 z-50 rounded-full bg-white text-slate-600 shadow-lg border border-slate-200 hover:text-slate-900 transition-colors"
        onClick={() => onOpenChange(false)}
      >
        <span className="sr-only">Fechar prontuário</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 p-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>

      <ProntuarioUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </>
  );
}
