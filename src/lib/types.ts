export type Patient = {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  avatarHint: string;
  familyContact: {
    name: string;
    phone: string;
  };
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
