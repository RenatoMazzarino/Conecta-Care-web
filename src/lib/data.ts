import type { Patient, InventoryItem, Professional, ActiveShift, ShiftReport, Notification } from './types';
import { PlaceHolderImages } from './placeholder-images';

const patientAvatars = {
  'patient-123': PlaceHolderImages.find(img => img.id === 'patient-avatar-1'),
  'patient-456': PlaceHolderImages.find(img => img.id === 'patient-avatar-2'),
  'patient-789': PlaceHolderImages.find(img => img.id === 'patient-avatar-3'),
};

export const patients: Omit<Patient, 'lowStockCount' | 'criticalStockCount'>[] = [
  {
    id: 'patient-123',
    name: 'João da Silva',
    cpf: '123.456.789-00',
    dateOfBirth: '1946-05-20',
    bloodType: 'A+',
    age: 78,
    avatarUrl: patientAvatars['patient-123']?.imageUrl ?? 'https://picsum.photos/seed/1/100/100',
    avatarHint: patientAvatars['patient-123']?.imageHint ?? 'homem idoso sorrindo',
    familyContact: {
      name: 'Maria da Silva',
      phone: '+55 (11) 98765-4321',
    },
    allergies: ['Penicilina', 'Frutos do mar'],
    chronicConditions: ['Hipertensão', 'Diabetes Tipo 2'],
    medications: [
      { name: 'Losartana', dosage: '50mg', frequency: '1x ao dia', notes: 'Tomar pela manhã' },
      { name: 'Metformina', dosage: '850mg', frequency: '2x ao dia', notes: 'Tomar após as refeições' },
    ],
    diet: 'Dieta com baixo teor de sódio e açúcar. Evitar carboidratos refinados.',
  },
  {
    id: 'patient-456',
    name: 'Maria Lopes',
    cpf: '987.654.321-00',
    dateOfBirth: '1942-11-15',
    bloodType: 'O-',
    age: 82,
    avatarUrl: patientAvatars['patient-456']?.imageUrl ?? 'https://picsum.photos/seed/2/100/100',
    avatarHint: patientAvatars['patient-456']?.imageHint ?? 'senhora de oculos',
    familyContact: {
      name: 'Carlos Lopes',
      phone: '+55 (21) 91234-5678',
    },
     allergies: [],
    chronicConditions: ['Artrite Reumatoide'],
    medications: [
      { name: 'Metotrexato', dosage: '15mg', frequency: '1x por semana', notes: 'Tomar às quartas-feiras' },
      { name: 'Prednisona', dosage: '5mg', frequency: '1x ao dia', notes: '' },
    ],
    diet: 'Dieta rica em cálcio e vitamina D.',
  },
  {
    id: 'patient-789',
    name: 'Jorge Mendes',
    cpf: '111.222.333-44',
    dateOfBirth: '1959-03-01',
    bloodType: 'B+',
    age: 65,
    avatarUrl: patientAvatars['patient-789']?.imageUrl ?? 'https://picsum.photos/seed/3/100/100',
    avatarHint: patientAvatars['patient-789']?.imageHint ?? 'homem de meia idade',
    familyContact: {
      name: 'Ana Mendes',
      phone: '+55 (31) 95555-8888',
    },
    allergies: ['Iodo'],
    chronicConditions: ['Asma'],
    medications: [
      { name: 'Salbutamol', dosage: '100mcg', frequency: 'Conforme necessidade', notes: 'Em caso de falta de ar' },
    ],
    diet: 'Nenhuma dieta específica.',
  },
];


