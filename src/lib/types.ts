export type Patient = {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  bloodType: string;
  age: number;
  avatarUrl: string;
  avatarHint: string;
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
  avatarColor: string;
  rating: number;
  corenStatus: 'active' | 'inactive';
  reviews: { from: string; quote: string }[];
  specialties: string[];
};

export type Shift = {
  professional: Professional;
  shiftType: 'day' | 'night';
};

export type OpenShiftInfo = {
  patient: { id: number; name: string };
  dayKey: string;
  shiftType: 'diurno' | 'noturno';
};

export type ShiftState = Shift | null | 'open' | 'pending';

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
    iconColor: string;
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
