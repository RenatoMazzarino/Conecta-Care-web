
import { LucideIcon } from 'lucide-react';

export type Diagnosis = {
  name: string;
  code?: string;
};

export type ShiftType = 'diurno' | 'noturno';

export type PatientDocumentType =
  | 'RG'
  | 'CPF'
  | 'CNH'
  | 'ComprovanteResidencia'
  | 'CarteirinhaPlano'
  | 'ContratoPrestacaoServicos'
  | 'AditivoContrato'
  | 'LaudoMedico'
  | 'RelatorioTecnico'
  | 'ReceitaMedica'
  | 'TermoConsentimento'
  | 'TermoResponsabilidade'
  | 'POA'
  | 'Outro';

export type PatientDocumentCategory =
  | 'Identificacao'
  | 'Financeiro'
  | 'Clinico'
  | 'Juridico'
  | 'Consentimento'
  | 'Outros';

export type PatientDocumentSource =
  | 'upload'
  | 'integracao'
  | 'assinaturaDigital'
  | 'importacao';

export type PatientDocument = {
  id: string;
  type: PatientDocumentType;
  category: PatientDocumentCategory;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresAt?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  source: PatientDocumentSource;
  tags?: string[];
  hash?: string;
};

export type PatientConsentType =
  | 'TratamentoDadosLGPD'
  | 'CompartilhamentoComOperadora'
  | 'CompartilhamentoComFamiliares'
  | 'EnvioComunicacoesWhatsApp'
  | 'AutorizacaoProcedimentoInvasivo'
  | 'AutorizacaoPublicacaoImagem'
  | 'Outro';

export type PatientConsentScope =
  | 'DadosClinicos'
  | 'DadosFinanceiros'
  | 'DadosAdministrativos'
  | 'EnvioComunicacoes'
  | 'CompartilhamentoComTerceiros'
  | 'Imagem'
  | 'Outros';

export type PatientConsentStatus = 'Ativo' | 'Revogado' | 'Expirado';

export type PatientConsentChannel = 'AssinaturaDigital' | 'Upload' | 'Aplicativo' | 'Manual';

export type PatientConsent = {
  id: string;
  type: PatientConsentType;
  scope: PatientConsentScope[];
  status: PatientConsentStatus;
  grantedAt: string;
  revokedAt?: string;
  channel: PatientConsentChannel;
  documentId?: string;
  grantedBy: 'Paciente' | 'ResponsavelLegal' | 'Tutor' | 'Outro';
  grantedByName: string;
  grantedByDocument?: string;
  relatedLegalResponsibleId?: string;
  notes?: string;
};

export type SmartFieldScore = {
  value: number;
  label: string;
  lastUpdatedAt?: string;
  lastSurveyAt?: string;
  surveyId?: string;
  source?: string;
};

export type SmartFieldIncidents = {
  count: number;
  lastIncidentAt?: string;
};

export type PatientSmartFields = Partial<{
  readmissionRiskScore: SmartFieldScore;
  careAdherenceScore: SmartFieldScore;
  familySatisfactionScore: SmartFieldScore;
  incidentsLast30Days: SmartFieldIncidents;
  environmentAdequacyScore: SmartFieldScore;
}>;

export type PatientOperationalLinks = Partial<{
  contractId: string;
  rosterId: string;
  inventoryId: string;
  publicProtocolUrl: string;
  accessLogRef: string;
}>;

export type PatientExternalIds = {
  crmId?: string;
  susId?: string;
  contractId?: string;
  [key: string]: string | undefined;
};

export type PatientIdentityVerification = {
  status: 'none' | 'pending' | 'verified';
  method?: 'ocr' | 'manual' | 'ocr_manual';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
};

export type PatientSensitiveConsent = {
  granted: boolean;
  types: Array<'medical' | 'photo' | 'financial' | string>;
  date: string;
  grantedBy: string;
};

export type PatientAccessLogSummary = {
  totalViews: number;
  totalExports: number;
  lastAccessAt?: string;
  lastAccessBy?: string;
};

