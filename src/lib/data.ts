import type { Patient, InventoryItem, Professional, Shift } from './types';
import { PlaceHolderImages } from './placeholder-images';

const patientAvatar = PlaceHolderImages.find(img => img.id === 'patient-avatar-1');

export const patient: Patient = {
  id: 'patient-123',
  name: 'John Doe',
  age: 78,
  avatarUrl: patientAvatar?.imageUrl ?? 'https://picsum.photos/seed/1/100/100',
  avatarHint: patientAvatar?.imageHint ?? 'elderly man smiling',
  familyContact: {
    name: 'Jane Doe',
    phone: '+1 (555) 123-4567',
  },
};

export const inventory: InventoryItem[] = [
  { id: 'item-001', name: 'Gauze Pads', description: 'Sterile 4x4 inch pads', stock: 45, lowStockThreshold: 20 },
  { id: 'item-002', name: 'Antibiotic Ointment', description: 'Triple-antibiotic formula', stock: 8, lowStockThreshold: 5 },
  { id: 'item-003', name: 'Medical Tape', description: 'Hypoallergenic paper tape', stock: 12, lowStockThreshold: 10 },
  { id: 'item-004', name: 'Disposable Gloves', description: 'Latex-free, size M', stock: 88, lowStockThreshold: 50 },
  { id: 'item-005', name: 'Saline Solution', description: '500ml sterile solution', stock: 3, lowStockThreshold: 4 },
  { id: 'item-006', name: 'Syringes', description: '10ml Luer Lock', stock: 25, lowStockThreshold: 30 },
  { id: 'item-007', name: 'Band-Aids', description: 'Assorted sizes', stock: 150, lowStockThreshold: 50 },
  { id: 'item-008', name: 'Alcohol Wipes', description: '70% Isopropyl alcohol', stock: 200, lowStockThreshold: 100 },
];

export const professionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Carla Nogueira',
    initials: 'CN',
    avatarColor: 'bg-cyan-500',
    rating: 4.8,
    corenStatus: 'active',
    specialties: ['Home Care', 'Pediatria', 'Administração de Medicamentos IV'],
    reviews: [
      { from: 'Home Care ABC', quote: 'Profissional exemplar, sempre pontual.' },
      { from: 'Clínica XYZ', quote: 'Ótima com pacientes de mobilidade reduzida.' }
    ]
  },
  {
    id: 'prof-2',
    name: 'Fábio Bastos',
    initials: 'FB',
    avatarColor: 'bg-green-500',
    rating: 4.5,
    corenStatus: 'active',
    specialties: ['Geriatria', 'Curativos Complexos'],
    reviews: [
        { from: 'Hospital Central', quote: 'Muito atencioso e técnico.' },
    ]
  },
  {
    id: 'prof-3',
    name: 'Diogo Lima',
    initials: 'DL',
    avatarColor: 'bg-orange-400',
    rating: 4.9,
    corenStatus: 'active',
    specialties: ['UTI', 'Ventilação Mecânica'],
    reviews: []
  },
    {
    id: 'prof-4',
    name: 'Diana Magalhães',
    initials: 'DM',
    avatarColor: 'bg-pink-500',
    rating: 3.2,
    corenStatus: 'inactive',
    specialties: ['Pediatria'],
    reviews: [
         { from: 'Hospital Infantil', quote: 'Atrasou em 2 dos 3 plantões.' },
    ]
  }
];
