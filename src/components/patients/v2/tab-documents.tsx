import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertTriangle,
  FileCheck2,
  FileWarning,
  Filter,
  ShieldCheck,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('pt-BR');
};

const documentStatusBadge: Record<
  'valid' | 'pending' | 'expired',
  { label: string; className: string }
> = {
  valid: {
    label: 'Validado',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  pending: {
    label: 'Pendente',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  expired: {
    label: 'Vencido',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

const consentStatusBadge: Record<
  'Ativo' | 'Revogado' | 'Expirado',
  { className: string }
> = {
  Ativo: { className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  Revogado: { className: 'border-rose-200 bg-rose-50 text-rose-700' },
  Expirado: { className: 'border-amber-200 bg-amber-50 text-amber-700' },
};

const getDocumentStatus = (expiresAt?: string, verified?: boolean) => {
  if (expiresAt) {
    const expiresDate = new Date(expiresAt);
    if (!Number.isNaN(expiresDate.getTime()) && expiresDate.getTime() < Date.now()) {
      return documentStatusBadge.expired;
    }
  }
  if (!verified) {
    return documentStatusBadge.pending;
  }
  return documentStatusBadge.valid;
};

export function TabDocuments({ patient }: { patient: Patient }) {
  const documents = patient.documentsCollection ?? [];
  const consents = patient.consents ?? [];

  const totalDocuments = documents.length;
  const pendingDocuments = documents.filter((doc) => !doc.verified).length;
  const expiredDocuments = documents.filter((doc) => {
    if (!doc.expiresAt) return false;
    const exp = new Date(doc.expiresAt);
    return !Number.isNaN(exp.getTime()) && exp.getTime() < Date.now();
  });
  const expiringSoon = documents.filter((doc) => {
    if (!doc.expiresAt) return false;
    const exp = new Date(doc.expiresAt);
    if (Number.isNaN(exp.getTime()) || exp.getTime() < Date.now()) return false;
    const diff = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  const alerts = [
    expiredDocuments.length
      ? {
          title: 'Documentos vencidos',
          description: `${expiredDocuments.length} documento(s) precisam ser atualizados.`,
        }
      : null,
    expiringSoon.length
      ? {
          title: 'Validade próxima',
          description: `${expiringSoon.length} documento(s) vencem em até 30 dias.`,
        }
      : null,
    pendingDocuments
      ? {
          title: 'Validação pendente',
          description: `${pendingDocuments} documento(s) aguardam conferência manual.`,
        }
      : null,
  ].filter(Boolean) as { title: string; description: string }[];

  const sortedDocuments = [...documents].sort((a, b) =>
    a.category.localeCompare(b.category)
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileCheck2 className="h-5 w-5 text-primary" />
            Documentos & Consentimentos
          </CardTitle>
          <CardDescription>
            Centralize uploads oficiais, status de validação e rastreabilidade LGPD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Total de documentos</p>
              <p className="text-2xl font-semibold">{totalDocuments}</p>
              <p className="text-xs text-muted-foreground">
                {pendingDocuments} pendentes de validação
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Vencidos</p>
              <p className="text-2xl font-semibold text-rose-600">
                {expiredDocuments.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {expiringSoon.length} vencem em até 30 dias
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Consentimentos ativos</p>
              <p className="text-2xl font-semibold text-emerald-700">
                {consents.filter((c) => c.status === 'Ativo').length}
              </p>
              <p className="text-xs text-muted-foreground">
                {consents.length} consentimento(s) no histórico
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-muted-foreground">Auditoria</p>
              <p className="text-2xl font-semibold">
                {patient.audit.updatedBy ?? 'Equipe Conecta Care'}
              </p>
              <p className="text-xs text-muted-foreground">
                Atualizado em {formatDate(patient.audit.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload de documento
            </Button>
            <Button size="sm" variant="outline" className="text-primary">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Registrar consentimento
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar por categoria
            </Button>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {alerts.map((alert) => (
            <Alert
              key={alert.title}
              className="border-amber-200 bg-amber-50 text-amber-900 shadow-fluent"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileWarning className="h-5 w-5 text-primary" />
            Lista de documentos
          </CardTitle>
          <CardDescription>Uploads oficiais com status, validade e ações rápidas.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Documento</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Upload</th>
                <th className="px-4 py-3 font-medium">Validade</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedDocuments.map((doc) => {
                const statusConfig = getDocumentStatus(doc.expiresAt, doc.verified);
                return (
                  <tr key={doc.id} className="border-t">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                      {doc.tags && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{doc.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p>{formatDate(doc.uploadedAt)}</p>
                      <p className="text-xs">Por {doc.uploadedBy}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(doc.expiresAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <DownloadCloud className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedDocuments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Nenhum documento cadastrado para este paciente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="shadow-fluent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Consentimentos registrados
          </CardTitle>
          <CardDescription>
            Controle completo dos termos LGPD, responsáveis e escopos autorizados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum consentimento registrado para este paciente.
            </p>
          )}
          {consents.map((consent) => (
            <div
              key={consent.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-foreground">{consent.type}</p>
                <Badge
                  variant="outline"
                  className={cn('text-xs', consentStatusBadge[consent.status].className)}
                >
                  {consent.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Canal: {consent.channel}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Assinado por {consent.grantedByName} ({consent.grantedBy}) em{' '}
                {formatDate(consent.grantedAt)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {consent.scope.map((scope) => (
                  <Badge key={scope} variant="secondary" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>
              {consent.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{consent.notes}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {consent.documentId && (
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver documento
                  </Button>
                )}
                {consent.status === 'Ativo' && (
                  <Button variant="ghost" size="sm" className="text-amber-700">
                    Revogar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
