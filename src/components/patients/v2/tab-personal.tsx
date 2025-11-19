import type { ReactNode } from 'react';

import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Contact2 } from 'lucide-react';

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return 'Não informado';
  return value;
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

export function TabPersonal({ patient }: { patient: Patient }) {
  const phones = patient.phones.map((phone) => {
    const tags = [];
    if (phone.preferred) tags.push('Preferencial');
    if (phone.verified) tags.push('Verificado');
    return `${phone.number}${tags.length ? ` (${tags.join(', ')})` : ''}`;
  });
  const emails = patient.emails?.map((item) => {
    const tags = [];
    if (item.preferred) tags.push('Preferencial');
    if (item.verified) tags.push('Verificado');
    return `${item.email}${tags.length ? ` (${tags.join(', ')})` : ''}`;
  });

  const documentsEntries = Object.entries(patient.documents ?? {});
  const externalIdEntries = Object.entries(patient.externalIds ?? {}).filter(([, value]) => !!value);
  const identityVerification = patient.identityVerification;
  const communicationOptOut = patient.communicationOptOut ?? [];
  const duplicates = patient.duplicateCandidates ?? [];

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Contact2 className="h-5 w-5 text-primary" />
            Identidade e documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InfoGrid
            items={[
              { label: 'Tratamento', value: patient.salutation ?? '—' },
              { label: 'Nome social', value: formatValue(patient.displayName) },
              { label: 'Pronome', value: formatValue(patient.pronouns) },
              { label: 'CPF', value: `${patient.cpf} ${patient.cpfStatus ? `(${patient.cpfStatus})` : ''}` },
              { label: 'RG', value: formatValue(patient.rg) },
              { label: 'Órgão emissor', value: formatValue(patient.rgIssuer) },
              { label: 'CNS', value: formatValue(patient.cns) },
              { label: 'Identificação nacional', value: formatValue(patient.nationalId) },
              { label: 'Sexo ao nascer', value: formatValue(patient.sexAtBirth ?? patient.sexo) },
              { label: 'Local de nascimento', value: formatValue(patient.placeOfBirth ?? patient.naturalidade) },
              {
                label: 'IDs externos ativos',
                value: externalIdEntries.length
                  ? externalIdEntries.map(([key, value]) => `${key}: ${value}`).join(' • ')
                  : 'Nenhum',
              },
            ]}
          />
          <InfoGrid
            items={[
              { label: 'Validação documental', value: patient.documentValidation?.status ?? 'Não registrado' },
              { label: 'Método de validação', value: patient.documentValidation?.method ?? '—' },
              {
                label: 'Validado por',
                value: patient.documentValidation?.validatedBy
                  ? `${patient.documentValidation.validatedBy} em ${new Date(
                      patient.documentValidation.validatedAt ?? ''
                    ).toLocaleDateString('pt-BR')}`
                  : '—',
              },
              {
                label: 'Consentimento de imagem',
                value: patient.photoConsent?.granted
                  ? `Autorizado por ${patient.photoConsent.grantedBy}`
                  : 'Não informado',
              },
              {
                label: 'Verificação de identidade',
                value: identityVerification?.status
                  ? `${identityVerification.status}${
                      identityVerification.verifiedAt ? ` em ${new Date(identityVerification.verifiedAt).toLocaleDateString('pt-BR')}` : ''
                    }`
                  : 'Não iniciada',
              },
              { label: 'Método verificação', value: identityVerification?.method ?? '—' },
            ]}
          />
          {(documentsEntries.length > 0 || patient.rgDigitalUrl) && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Arquivos anexados</p>
              <div className="flex flex-wrap gap-2">
                {documentsEntries.map(([key, url]) => (
                  <Badge key={key} variant="outline" className="border-dashed">
                    {key}: {url ? 'Disponível' : 'Pendente'}
                  </Badge>
                ))}
                <Badge variant="outline" className="border-dashed">
                  RG digital: {patient.rgDigitalUrl ? 'Disponível' : 'Não anexado'}
                </Badge>
              </div>
            </div>
          )}
          {patient.sensitiveDataConsent && (
            <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/40 p-4 text-sm text-emerald-900">
              Consentimento sensível {patient.sensitiveDataConsent.granted ? 'ativo' : 'revogado'} •{' '}
              {patient.sensitiveDataConsent.types.join(', ')} •{' '}
              {new Date(patient.sensitiveDataConsent.date).toLocaleDateString('pt-BR')}
            </div>
          )}
          {duplicates.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-sm">
              Possíveis duplicidades:{' '}
              {duplicates.map((dup) => (
                <Badge key={dup} variant="outline" className="ml-1">
                  {dup}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Contact2 className="h-5 w-5 text-primary" />
            Dados demográficos e contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InfoGrid
            items={[
              {
                label: 'Data de nascimento',
                value: patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')
                  : 'Não informado',
              },
              { label: 'Sexo', value: formatValue(patient.sexo) },
              { label: 'Identidade de gênero', value: formatValue(patient.genderIdentity) },
              { label: 'Estado civil', value: formatValue(patient.estadoCivil) },
              { label: 'Nacionalidade', value: formatValue(patient.nacionalidade) },
              { label: 'Naturalidade', value: formatValue(patient.naturalidade) },
              { label: 'Idioma preferido', value: formatValue(patient.preferredLanguage) },
              { label: 'Método de contato preferencial', value: formatValue(patient.preferredContactMethod) },
            ]}
          />
          <Separator />
          <InfoGrid
            items={[
              { label: 'Telefones', value: phones.length ? phones.join(' • ') : 'Não informado' },
              { label: 'E-mails', value: emails?.length ? emails.join(' • ') : 'Não informado' },
              {
                label: 'Opt-out de comunicações',
                value:
                  patient.communicationOptOut?.length === 0 || !patient.communicationOptOut
                    ? 'Nenhum'
                    : patient.communicationOptOut
                        .map((opt) => `${opt.type.toUpperCase()} em ${new Date(opt.date).toLocaleDateString('pt-BR')}`)
                        .join(' • '),
              },
              {
                label: 'Responsável principal',
                value: patient.emergencyContacts[0]
                  ? `${patient.emergencyContacts[0].name} (${patient.emergencyContacts[0].relationship})`
                  : 'Não informado',
              },
            ]}
          />
          {communicationOptOut.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
              Opt-outs registrados: {communicationOptOut.length}. Respeitar preferências antes de enviar comunicações.
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