export type PatientAuditLogType =
  | 'view'
  | 'edit'
  | 'export'
  | 'download'
  | 'login_as_family'
  | 'status_change';

export type PatientAuditOrigin = 'web' | 'mobile' | 'api' | 'integration';

export type PatientAuditLog = {
  id: string;
  patientId: string;
  type: PatientAuditLogType;
  action: string;
  userId: string;
  userRole: string;
  timestamp: string;
  origin: PatientAuditOrigin;
  ip?: string;
  changedFields?: string[];
  oldValue?: string;
  newValue?: string;
  meta?: Record<string, unknown>;
};

export type Patient = {
  // 1. Dados Pessoais
  id: string;
  salutation?: 'Sr.' | 'Sra.' | 'Dr.' | 'Dra.';
  firstName: string;
  lastName: string;
  name: string;
  displayName: string;
  initials: string;
  pronouns?: string;
  avatarUrl: string;
  avatarHint: string;
  photoConsent?: {
    granted: boolean;
    grantedBy: string;
    date: string;
  };
  
  // Documentos
  cpf: string;
  cpfStatus?: 'valid' | 'invalid' | 'unknown';
  rg?: string;
  rgIssuer?: string;
  rgDigitalUrl?: string;
  cns?: string;
  nationalId?: string; // Para estrangeiros
  documentValidation?: {
    status: 'none' | 'pending' | 'validated';
    validatedBy?: string;
    validatedAt?: string;
    method?: 'ocr' | 'manual';
  };
  identityVerification?: PatientIdentityVerification;
  externalIds?: PatientExternalIds;

  // Demográfico
  dateOfBirth: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  sexAtBirth?: 'Masculino' | 'Feminino' | 'Outro' | 'Desconhecido';
  genderIdentity?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  naturalidade?: string; // representa placeOfBirth
  placeOfBirth?: string;
  preferredLanguage?: 'Português' | 'Inglês' | 'Espanhol' | string;
  riskFlags?: string[];
  recordStatus?: 'active' | 'inactive' | 'deceased';
  sensitiveDataConsent?: PatientSensitiveConsent;
  duplicateCandidates?: string[];

  // Contato
  phones: {
    type: 'mobile' | 'home' | 'work';
    number: string;
    verified: boolean;
    preferred: boolean;
  }[];
  emails?: {
    email: string;
    verified: boolean;
    preferred: boolean;
  }[];
  preferredContactMethod?: 'Telefone' | 'WhatsApp' | 'Email';
  communicationOptOut?: {
    type: 'sms' | 'email' | 'whatsapp';
    optedOut: boolean;
    date: string;
  }[];

  // Contatos de Emergência & Responsáveis
  emergencyContacts: {
    id?: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    isLegalRepresentative?: boolean;
    permissions?: {
      view: boolean;
      authorize: boolean;
      clinical?: boolean;
      financial?: boolean;
    };
    documentUrl?: string;
    notificationPreferences?: {
      channel: 'sms' | 'email' | 'whatsapp';
      enabled: boolean;
    }[];
    appUserId?: string;
  }[];
  legalGuardian?: {
    name: string;
    document: string;
    documentType: 'Procuração' | 'Curatela';
    validityDate?: string;
    powerOfAttorneyUrl?: string;
  };


  // 2. Endereço e Ambiente Domiciliar
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    pontoReferencia?: string;
    geolocation?: { lat: number; lng: number };
    zoneType?: 'Urbana' | 'Rural' | 'Condomínio Fechado';
    gateIdentification?: string;
    allowedVisitHours?: string;
    localSafetyConditions?: string;
    facadeImageUrl?: string;
    etaMinutes?: number;
    travelNotes?: string;
  };
  
  domicile?: {
    tipoResidencia?: 'Casa' | 'Apartamento' | 'Chácara' | 'Instituição';
    floor?: number;
    hasElevator?: boolean;
    internalAccess?: string;
    accessibilityFeatures?: string[];
    patientRoom?: string;
    electricalInfrastructure?: string;
    waterSource?: 'Rede Pública' | 'Poço' | 'Cisterna';
    hasWifi?: boolean;
    backupPowerSource?: 'Gerador' | 'Nobreak' | 'Inexistente';
    hasAdaptedBathroom?: boolean;
    ambulanceAccess?: 'Fácil' | 'Médio' | 'Difícil';
    teamParking?: 'Disponível' | 'Restrito' | 'Inexistente';
    entryProcedure?: string;
    nightAccessRisk?: 'Baixo' | 'Médio' | 'Alto';
    currentObstacles?: string;
    pets?: string;
    otherResidents?: { name: string; relationship: string }[];
    fixedCaregivers?: string;
    caregivers?: { name: string; schedule?: string; role?: string }[];
    hygieneConditions?: 'Boa' | 'Regular' | 'Ruim';
    environmentalRisks?: string;
    hasSmokers?: boolean;
    ventilation?: 'Adequada' | 'Insuficiente' | 'Artificial';
    noiseLevel?: 'Baixo' | 'Médio' | 'Alto';
    generalObservations?: string;
    careTeamEtaMinutes?: number;
    etaSource?: string;
    logisticNotes?: string;
    animalsBehavior?: string;
    environmentNotes?: string;
  };


  // 3. Dados Clínicos e Assistenciais
  clinicalSummary: {
    diagnosisPrimary: { name: string; cid: string };
    allergies: {
      substance: string;
      severity: 'leve' | 'moderada' | 'grave';
      reaction: string;
      recordedAt: string;
    }[];
    criticalMedications: { name: string; note: string }[];
    devicesActive: string[];
    oxygenTherapy: {
      active: boolean;
      flow?: string;
    };
    riskScores: {
      falls?: number;
      fallsLabel?: string;
      braden?: number;
      bradenLabel?: string;
    };
    lastReview: {
      date: string;
      by: string;
    };
    shortNote?: string;
    alerts: {
      type: 'ALERGIA' | 'RISCO_QUEDA' | 'MEDICAMENTO';
      message: string;
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
  };

  clinicalSummaryMeta: {
    lastUpdatedAt: string;
    lastUpdatedBy: string;
    source: 'prontuario' | 'manual';
  };

  clinicalData?: {
    medications?: {
      name: string;
      dosage: string;
      frequency: string;
      notes?: string;
    }[];
  };
  
  // 4. Dados Administrativos
  adminData: {
    status: 'Ativo' | 'Inativo' | 'Suspenso' | 'Alta' | 'Internado Temporário' | 'Óbito';
    admissionType?: 'Home Care' | 'Paliativo' | 'Internação Domiciliar' | 'Acompanhamento Ambulatorial';
    complexity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    servicePackage: 'Básico' | 'Intermediário' | 'Completo' | 'VIP' | 'Personalizado';
    startDate: string;
    endDate?: string;
    supervisorId?: string;
    escalistaId?: string;
    nurseResponsibleId?: string;
    frequency?: string;
    operationArea?: string;
    admissionSource?: string;
    contractId?: string;
    lastAuditDate?: string;
    lastAuditBy?: string;
    notesInternal?: string;
  };
  
  // 5. Informações Financeiras
  financial: {
    vinculo: 'Plano de Saúde' | 'Particular' | 'Convênio' | 'Público';
    bondType?: 'Plano de Saúde' | 'Particular' | 'Convênio' | 'Público';
    operadora?: string;
    carteirinha?: string;
    validadeCarteirinha?: string;
    monthlyFee: number;
    billingDay: number;
    formaPagamento?: string;
    paymentMethod?: string;
    billingStatus?: 'Pago' | 'Pendente' | 'Atrasado';
    lastPaymentDate?: string;
    paymentHistory?: {
      month: string;
      status: 'Pago' | 'Pendente' | 'Atrasado';
      amount: number;
      paidAt?: string;
      method?: string;
    }[];
    observacoesFinanceiras?: string;
  };

  // 6. Documentos
  documents: {
      termoConsentimentoUrl?: string;
      termoLgpdUrl?: string;
      documentoComFotoUrl?: string;
      comprovanteEnderecoUrl?: string;
      fichaAvaliacaoEnfermagemUrl?: string;
      planoCuidadoUrl?: string;
      protocoloAuditoriaUrl?: string;
  };
  documentsCollection: PatientDocument[];
  consents: PatientConsent[];
  changeLog: PatientAuditLog[];
  accessLog: PatientAuditLog[];
  smartFields?: PatientSmartFields;
  operationalLinks?: PatientOperationalLinks;
  lastViewedAt?: string;
  accessLogSummary?: PatientAccessLogSummary;

  // 7. Auditoria
  audit: {
      createdAt: string;
      createdBy: string;
      updatedAt: string;
      updatedBy: string;
  };
  
  // 8. Dados operacionais (para a lista)
  last_visit_date?: string;
  next_visit_date?: string;
  consent_status: 'ok' | 'pending';
  pending_documents: number;
};

