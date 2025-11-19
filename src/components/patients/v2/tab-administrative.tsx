import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';
import { ClipboardList, ClipboardSignature } from 'lucide-react';

const InfoGrid = ({ items }: { items: { label: string; value: ReactNode }[] }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {items.map((item) => (
      <div key={item.label} className="rounded-lg border border-border/70 bg-white p-4 text-sm shadow-sm">
        <p className="text-muted-foreground">{item.label}</p>
        <p className="mt-1 font-semibold text-foreground">{item.value}</p>
      </div>
    ))}
  </div>
);

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return 'Não informado';
  return value;
};

export function TabAdministrative({ patient }: { patient: Patient }) {
  const admin = patient.adminData;

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Parâmetros administrativos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InfoGrid
            items={[
              { label: 'Status', value: admin.status },
              { label: 'Tipo de admissão', value: formatValue(admin.admissionType) },
              { label: 'Complexidade', value: admin.complexity },
              { label: 'Pacote de serviço', value: admin.servicePackage },
              { label: 'Frequência', value: formatValue(admin.frequency) },
              { label: 'Área de operação', value: formatValue(admin.operationArea) },
              { label: 'Origem da admissão', value: formatValue(admin.admissionSource) },
              { label: 'Contrato', value: formatValue(admin.contractId) },
              {
                label: 'Início',
                value: admin.startDate ? new Date(admin.startDate).toLocaleDateString('pt-BR') : 'Não informado',
              },
              {
                label: 'Término',
                value: admin.endDate ? new Date(admin.endDate).toLocaleDateString('pt-BR') : 'Contrato ativo',
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardSignature className="h-5 w-5 text-primary" />
            Responsáveis internos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <InfoGrid
            items={[
              { label: 'Supervisor(a)', value: formatValue(admin.supervisorId) },
              { label: 'Escalista', value: formatValue(admin.escalistaId) },
              { label: 'Enfermeiro responsável', value: formatValue(admin.nurseResponsibleId) },
              {
                label: 'Última auditoria',
                value: admin.lastAuditDate
                  ? `${new Date(admin.lastAuditDate).toLocaleDateString('pt-BR')} por ${admin.lastAuditBy ?? 'Equipe'}`
                  : 'Nunca auditado',
              },
            ]}
          />
          <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4 text-sm">
            <p className="text-muted-foreground">Notas internas</p>
            <p className="text-foreground">{admin.notesInternal ?? 'Sem notas registradas.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
