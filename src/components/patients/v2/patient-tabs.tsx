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

type PatientTabsProps = {
  patient: Patient;
  professionals: ClientProfessional[];
};

export function PatientTabs({ patient, professionals }: PatientTabsProps) {
  const [value, setValue] = React.useState('overview');

  const tabs = React.useMemo(
    () => [
      { value: 'overview', label: 'Visão Geral' },
      { value: 'personal', label: 'Dados pessoais' },
      { value: 'address', label: 'Endereço & Ambiente' },
      {
        value: 'clinical',
        label: 'Clínico',
        badge: patient.clinicalSummary?.alerts?.length ?? 0,
      },
      { value: 'administrative', label: 'Administrativo' },
      { value: 'financial', label: 'Financeiro' },
      { value: 'team', label: 'Rede de apoio' },
      { value: 'documents', label: 'Documentos & Consentimentos', badge: patient.documentsCollection?.length ?? 0 },
      { value: 'history', label: 'Histórico & Auditoria', badge: patient.changeLog?.length ?? 0 },
    ],
    [patient.clinicalSummary?.alerts?.length, patient.documentsCollection?.length, patient.changeLog?.length]
  );

  return (
    <Tabs value={value} onValueChange={setValue} className="space-y-6">
      <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent px-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative rounded-none border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:border-accent-foreground data-[state=active]:text-foreground"
          >
            <span>{tab.label}</span>
            {tab.badge ? (
              <Badge variant="secondary" className="ml-2 bg-accent/80 text-accent-foreground">
                {tab.badge}
              </Badge>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>

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

      <TabsContent value="administrative">
        <TabAdministrative patient={patient} />
      </TabsContent>

      <TabsContent value="financial">
        <TabFinancial patient={patient} />
      </TabsContent>

      <TabsContent value="team">
        <TabTeam patient={patient} professionals={professionals} />
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
