'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  IdentificationBadge,
  Scroll,
  CurrencyCircleDollar,
  DotsThreeCircle,
  FolderSimple,
  UploadSimple,
  FilePdf,
  ImageSquare,
  FileText,
  Eye,
  ArrowLineDown,
  WarningCircle,
  CheckCircle,
  Gavel,
  ShieldCheck,
  DotsThreeVertical,
  SortAscending,
  ListDashes,
  PenNib,
  HashStraight,
  CalendarX,
  User,
} from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type {
  Patient,
  PatientDocument,
  PatientDocumentCategory,
  PatientDocumentType,
} from '@/lib/types';

type DocumentSignatureStatus = 'signed' | 'pending';

type DocumentExpirationAlert = { label: string; tone: 'destructive' | 'warning' };

type EnhancedDocument = PatientDocument &
  Partial<{
    fileSizeBytes: number;
    legacy: boolean;
    signatureStatus: DocumentSignatureStatus;
    expirationAlert: DocumentExpirationAlert | null;
  }>;

type CategoryFilter = PatientDocumentCategory | 'todos';

type TabDocumentsProps = {
  patient: Patient;
  isAdmin?: boolean;
};

const CATEGORY_LABELS: Record<PatientDocumentCategory, string> = {
  Identificacao: 'Identificação',
  Juridico: 'Jurídico',
  Financeiro: 'Financeiro',
  Clinico: 'Clínico',
  Consentimento: 'Consentimento',
  Outros: 'Outros',
};

const CATEGORY_DISPLAY_LABELS: Record<CategoryFilter, string> = {
  todos: 'Todos os documentos',
  Identificacao: 'Identificação Civil',
  Juridico: 'Jurídico & Contratos',
  Financeiro: 'Financeiro',
  Clinico: 'Clínico',
  Consentimento: 'Consentimentos (LGPD)',
  Outros: 'Outros / Arquivo Morto',
};

const NAVIGATION_OPTIONS: Array<{
  id: CategoryFilter;
  label: string;
  icon: typeof IdentificationBadge;
}> = [
  { id: 'todos', label: CATEGORY_DISPLAY_LABELS.todos, icon: FolderSimple },
  { id: 'Identificacao', label: CATEGORY_DISPLAY_LABELS.Identificacao, icon: IdentificationBadge },
  { id: 'Juridico', label: CATEGORY_DISPLAY_LABELS.Juridico, icon: Gavel },
  { id: 'Financeiro', label: CATEGORY_DISPLAY_LABELS.Financeiro, icon: CurrencyCircleDollar },
  { id: 'Clinico', label: CATEGORY_DISPLAY_LABELS.Clinico, icon: Scroll },
  { id: 'Consentimento', label: CATEGORY_DISPLAY_LABELS.Consentimento, icon: ShieldCheck },
  { id: 'Outros', label: CATEGORY_DISPLAY_LABELS.Outros, icon: DotsThreeCircle },
];

const LEGACY_DOCUMENTS_CONFIG: Partial<
  Record<
    keyof Patient['documents'],
    { title: string; type: PatientDocumentType; category: PatientDocumentCategory }
  >
> = {
  termoConsentimentoUrl: {
    title: 'Termo de Consentimento',
    type: 'TermoConsentimento',
    category: 'Consentimento',
  },
  termoLgpdUrl: {
    title: 'Termo LGPD',
    type: 'TermoConsentimento',
    category: 'Consentimento',
  },
  documentoComFotoUrl: {
    title: 'Documento com Foto',
    type: 'RG',
    category: 'Identificacao',
  },
  comprovanteEnderecoUrl: {
    title: 'Comprovante de Endereço',
    type: 'ComprovanteResidencia',
    category: 'Identificacao',
  },
  fichaAvaliacaoEnfermagemUrl: {
    title: 'Ficha de Avaliação de Enfermagem',
    type: 'RelatorioTecnico',
    category: 'Outros',
  },
  planoCuidadoUrl: {
    title: 'Plano de Cuidado',
    type: 'RelatorioTecnico',
    category: 'Outros',
  },
  protocoloAuditoriaUrl: {
    title: 'Protocolo de Auditoria',
    type: 'POA',
    category: 'Juridico',
  },
};

const EXPIRING_SOON_DAYS = 15;

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || Number.isNaN(bytes)) return '—';
  const thresh = 1024;
  if (bytes < thresh) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let u = -1;
  let size = bytes;
  do {
    size /= thresh;
    ++u;
  } while (size >= thresh && u < units.length - 1);
  return `${size.toFixed(1)} ${units[u]}`;
};