export type Supply = {
  id: string;
  name: string;
  description: string;
  unit: string;
};

export type InventoryItem = {
  id: string;
  patientId: string;
  supplyId: Supply['id'];
  name: string;
  description: string;
  stock: number;
  lowStockThreshold: number;
};

export type SupplyRequest = {
  id: string;
  patientId: string;
  supplyId: Supply['id'];
  quantityRequested: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'denied';
  notes?: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type Professional = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: string;
  address: Patient['address'];
  avatarUrl: string;
  avatarHint: string;
  rating: number;
  bio: string;
  coren: string;
  corenStatus: 'active' | 'inactive';
  role: 'Supervisor(a)' | 'Escalista' | 'Cuidador(a)' | 'Fisioterapeuta';
  employmentType: 'interno' | 'fixo' | 'externo';
  reviews: { from: string; quote: string }[];
  specialties: string[];
  compatibilityTags?: { text: string; icon: LucideIcon; variant?: 'default' | 'positive' | 'warning' }[];
  lastActivity?: string;
  recentAttendances?: { patientName: string; date: string; note: string }[];
};

export type Shift = {
  id: string;
  patientId: string;
  professionalId?: string;
  dayKey: string;
  shiftType: ShiftType;
  status: 'open' | 'pending' | 'filled' | 'active' | 'completed' | 'issue';
  isUrgent?: boolean;
  progress?: number;
  checkIn?: string;
  checkOut?: string;
  checkInStatus?: 'OK' | 'Pendente' | 'Falha';
  checkOutStatus?: 'OK' | 'Pendente' | 'Falha';
  hasNotification?: boolean;
};

