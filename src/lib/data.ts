import type { Patient, InventoryItem, Professional, ActiveShift, ShiftReport, Notification, Task, Shift, ShiftHistoryEvent } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { format, addDays, startOfWeek } from 'date-fns';
import { Footprints, Pill, CircleCheck, CircleX } from 'lucide-react';

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
    email: 'joao.silva@example.com',
    phone: '+55 (11) 98888-1111',
    dateOfBirth: '1946-05-20',
    bloodType: 'A+',
    age: 78,
    avatarUrl: patientAvatars['patient-123']?.imageUrl ?? 'https://picsum.photos/seed/1/100/100',
    avatarHint: patientAvatars['patient-123']?.imageHint ?? 'homem idoso sorrindo',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-000'
    },
    financial: {
        plan: 'plano_de_saude',
        healthPlan: 'Amil 700',
        healthPlanId: '987654321-0',
        monthlyFee: 1200,
        billingDay: 10,
    },
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
    email: 'maria.lopes@example.com',
    phone: '+55 (21) 97777-2222',
    dateOfBirth: '1942-11-15',
    bloodType: 'O-',
    age: 82,
    avatarUrl: patientAvatars['patient-456']?.imageUrl ?? 'https://picsum.photos/seed/2/100/100',
    avatarHint: patientAvatars['patient-456']?.imageHint ?? 'senhora de oculos',
     address: {
      street: 'Avenida Copacabana',
      number: '1000',
      complement: 'Apto 101',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22020-002'
    },
    financial: {
        plan: 'particular',
        monthlyFee: 8500,
        billingDay: 5,
    },
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
    email: 'jorge.mendes@example.com',
    phone: '+55 (31) 96666-3333',
    dateOfBirth: '1959-03-01',
    bloodType: 'B+',
    age: 65,
    avatarUrl: patientAvatars['patient-789']?.imageUrl ?? 'https://picsum.photos/seed/3/100/100',
    avatarHint: patientAvatars['patient-789']?.imageHint ?? 'homem de meia idade',
     address: {
      street: 'Rua da Bahia',
      number: '500',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30130-001'
    },
    financial: {
        plan: 'plano_de_saude',
        healthPlan: 'Unimed Flex',
        healthPlanId: '11223344-5',
        monthlyFee: 950,
        billingDay: 15,
    },
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
    avatarUrl: 'https://picsum.photos/seed/prof1/100/100',
    avatarHint: 'woman nurse smiling',
    rating: 4.8,
    bio: 'Enfermeira com mais de 10 anos de experiência em home care, especializada no cuidado de pacientes idosos e com doenças crônicas. Focada em um atendimento humanizado e de alta qualidade.',
    corenStatus: 'active',
    specialties: ['Home Care', 'Geriatria', 'Administração de Medicamentos IV', 'Curativos'],
    reviews: [
      { from: 'Família Silva', quote: 'Profissional exemplar, sempre pontual e muito carinhosa com nosso pai.' },
      { from: 'Home Care ABC', quote: 'Uma das melhores enfermeiras da nossa equipe. Proativa e muito competente.' }
    ]
  },
  {
    id: 'prof-2',
    name: 'Fábio Bastos',
    initials: 'FB',
    avatarUrl: 'https://picsum.photos/seed/prof2/100/100',
    avatarHint: 'male nurse smiling',
    rating: 4.5,
    bio: 'Técnico de enfermagem com 5 anos de experiência em ambiente hospitalar e home care. Habilidade em curativos complexos e monitoramento de pacientes.',
    corenStatus: 'active',
    specialties: ['Curativos Complexos', 'Monitoramento de Sinais Vitais'],
    reviews: [
        { from: 'Hospital Central', quote: 'Muito atencioso e técnico. Um ótimo profissional para se ter na equipe.' },
    ]
  },
  {
    id: 'prof-3',
    name: 'Diogo Lima',
    initials: 'DL',
    avatarUrl: 'https://picsum.photos/seed/prof3/100/100',
    avatarHint: 'male nurse glasses',
    rating: 4.9,
    bio: 'Enfermeiro com vasta experiência em UTI e cuidados intensivos. Especialista em ventilação mecânica e pacientes de alta complexidade.',
    corenStatus: 'active',
    specialties: ['UTI', 'Ventilação Mecânica', 'Cuidados Paliativos'],
    reviews: []
  },
    {
    id: 'prof-4',
    name: 'Diana Magalhães',
    initials: 'DM',
    avatarUrl: 'https://picsum.photos/seed/prof4/100/100',
    avatarHint: 'young woman nurse',
    rating: 3.2,
    bio: 'Recém-formada em enfermagem, com foco em pediatria. Buscando ganhar experiência em home care.',
    corenStatus: 'inactive',
    specialties: ['Pediatria'],
    reviews: [
         { from: 'Hospital Infantil', quote: 'Atrasou em 2 dos 3 plantões alocados.' },
    ]
  },
  {
    id: 'prof-5',
    name: 'Bruno Alves',
    initials: 'BA',
    avatarUrl: 'https://picsum.photos/seed/prof5/100/100',
    avatarHint: 'male nurse serious',
    rating: 4.7,
    bio: 'Enfermeiro experiente na área de cardiologia, com passagens por grandes hospitais. Agora focado em home care para reabilitação cardíaca.',
    corenStatus: 'active',
    specialties: ['Cardiologia', 'Home Care', 'Reabilitação'],
    reviews: [
      { from: 'Clínica do Coração', quote: 'Excelente profissional, muito conhecimento técnico e ótimo com os pacientes.' },
    ]
  },
  {
    id: 'prof-6',
    name: 'Juliana Paes',
    initials: 'JP',
    avatarUrl: 'https://picsum.photos/seed/prof6/100/100',
    avatarHint: 'woman nurse glasses',
    rating: 4.9,
    bio: 'Especialista em dermatologia e tratamento de lesões de pele. Muito cuidadosa e atenta aos detalhes, ideal para pacientes com necessidade de curativos especiais.',
    corenStatus: 'active',
    specialties: ['Dermatologia', 'Curativos Especiais', 'Lesões por Pressão'],
    reviews: [
      { from: 'DermaClin', quote: 'Extremamente cuidadosa e atenta aos detalhes.' },
      { from: 'Home Care Senior', quote: 'Paciente adorou a atenção e o cuidado.' }
    ]
  },
  {
    id: 'prof-7',
    name: 'Ricardo Gomes',
    initials: 'RG',
    avatarUrl: 'https://picsum.photos/seed/prof7/100/100',
    avatarHint: 'male physiotherapist',
    rating: 4.3,
    bio: 'Fisioterapeuta com foco em reabilitação respiratória e motora. Experiência com pacientes pós-AVC e com doenças neuromusculares.',
    corenStatus: 'active',
    specialties: ['Fisioterapia Respiratória', 'Fisioterapia Motora'],
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

export const mockTasks: Task[] = [
    { id: 'task-1', title: 'Revisar prontuário do novo paciente Sr. Jorge', assignee: 'Admin', priority: 'Alta' },
    { id: 'task-2', title: 'Aprovar candidaturas para o plantão de sexta-feira', assignee: 'Admin', priority: 'Urgente' },
    { id: 'task-3', title: 'Ligar para a família da Sra. Maria Lopes sobre o novo medicamento', assignee: 'Enf. Chefe', priority: 'Alta' },
    { id: 'task-4', title: 'Organizar a escala da próxima semana', assignee: 'Admin', priority: 'Média' }
];

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const sundayThisWeek = startOfWeek(today, { weekStartsOn: 0 });

export const initialShifts: Shift[] = [
  { patientId: 'patient-123', professionalId: 'prof-1', dayKey: format(addDays(sundayThisWeek, 0), 'yyyy-MM-dd'), shiftType: 'diurno' },
  { patientId: 'patient-123', dayKey: format(addDays(sundayThisWeek, 0), 'yyyy-MM-dd'), shiftType: 'noturno', status: 'pending' },
  { patientId: 'patient-123', professionalId: 'prof-2', dayKey: format(addDays(sundayThisWeek, 1), 'yyyy-MM-dd'), shiftType: 'diurno' },
  { patientId: 'patient-123', professionalId: 'prof-3', dayKey: format(addDays(sundayThisWeek, 1), 'yyyy-MM-dd'), shiftType: 'noturno' },
  { patientId: 'patient-456', professionalId: 'prof-5', dayKey: format(addDays(sundayThisWeek, 2), 'yyyy-MM-dd'), shiftType: 'noturno' },
  { patientId: 'patient-789', professionalId: 'prof-2', dayKey: format(addDays(sundayThisWeek, 3), 'yyyy-MM-dd'), shiftType: 'diurno' },
  { patientId: 'patient-789', professionalId: 'prof-1', dayKey: format(addDays(sundayThisWeek, 3), 'yyyy-MM-dd'), shiftType: 'noturno' },
];

export const mockShiftHistory: ShiftHistoryEvent[] = [
    { time: '08:02', event: 'Início do Plantão', details: 'Profissional iniciou o plantão via app.', icon: Footprints, iconColor: 'text-blue-500' },
    { time: '08:15', event: 'Check-in Realizado', details: 'Presença confirmada na residência.', icon: CircleCheck, iconColor: 'text-green-500' },
    { time: '09:00', event: 'Medicação Administrada', details: 'Administrado 10mg de Lexapro.', icon: Pill, iconColor: 'text-indigo-500' },
    { time: '12:30', event: 'Medição de Sinais Vitais', details: 'PA: 120/80 mmHg, FC: 75bpm, SpO2: 98%', icon: Pill, iconColor: 'text-indigo-500' },
    { time: '14:00', event: 'Paciente reportou dor', details: 'Dor leve na região lombar. Escala 3/10.', icon: Pill, iconColor: 'text-amber-500' },
    { time: '18:00', event: 'Medicação Administrada', details: 'Administrado 500mg de Dipirona.', icon: Pill, iconColor: 'text-indigo-500' },
    { time: '20:05', event: 'Check-out Realizado', details: 'Saída da residência confirmada.', icon: CircleX, iconColor: 'text-red-500' },
    { time: '20:10', event: 'Fim do Plantão', details: 'Profissional finalizou o plantão via app.', icon: Footprints, iconColor: 'text-slate-500' },
];