const guessMimeType = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return 'application/octet-stream';
  if (ext === 'pdf') return 'application/pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  return 'application/octet-stream';
};

const extractFileName = (url: string, fallback: string) => {
  try {
    const splitted = url.split('/');
    return splitted[splitted.length - 1] || `${fallback.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  } catch {
    return `${fallback.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  }
};

const getSignatureStatusFromTags = (tags?: string[]): DocumentSignatureStatus | undefined => {
  if (!tags?.length) return undefined;
  const normalized = tags.map((tag) => tag.toLowerCase());
  if (
    normalized.some(
      (tag) =>
        tag.includes('signature:completed') ||
        tag.includes('signature:signed') ||
        tag.includes('assinatura:concluida'),
    )
  ) {
    return 'signed';
  }
  if (
    normalized.some(
      (tag) =>
        tag.includes('signature:pending') ||
        tag.includes('assinatura:pendente') ||
        tag.includes('awaiting-signature'),
    )
  ) {
    return 'pending';
  }
  return undefined;
};

const getExpirationAlert = (expiresAt?: string) => {
  if (!expiresAt) return null;
  const expiresDate = new Date(expiresAt);
  if (Number.isNaN(expiresDate.getTime())) return null;
  const diffDays = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return { label: 'Vencido', tone: 'destructive' as const };
  }
  if (diffDays <= EXPIRING_SOON_DAYS) {
    return { label: `Vence em ${diffDays} dia(s)`, tone: 'warning' as const };
  }
  return null;
};

const getFileVisual = (doc: PatientDocument) => {
  const mime = doc.mimeType.toLowerCase();
  if (mime.includes('pdf')) {
    return {
      icon: FilePdf,
      wrapper: 'border border-rose-100 bg-rose-50 text-rose-600',
    };
  }
  if (mime.startsWith('image/')) {
    return {
      icon: ImageSquare,
      wrapper: 'border border-sky-100 bg-sky-50 text-sky-600',
    };
  }
  return {
    icon: FileText,
    wrapper: 'border border-slate-200 bg-slate-100 text-slate-600',
  };
};

const normalizeLegacyDocuments = (patient: Patient): EnhancedDocument[] => {
  const legacySource = patient.documents ?? {};
  return Object.entries(LEGACY_DOCUMENTS_CONFIG).flatMap(([key, config]) => {
    if (!config) return [];
    const url = (legacySource as Record<string, string | undefined>)[key];
    if (!url) return [];
    const fileName = extractFileName(url, config.title);
    return [
      {
        id: `legacy-${key}`,
        title: config.title,
        description: undefined,
        type: config.type,
        category: config.category,
        fileUrl: url,
        fileName,
        mimeType: guessMimeType(fileName),
        uploadedBy: patient.audit.createdBy ?? 'Sistema',
        uploadedAt: patient.audit.createdAt,
        verified: true,
        source: 'upload',
        tags: ['legacy'],
        legacy: true,
        expirationAlert: null,
      } satisfies EnhancedDocument,
    ];
  });
};

