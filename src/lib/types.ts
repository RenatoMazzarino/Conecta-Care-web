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
  patient: { id: string; name: string };
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
