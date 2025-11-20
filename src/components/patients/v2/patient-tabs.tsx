'use client';

import * as React from 'react';

import type { Patient } from '@/lib/types';
import type { ClientProfessional } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TabGeneral } from './tab-general';
import { TabPersonal } from './tab-personal';
import { TabAddressEnvironment } from './tab-address';
import { TabClinical } from './tab-clinical';
import { TabAdministrative } from './tab-administrative';
import { TabFinancial } from './tab-financial';
import { TabTeam } from './tab-team';
import { TabDocuments } from './tab-documents';
import { TabHistoryAudit } from './tab-history-audit';
import { TabInventory } from './tab-inventory';
import { PatientHeader } from './patient-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsThree } from '@phosphor-icons/react';

type PatientTabsProps = {
  patient: Patient;
  professionals: ClientProfessional[];
  onSave?: (formData: FormData) => Promise<unknown>;
  withHeader?: boolean;
};

export function PatientTabs({ patient, professionals, onSave, withHeader }: PatientTabsProps) {
  const [value, setValue] = React.useState('overview');

  const tabs = React.useMemo(
    () => [
      { value: 'overview', label: 'Visão Geral' },
      { value: 'personal', label: 'Dados Pessoais' },
      { value: 'address', label: 'Endereço' },
      {
        value: 'clinical',
        label: 'Dados Clínicos',
        badge: patient.clinicalSummary?.alerts?.length ?? 0,
      },
      { value: 'team', label: 'Rede de Apoio' },
      { value: 'inventory', label: 'Estoque' },
      { value: 'administrative', label: 'Administrativo' },
      { value: 'financial', label: 'Financeiro' },
      { value: 'documents', label: 'Documentos Adm./Jur.', badge: patient.documentsCollection?.length ?? 0 },
      { value: 'history', label: 'Histórico', badge: patient.changeLog?.length ?? 0 },
    ],
    [patient.clinicalSummary?.alerts?.length, patient.documentsCollection?.length, patient.changeLog?.length]
  );

  const visibleTabs = tabs.slice(0, 7);
  const overflowTabs = tabs.slice(7);

  const tabsList = (
    <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-slate-200 bg-transparent px-0">
      {visibleTabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="relative rounded-none border-b-2 border-transparent px-2 pb-3 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 data-[state=active]:border-[#0F2B45] data-[state=active]:text-slate-900"
        >
          <span>{tab.label}</span>
          {tab.badge ? (
            <Badge variant="secondary" className="ml-2 bg-[#D46F5D]/10 text-[#D46F5D]">
              {tab.badge}
            </Badge>
          ) : null}
        </TabsTrigger>
      ))}
      {overflowTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2 text-slate-600 hover:text-slate-900">
              <DotsThree weight="bold" className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[180px]">
            {overflowTabs.map((tab) => (
              <DropdownMenuItem
                key={tab.value}
                onClick={() => setValue(tab.value)}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{tab.label}</span>
                {tab.badge ? (
                  <Badge variant="secondary" className="bg-[#D46F5D]/10 text-[#D46F5D]">
                    {tab.badge}
                  </Badge>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </TabsList>
  );

  const header = withHeader ? <PatientHeader patient={patient} onSave={onSave} tabsList={tabsList} /> : tabsList;

  return (
    <Tabs value={value} onValueChange={setValue} className="space-y-6">
      {header}

      <TabsContent value="overview">
        <TabGeneral patient={patient} />
      </TabsContent>

      <TabsContent value="personal">
        <TabPersonal patient={patient} />
      </TabsContent>

      <TabsContent value="address">
        <TabAddressEnvironment patient={patient} />
      </TabsContent>

      <TabsContent value="clinical">
        <TabClinical patient={patient} />
      </TabsContent>

      <TabsContent value="team">
        <TabTeam patient={patient} professionals={professionals} />
      </TabsContent>

      <TabsContent value="inventory">
        <TabInventory />
      </TabsContent>

      <TabsContent value="administrative">
        <TabAdministrative patient={patient} />
      </TabsContent>

      <TabsContent value="financial">
        <TabFinancial patient={patient} paymentTransactions={patient.paymentTransactions} />
      </TabsContent>

      <TabsContent value="documents">
        <TabDocuments patient={patient} />
      </TabsContent>

      <TabsContent value="history">
        <TabHistoryAudit patient={patient} />
      </TabsContent>
    </Tabs>
  );
}
