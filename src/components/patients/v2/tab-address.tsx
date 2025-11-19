import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, HomeIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return 'Não informado';
  return value;
};

const formatBoolean = (value?: boolean) => {
  if (value === undefined || value === null) return 'Não informado';
  return value ? 'Sim' : 'Não';
};

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

const listCaretakers = (patient: Patient) =>
  patient.domicile?.caregivers?.length
    ? patient.domicile.caregivers
        .map((care) => `${care.name}${care.role ? ` (${care.role})` : ''}${care.schedule ? ` - ${care.schedule}` : ''}`)
        .join(' • ')
    : 'Não informado';

export function TabAddressEnvironment({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Endereço e logística
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InfoGrid
            items={[
              { label: 'Logradouro', value: `${patient.address.street}, ${patient.address.number}` },
              { label: 'Complemento', value: formatValue(patient.address.complement) },
              { label: 'Bairro', value: patient.address.neighborhood },
              { label: 'Cidade/UF', value: `${patient.address.city} / ${patient.address.state}` },
              { label: 'CEP', value: patient.address.zipCode },
              { label: 'Ponto de referência', value: formatValue(patient.address.pontoReferencia) },
              { label: 'Identificação portaria', value: formatValue(patient.address.gateIdentification) },
              { label: 'Janela de visitas', value: formatValue(patient.address.allowedVisitHours) },
              {
                label: 'Coordenadas',
                value: patient.address.geolocation
                  ? `${patient.address.geolocation.lat.toFixed(4)}, ${patient.address.geolocation.lng.toFixed(4)}`
                  : 'Não informado',
              },
              {
                label: 'ETA da equipe',
                value: patient.address.etaMinutes ? `${patient.address.etaMinutes} min` : 'Não calculado',
              },
            ]}
          />
          <InfoGrid
            items={[
              { label: 'Zona', value: formatValue(patient.address.zoneType) },
              { label: 'Condições de segurança', value: formatValue(patient.address.localSafetyConditions) },
              { label: 'Imagem da fachada', value: patient.address.facadeImageUrl ? 'Disponível' : 'Não informado' },
              { label: 'Notas de deslocamento', value: formatValue(patient.address.travelNotes) },
            ]}
          />
          {patient.address.facadeImageUrl && (
            <img
              src={patient.address.facadeImageUrl}
              alt={`Fachada do endereço de ${patient.displayName}`}
              className="w-full rounded-lg border object-cover"
            />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HomeIcon className="h-5 w-5 text-primary" />
            Estrutura física e ambiente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <InfoGrid
            items={[
              { label: 'Tipo de residência', value: formatValue(patient.domicile?.tipoResidencia) },
              { label: 'Andar', value: formatValue(patient.domicile?.floor) },
              { label: 'Possui elevador', value: formatBoolean(patient.domicile?.hasElevator) },
              { label: 'Acesso interno', value: formatValue(patient.domicile?.internalAccess) },
              {
                label: 'Recursos de acessibilidade',
                value: patient.domicile?.accessibilityFeatures?.join(', ') ?? 'Não informado',
              },
              { label: 'Local do paciente', value: formatValue(patient.domicile?.patientRoom) },
              { label: 'Banheiro adaptado', value: formatBoolean(patient.domicile?.hasAdaptedBathroom) },
              { label: 'Condições de higiene', value: formatValue(patient.domicile?.hygieneConditions) },
            ]}
          />
          <InfoGrid
            items={[
              { label: 'Infra elétrica', value: formatValue(patient.domicile?.electricalInfrastructure) },
              { label: 'Fonte de água', value: formatValue(patient.domicile?.waterSource) },
              { label: 'Backup de energia', value: formatValue(patient.domicile?.backupPowerSource) },
              { label: 'Wi-Fi disponível', value: formatBoolean(patient.domicile?.hasWifi) },
              { label: 'Acesso ambulância', value: formatValue(patient.domicile?.ambulanceAccess) },
              { label: 'Estacionamento equipe', value: formatValue(patient.domicile?.teamParking) },
              { label: 'Procedimento de entrada', value: formatValue(patient.domicile?.entryProcedure) },
              { label: 'Risco noturno', value: formatValue(patient.domicile?.nightAccessRisk) },
              {
                label: 'ETA rota assistencial',
                value: patient.domicile?.careTeamEtaMinutes
                  ? `${patient.domicile.careTeamEtaMinutes} min (${patient.domicile.etaSource ?? 'Manual'})`
                  : 'Não calculado',
              },
              { label: 'Notas logísticas', value: formatValue(patient.domicile?.logisticNotes) },
            ]}
          />
          <InfoGrid
            items={[
              { label: 'Obstáculos atuais', value: formatValue(patient.domicile?.currentObstacles) },
              { label: 'Fumantes no local', value: formatBoolean(patient.domicile?.hasSmokers) },
              { label: 'Ventilação', value: formatValue(patient.domicile?.ventilation) },
              { label: 'Nível de ruído', value: formatValue(patient.domicile?.noiseLevel) },
              { label: 'Animais', value: formatValue(patient.domicile?.pets) },
              { label: 'Cuidadores fixos', value: formatValue(patient.domicile?.fixedCaregivers) },
              {
                label: 'Outros residentes',
                value:
                  patient.domicile?.otherResidents?.length
                    ? patient.domicile.otherResidents
                        .map((resident) => `${resident.name} (${resident.relationship})`)
                        .join(', ')
                    : 'Não informado',
              },
              { label: 'Observações gerais', value: formatValue(patient.domicile?.generalObservations) },
              { label: 'Cuidadores registrados', value: listCaretakers(patient) },
              { label: 'Comportamento dos animais', value: formatValue(patient.domicile?.animalsBehavior) },
              { label: 'Notas ambientais', value: formatValue(patient.domicile?.environmentNotes) },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
