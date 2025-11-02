

import { LucideIcon } from 'lucide-react';

export type Patient = {
  // 1. Dados Pessoais
  id: string;
  name: string;
  socialName?: string;
  cpf: string;
  rg?: string;
  rgEmissor?: string;
  dateOfBirth: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  estadoCivil?: string;
  nacionalidade?: string;
  naturalidade?: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  avatarUrl: string;
  avatarHint: string;
  rgDigitalUrl?: string;

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
    tipoResidencia?: 'Casa' | 'Apartamento' | 'Chácara' | 'Condomínio';
    condicoesDomicilio?: string;
    acessoAmbulancia?: boolean;
    possuiAnimal?: boolean;
    animalDescricao?: string;
  };

  // 3. Dados Clínicos e Assistenciais
  clinicalData: {
    equipamentosDomiciliares?: string[];
    diagnosticoPrincipal: string;
    diagnosticosSecundarios?: string[];
    cid?: string[];
    allergies: string[];
    restricoes?: string[];
    mobilidade?: 'Autônomo' | 'Parcialmente Dependente' | 'Acamado';
    estadoConsciencia?: string;
    dispositivos?: ('GTT' | 'SNE' | 'CVD' | 'Traqueostomia')[];
    acessorios?: string;
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        notes?: string;
    }[];
    ultimaAvaliacaoMedica?: string;
    ultimoExameLaboratorial?: string;
    observacoesGerais?: string;
  };

  // 4. Dados Administrativos
  adminData: {
    status: 'Ativo' | 'Inativo' | 'Suspenso';
    complexity: 'Baixa' | 'Média' | 'Alta';
    servicePackage: 'Básico' | 'Intermediário' | 'Completo';
    dataInicioAtendimento: string;
    dataTerminoAtendimento?: string;
    supervisorId?: string;
    schedulerId?: string;
    enfermeiroResponsavelId?: string;
    cuidadoresIds?: string[];
    frequenciaAtendimento?: string;
    observacoesInternas?: string;
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

  // 6. Rede de Apoio
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

  // Deprecated fields to be removed
  age?: number;
  bloodType?: string;
  familyContact?: any;
  allergies?: any;
  chronicConditions?: any;
  medications?: any;
  diet?: string;
  lowStockCount?: number;
  criticalStockCount?: number;
  status?: 'Ativo' | 'Inativo';
  complexity?: 'baixa' | 'media' | 'alta';
  supervisorId?: string;
  schedulerId?: string;
  servicePackage?: string;
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

    