export function TabDocuments({ patient, isAdmin = false }: TabDocumentsProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todos');
  const [isDragging, setIsDragging] = useState(false);
  const [localUploads, setLocalUploads] = useState<string[]>([]);

  const normalizedDocuments = useMemo<EnhancedDocument[]>(() => {
    const collectionDocs =
      patient.documentsCollection?.map((doc) => ({
        ...doc,
        category: doc.category ?? 'Outros',
        signatureStatus: getSignatureStatusFromTags(doc.tags),
        expirationAlert: getExpirationAlert(doc.expiresAt),
      })) ?? [];
    return [...collectionDocs, ...normalizeLegacyDocuments(patient)];
  }, [patient]);

  const orderedDocuments = useMemo(
    () =>
      [...normalizedDocuments].sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      ),
    [normalizedDocuments],
  );

  const filteredDocuments = useMemo(() => {
    if (selectedCategory === 'todos') return orderedDocuments;
    return orderedDocuments.filter((doc) => doc.category === selectedCategory);
  }, [orderedDocuments, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      todos: normalizedDocuments.length,
      Identificacao: 0,
      Juridico: 0,
      Financeiro: 0,
      Clinico: 0,
      Consentimento: 0,
      Outros: 0,
    };
    normalizedDocuments.forEach((doc) => {
      const category = (
        ['Identificacao', 'Juridico', 'Financeiro', 'Clinico', 'Consentimento', 'Outros'] as const
      ).includes(doc.category)
        ? doc.category
        : 'Outros';
      counts[category] += 1;
    });
    return counts;
  }, [normalizedDocuments]);

  const auditCounts = useMemo(() => {
    let expired = 0;
    let pending = 0;
    normalizedDocuments.forEach((doc) => {
      if (doc.expirationAlert?.tone === 'destructive') expired += 1;
      if (!doc.verified) pending += 1;
    });
    return { expired, pending, attention: expired + pending };
  }, [normalizedDocuments]);

  const categoryAlerts = useMemo(() => {
    const alerts: Partial<Record<CategoryFilter, boolean>> = {};
    normalizedDocuments.forEach((doc) => {
      if (doc.expirationAlert || !doc.verified) {
        const category = (
          ['Identificacao', 'Juridico', 'Financeiro', 'Clinico', 'Consentimento', 'Outros'] as const
        ).includes(doc.category)
          ? doc.category
          : 'Outros';
        alerts[category] = true;
      }
    });
    return alerts;
  }, [normalizedDocuments]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length) {
      setLocalUploads(files.map((file) => file.name));
    }
  }, []);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setLocalUploads(files.map((file) => file.name));
  }, []);

  const activeCategoryLabel = CATEGORY_DISPLAY_LABELS[selectedCategory];

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:w-72">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-fluent">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Pastas Digitais</p>
          <ul className="space-y-1">
            {NAVIGATION_OPTIONS.map((option) => {
              const isActive = selectedCategory === option.id;
              const Icon = option.icon;
              const hasAlert = option.id !== 'todos' && categoryAlerts[option.id];
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(option.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-left text-sm font-medium text-slate-600 transition',
                      isActive && 'border-l-4 border-l-[#0F2B45] bg-slate-50 text-[#0F2B45]',
                      !isActive && 'hover:bg-slate-100 hover:text-[#0F2B45]',
                    )}
                  >
                    <Icon size={18} weight={isActive ? 'fill' : 'regular'} className="text-[#0F2B45]" />
                    <span className="flex-1">{option.label}</span>
                    <span
                      className={cn(
                        'rounded px-2 py-0.5 text-[10px] font-bold',
                        hasAlert ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600',
                      )}
                    >
                      {hasAlert ? '!' : categoryCounts[option.id] ?? 0}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Auditoria</p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="flex items-center gap-2 font-semibold">
                <WarningCircle size={16} />
                Vencidos / Pendentes
                <span className="ml-auto rounded bg-white/80 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  {auditCounts.attention}
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-700">
                {auditCounts.expired} vencidos • {auditCounts.pending} pendentes
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 space-y-4">
        <div>
          <label
            htmlFor="document-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'group flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/70 px-8 py-10 text-center text-slate-600 shadow-fluent transition',
              isDragging && 'border-[#0F2B45] bg-sky-50 text-[#0F2B45] shadow-lg',
            )}
          >
            <div className="rounded-full border border-slate-200 bg-white p-3 text-slate-400 transition group-hover:border-[#0F2B45] group-hover:text-[#0F2B45]">
              <UploadSimple size={28} weight="duotone" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Arraste documentos aqui ou <span className="text-[#0F2B45] underline">clique para buscar</span>
            </p>
            <p className="text-xs text-slate-500">PDF, JPG ou PNG (máx. 10MB). Detectaremos a categoria automaticamente.</p>
            <Button size="sm" variant="outline" className="gap-2">
              <UploadSimple size={16} />
              Selecionar arquivos
            </Button>
            <input
              id="document-upload"
              type="file"
              multiple
              className="sr-only"
              onChange={handleFileInputChange}
            />
          </label>
          {localUploads.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {localUploads.map((fileName) => (
                <Badge key={fileName} variant="secondary" className="border border-slate-200 bg-white text-xs text-slate-600">
                  {fileName}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categoria ativa</p>
            <h3 className="text-sm font-bold text-[#0F2B45]">
              {selectedCategory === 'todos'
                ? `Documentos gerais (${filteredDocuments.length})`
                : `Documentos de ${activeCategoryLabel} (${filteredDocuments.length})`}
            </h3>
          </div>
          <div className="flex gap-2 text-xs font-semibold text-slate-500">
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-slate-100 hover:text-[#0F2B45]"
            >
              <SortAscending size={14} />
              Recentes
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-slate-100 hover:text-[#0F2B45]"
            >
              <ListDashes size={14} />
              Lista
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.length === 0 && (
            <Card className="shadow-fluent md:col-span-2 xl:col-span-3">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <WarningCircle size={28} />
                Nenhum documento nesta categoria.
              </CardContent>
            </Card>
          )}

          {filteredDocuments.map((doc) => {
            const { icon: Icon, wrapper } = getFileVisual(doc);
            const verificationBadge = doc.verified
              ? { label: 'Validado', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
              : { label: 'Pendente', className: 'border-amber-200 bg-amber-50 text-amber-800' };
            const expirationAlert = doc.expirationAlert ?? getExpirationAlert(doc.expiresAt);
            const signatureStatus = doc.signatureStatus;
            const requiresAttention = !doc.verified || expirationAlert?.tone === 'destructive';
            const fileTitle = doc.title || doc.fileName;
            const showAdminActions = !doc.verified && isAdmin;
            return (
              <div
                key={doc.id}
                className={cn(
                  'flex h-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-fluent transition hover:-translate-y-0.5 hover:shadow-lg',
                  requiresAttention && 'border-l-4 border-l-amber-400',
                  expirationAlert?.tone === 'destructive' && 'border-l-4 border-l-rose-400',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-md text-xl text-slate-600', wrapper)}>
                    <Icon size={22} weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{fileTitle}</p>
                        <p className="text-[12px] text-slate-500">{doc.fileName}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-[#0F2B45]">
                        <DotsThreeVertical size={18} weight="bold" />
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase">
                      {doc.legacy && (
                        <Badge variant="secondary" className="border border-slate-200 bg-slate-50 text-slate-600">
                          Legado
                        </Badge>
                      )}
                      <Badge variant="outline" className={cn('border text-[10px]', verificationBadge.className)}>
                        {verificationBadge.label}
                      </Badge>
                      {signatureStatus && (
                        <Badge
                          variant="outline"
                          className={cn(
                            'border text-[10px]',
                            signatureStatus === 'signed'
                              ? 'border-sky-200 bg-sky-50 text-sky-700'
                              : 'border-amber-200 bg-amber-50 text-amber-700',
                          )}
                        >
                          {signatureStatus === 'signed' ? 'Assinado digitalmente' : 'Aguardando assinatura'}
                        </Badge>
                      )}
                      {expirationAlert && (
                        <Badge
                          variant="outline"
                          className={cn(
                            'border text-[10px]',
                            expirationAlert.tone === 'destructive'
                              ? 'border-rose-200 bg-rose-50 text-rose-700'
                              : 'border-amber-200 bg-amber-50 text-amber-800',
                          )}
                        >
                          {expirationAlert.label}
                        </Badge>
                      )}
                      <span className="text-[10px] font-semibold text-slate-400">{formatFileSize(doc.fileSizeBytes)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    Enviado por <span className="font-semibold">{doc.uploadedBy || 'Equipe Conecta Care'}</span> em{' '}
                    {formatDate(doc.uploadedAt)}
                  </div>
                  {doc.expiresAt && (
                    <div className="flex items-center gap-2">
                      <CalendarX
                        size={14}
                        className={cn(expirationAlert?.tone === 'destructive' ? 'text-rose-500' : 'text-slate-400')}
                      />
                      Validade: <span className="font-semibold">{formatDate(doc.expiresAt)}</span>
                    </div>
                  )}
                  {signatureStatus === 'signed' && (
                    <div className="flex items-center gap-2">
                      <PenNib size={14} className="text-slate-400" />
                      Assinado digitalmente
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <HashStraight size={14} className="text-slate-400" />
                    {CATEGORY_LABELS[doc.category] ?? CATEGORY_LABELS.Outros}
                  </div>
                </div>

                {doc.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">{doc.description}</p>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="outline" className="gap-2 border-slate-200 text-slate-700 hover:text-[#0F2B45]">
                    <Eye size={16} />
                    Visualizar
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-2 text-slate-500 hover:text-[#0F2B45]">
                    <ArrowLineDown size={16} />
                    Download
                  </Button>
                </div>

                {showAdminActions && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                      <CheckCircle size={16} weight="fill" />
                      Validar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      <WarningCircle size={16} />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
