import type { Patient } from '@/lib/types';
import type { ClientProfessional } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Shield, PhoneCall } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type TabTeamProps = {
  patient: Patient;
  professionals: ClientProfessional[];
};

export function TabTeam({ patient, professionals }: TabTeamProps) {
  const keyRoles = [
    { label: 'Supervisor(a) assistencial', id: patient.adminData.supervisorId },
    { label: 'Escalista', id: patient.adminData.escalistaId },
    { label: 'Enfermeiro(a) responsável', id: patient.adminData.nurseResponsibleId },
  ];

  const resolvedRoles = keyRoles.map((role) => ({
    ...role,
    professional: professionals.find((pro) => pro.id === role.id),
  }));

  const fixedTeam = professionals.filter((pro) => pro.employmentType !== 'externo');
  const legalGuardian = patient.legalGuardian;
  const emergencyContacts = patient.emergencyContacts ?? [];

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Responsáveis principais
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolvedRoles.map((role) => (
            <div key={role.label} className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase text-muted-foreground">{role.label}</p>
              {role.professional ? (
                <div className="mt-3 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={role.professional.avatarUrl} alt={role.professional.name} />
                    <AvatarFallback>{role.professional.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{role.professional.name}</p>
                    <p className="text-muted-foreground">{role.professional.role}</p>
                    <p className="text-muted-foreground">{role.professional.phone}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Não atribuído</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Equipe fixa / escalar
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Profissional</th>
                <th className="px-4 py-3">Função</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3">Especialidades</th>
                <th className="px-4 py-3">Última atividade</th>
              </tr>
            </thead>
            <tbody>
              {fixedTeam.map((pro) => (
                <tr key={pro.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={pro.avatarUrl} alt={pro.name} />
                        <AvatarFallback>{pro.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{pro.name}</p>
                        <p className="text-xs text-muted-foreground">{pro.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{pro.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <p>{pro.phone}</p>
                    <p>{pro.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {pro.specialties.map((spec) => (
                        <Badge key={spec} variant="outline">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {pro.lastActivity ?? 'Sem registros'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="text-lg">Observações sobre cuidador e família</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-muted-foreground">Cuidadores fixos</p>
            <p className="text-base font-semibold">
              {patient.domicile?.fixedCaregivers ?? 'Não informado'}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-muted-foreground">Outros moradores</p>
            <p className="text-base font-semibold">
              {patient.domicile?.otherResidents?.length
                ? patient.domicile.otherResidents
                    .map((resident) => `${resident.name} (${resident.relationship})`)
                    .join(', ')
                : 'Não informado'}
            </p>
          </div>
          <div className="rounded-lg border border-dashed bg-accent/10 p-4">
            <p className="text-muted-foreground">Responsável familiar</p>
            <p className="text-base font-semibold">
              {patient.emergencyContacts[0]
                ? `${patient.emergencyContacts[0].name} (${patient.emergencyContacts[0].relationship})`
                : 'Não informado'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Rede familiar / permissões
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Controle de representantes legais e familiares com acesso aos dados.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              trackEvent({ eventName: 'patient_manage_access_clicked', properties: { patientId: patient.id } })
            }
          >
            Gerenciar acessos
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {legalGuardian && (
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-muted-foreground">Representante legal</p>
              <p className="text-base font-semibold text-foreground">{legalGuardian.name}</p>
              <p className="text-muted-foreground">{legalGuardian.documentType}</p>
              <p className="text-muted-foreground">{legalGuardian.document}</p>
              {legalGuardian.validityDate && (
                <p className="text-muted-foreground">
                  Válido até {new Date(legalGuardian.validityDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          )}
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full text-left text-xs uppercase text-muted-foreground">
              <thead className="bg-muted/70">
                <tr>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Permissões</th>
                  <th className="px-4 py-3">Preferências</th>
                </tr>
              </thead>
              <tbody className="text-sm text-foreground">
                {emergencyContacts.map((contact) => (
                  <tr key={contact.id ?? contact.phone} className="border-t">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-muted-foreground">{contact.relationship}</p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <PhoneCall className="h-4 w-4" />
                        {contact.phone}
                      </p>
                      {contact.email && <p className="text-muted-foreground">{contact.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.permissions?.view && <Badge variant="outline">Visualiza</Badge>}
                        {contact.permissions?.authorize && <Badge variant="outline">Autoriza</Badge>}
                        {contact.permissions?.clinical && <Badge variant="outline">Clínico</Badge>}
                        {contact.permissions?.financial && <Badge variant="outline">Financeiro</Badge>}
                        {contact.isLegalRepresentative && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            Representante
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.notificationPreferences?.map((pref) => (
                          <Badge key={pref.channel} variant={pref.enabled ? 'outline' : 'secondary'}>
                            {pref.channel.toUpperCase()}
                          </Badge>
                        )) ?? '—'}
                      </div>
                    </td>
                  </tr>
                ))}
                {!emergencyContacts.length && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhum contato cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
