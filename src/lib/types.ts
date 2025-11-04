
import { LucideIcon } from 'lucide-react';

export type Diagnosis = {
  name: string;
  code?: string;
};

export type Patient = {
  // 1. Dados Pessoais
  id: string;
  salutation?: 'Sr.' | 'Sra.' | 'Dr.' | 'Dra.';
  firstName: string;
  lastName: string;
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

  // Demográfico
  dateOfBirth: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  genderIdentity?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  naturalidade?: string; // representa placeOfBirth
  preferredLanguage?: 'Português' | 'Inglês' | 'Espanhol' | string;
  
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
    };
    documentUrl?: string;
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
    hygieneConditions?: 'Boa' | 'Regular' | 'Ruim';
    environmentalRisks?: string;
    hasSmokers?: boolean;
    ventilation?: 'Adequada' | 'Insuficiente' | 'Artificial';
    noiseLevel?: 'Baixo' | 'Médio' | 'Alto';
    generalObservations?: string;
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
    operadora?: string;
    carteirinha?: string;
    validadeCarteirinha?: string;
    monthlyFee: number;
    billingDay: number;
    formaPagamento?: string;
    observacoesFinanceiras?: string;
  };

  // 6. Rede de Apoio (Agora parte de Dados Pessoais - mantido para compatibilidade, mas dados estão em emergencyContacts/legalGuardian)
  supportNetwork: {
      responsavelLegal: string;
      parentescoResponsavel: string;
      contatoResponsavel: string;
      emailResponsavel?: string;
      enderecoResponsavel?: string;
      autorizacaoAcessoDados: boolean;
      familiaresAppIds?: string[];
  };

  // 7. Documentos
  documents: {
      termoConsentimentoUrl?: string;
      termoLgpdUrl?: string;
      documentoComFotoUrl?: string;
      comprovanteEnderecoUrl?: string;
      fichaAvaliacaoEnfermagemUrl?: string;
      planoCuidadoUrl?: string;
      protocoloAuditoriaUrl?: string;
  };

  // 8. Auditoria
  audit: {
      createdAt: string;
      createdBy: string;
      updatedAt: string;
      updatedBy: string;
  };
  
  // 9. Dados operacionais (para a lista)
  last_visit_date?: string;
  next_visit_date?: string;
  consent_status: 'ok' | 'pending';
  pending_documents: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  stock: number;
  lowStockThreshold: number;
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
  shiftType: 'diurno' | 'noturno';
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
export type ShiftDetails = {
  patient: Patient;
  dayKey: string;
  shiftType: 'diurno' | 'noturno';
  startTime: string;
  endTime: string;
  title: string;
  valueOffered: number;
  isUrgent: boolean;
  notes: string;
  address: Patient['address'];
}

export type OpenShiftInfo = {
  patient: Patient;
  dayKey: string;
  shiftType: 'diurno' | 'noturno';
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
  shift: 'Diurno' | 'Noturno';
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
