export type Patient = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  age: number;
  avatarUrl: string;
  avatarHint: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  financial: {
    plan: 'particular' | 'plano_de_saude';
    healthPlan?: string;
    healthPlanId?: string;
    monthlyFee: number;
    billingDay: number;
  };
  familyContact: {
    name: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    notes: string;
  }[];
  diet: string;
  lowStockCount: number;
  criticalStockCount: number;
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
  avatarUrl: string;
  avatarHint: string;
  rating: number;
  bio: string;
  corenStatus: 'active' | 'inactive';
  reviews: { from: string; quote: string }[];
  specialties: string[];
};

export type Shift = {
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
}

export type Task = {
    id: string;
    title: string;
    assignee: string;
    priority: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
}