export const inventory: InventoryItem[] = [
  { id: 'item-001', name: 'Gaze Estéril', description: 'Pacote com 10 unidades 10x10cm', stock: 45, lowStockThreshold: 20 },
  { id: 'item-002', name: 'Pomada Antibiótica', description: 'Tubo de 30g', stock: 8, lowStockThreshold: 5 },
  { id: 'item-003', name: 'Fita Micropore', description: 'Rolo de 2.5cm x 10m', stock: 12, lowStockThreshold: 10 },
  { id: 'item-004', name: 'Luvas Descartáveis', description: 'Caixa com 100un, tamanho M', stock: 88, lowStockThreshold: 50 },
  { id: 'item-005', name: 'Soro Fisiológico', description: 'Frasco de 500ml', stock: 3, lowStockThreshold: 4 },
  { id: 'item-006', name: 'Seringas', description: '10ml, bico Luer Lock, caixa c/ 50', stock: 2, lowStockThreshold: 30 },
  { id: 'item-007', name: 'Curativos Adesivos', description: 'Caixa com tamanhos variados', stock: 150, lowStockThreshold: 50 },
  { id: 'item-008', name: 'Álcool 70%', description: 'Frasco de 1L', stock: 1, lowStockThreshold: 2 },
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
  },
  {
    id: 'prof-5',
    name: 'Bruno Alves',
    initials: 'BA',
    avatarColor: 'bg-blue-500',
    rating: 4.7,
    corenStatus: 'active',
    specialties: ['Cardiologia', 'Home Care'],
    reviews: [
      { from: 'Clínica do Coração', quote: 'Excelente profissional, muito conhecimento técnico.' },
    ]
  },
  {
    id: 'prof-6',
    name: 'Juliana Paes',
    initials: 'JP',
    avatarColor: 'bg-red-500',
    rating: 4.9,
    corenStatus: 'active',
    specialties: ['Dermatologia', 'Curativos'],
    reviews: [
      { from: 'DermaClin', quote: 'Extremamente cuidadosa e atenta aos detalhes.' },
      { from: 'Home Care Senior', quote: 'Paciente adorou a atenção e o cuidado.' }
    ]
  },
  {
    id: 'prof-7',
    name: 'Ricardo Gomes',
    initials: 'RG',
    avatarColor: 'bg-yellow-500',
    rating: 4.3,
    corenStatus: 'active',
    specialties: ['Fisioterapia Respiratória'],
    reviews: []
  }
];


export const initialActiveShiftsData: ActiveShift[] = [
    {
        patientName: "Srª. Maria Lopes",
        professional: professionals[0],
        shift: "DIURNO 12H",
        progress: 45,
        checkIn: "08:02",
        checkOut: null,
        status: "Sem Intercorrências",
        statusColor: "text-green-600"
    },
    {
        patientName: "Sr. Jorge Mendes",
        professional: professionals[2],
        shift: "NOTURNO 12H",
        progress: 80,
        checkIn: "20:00",
        checkOut: null,
        status: "Aguardando Confirmação de Presença",
        statusColor: "text-amber-600"
    },
     {
        patientName: "Sra. Ana Costa",
        professional: professionals[1],
        shift: "DIURNO 12H",
        progress: 15,
        checkIn: null,
        checkOut: null,
        status: "Atrasado",
        statusColor: "text-destructive"
    }
]

export const mockShiftReports: ShiftReport[] = [
  {
    id: 'sr-001',
    patientId: 'patient-123',
    careTeamMemberName: 'Carla Nogueira',
    shift: 'Diurno',
    reportDate: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(),
    observations: 'Paciente passou o dia tranquilo, colaborativo e sem queixas de dor. Realizou fisioterapia pela manhã e aceitou bem a dieta.',
    vitalSigns: { bloodPressure: '122/78', heartRate: 75, oxygenSaturation: 98 }
  },
  {
    id: 'sr-002',
    patientId: 'patient-123',
    careTeamMemberName: 'Fábio Bastos',
    shift: 'Noturno',
    reportDate: new Date(new Date().setDate(new Date().getDate() -2)).toISOString(),
    observations: 'Noite calma, sono tranquilo com alguns despertares. Sem intercorrências durante a madrugada. Sinais vitais estáveis.',
    vitalSigns: { bloodPressure: '118/75', heartRate: 70, oxygenSaturation: 97 }
  },
  {
    id: 'sr-003',
    patientId: 'patient-456',
    careTeamMemberName: 'Diogo Lima',
    shift: 'Diurno',
    reportDate: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(),
    observations: 'Paciente apresentou leve dor na articulação do joelho direito. Administrado analgésico conforme prescrição, com melhora do quadro.',
    vitalSigns: { bloodPressure: '130/85', heartRate: 80, oxygenSaturation: 99 }
  }
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    patientId: 'patient-123',
    type: 'supply',
    message: 'Solicitação de Soro Fisiológico (2 unidades) enviada para a família.',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString()
  },
  {
    id: 'notif-002',
    patientId: 'patient-123',
    type: 'alert',
    message: 'Nível de estoque de Seringas está crítico (2 unidades).',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString()
  },
    {
    id: 'notif-003',
    patientId: 'patient-456',
    type: 'info',
    message: 'Profissional Carla Nogueira confirmou o plantão de amanhã.',
    timestamp: new Date(new Date().setDate(new Date().getDate() -1)).toISOString()
  },
]