// This type is deprecated and will be removed. Use Shift.
export type OpenShiftInfo = {
  patient: Patient;
  dayKey: string;
  shiftType: ShiftType;
};


export type ShiftState = {
  professional: Professional;
  status: 'filled' | 'pending' | 'open';
} | null;

export type ActiveShift = {
    patientName: string;
    professional: Professional;
    shift: string;
    progress: number;
    checkIn: string | null;
    checkOut: string | null;
    status: string;
    statusColor: string;
}

export type ShiftHistoryEvent = {
    time: string;
    event: string;
    details?: string;
    icon: React.ElementType;
    status: 'ok' | 'pending' | 'late' | 'default';
}

export type ShiftReport = {
  id: string;
  patientId: string;
  careTeamMemberName: string;
  shift: ShiftType;
  reportDate: string;
  observations: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  }
}

export type Notification = {
  id: string;
  patientId: string;
  type: 'supply' | 'info' | 'alert';
  message: string;
  timestamp: string;
  read?: boolean;
}

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
  assignee?: string; // Should be Professional['id']
  dueDate?: string;
  patientId?: string; // Optional link to a patient
};

export type Invoice = {
  id: string;
  patientName: string;
  patientId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Pendente' | 'Paga' | 'Atrasada';
};

export type Expense = {
  id: string;
  professionalName: string;
  professionalId: string;
  paymentDate: string;
  description: string;
  amount: number;
  status: 'Paga' | 'Pendente';
}

export type Transaction = (
  | { type: 'receita', data: Invoice }
  | { type: 'despesa', data: Expense }
) & { transactionDate: string };
