import type { Patient, Professional, Shift, ShiftHistoryEvent, Transaction, Invoice, Expense, Task, Notification } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { format, addDays, startOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Footprints, Pill, CircleCheck, CircleX, Stethoscope, TestTube } from 'lucide-react';

const patientAvatars = {
  'patient-123': PlaceHolderImages.find(img => img.id === 'patient-avatar-1'),
  'patient-456': PlaceHolderImages.find(img => img.id === 'patient-avatar-2'),
  'patient-789': PlaceHolderImages.find(img => img.id === 'patient-avatar-3'),
};

export const patients: Patient[] = [
  {
    id: 'patient-123',
    name: 'João da Silva',
    cpf: '123.456.789-00',
    email: 'joao.silva@example.com',
    phone: '+55 (11) 98888-1111',
    dateOfBirth: '1946-05-20',
    bloodType: 'A+',
    age: 78,
    complexity: 'alta',
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
    lowStockCount: 0,
    criticalStockCount: 0,
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
    complexity: 'media',
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
    lowStockCount: 0,
    criticalStockCount: 0,
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
    complexity: 'baixa',
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
    lowStockCount: 0,
    criticalStockCount: 0,
  },
];

export const professionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Carla Nogueira',
    initials: 'CN',
    email: 'carla.n@caresync.com',
    phone: '+55 11 91234-5678',
    cpf: '222.333.444-55',
    dateOfBirth: '1985-10-25',
    address: { street: 'Rua das Enfermeiras', number: '10', neighborhood: 'Saúde', city: 'São Paulo', state: 'SP', zipCode: '04300-000' },
    avatarUrl: 'https://picsum.photos/seed/prof1/100/100',
    avatarHint: 'woman nurse smiling',
    rating: 4.8,
    bio: 'Enfermeira com mais de 10 anos de experiência em home care, especializada no cuidado de pacientes idosos e com doenças crônicas. Focada em um atendimento humanizado e de alta qualidade.',
    coren: 'SP-123456-ENF',
    corenStatus: 'active',
    role: 'Supervisor(a)',
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
    email: 'fabio.b@caresync.com',
    phone: '+55 21 92345-6789',
    cpf: '333.444.555-66',
    dateOfBirth: '1992-02-18',
    address: { street: 'Av. das Américas', number: '2000', neighborhood: 'Barra da Tijuca', city: 'Rio de Janeiro', state: 'RJ', zipCode: '22640-100' },
    avatarUrl: 'https://picsum.photos/seed/prof2/100/100',
    avatarHint: 'male nurse smiling',
    rating: 4.5,
    bio: 'Técnico de enfermagem com 5 anos de experiência em ambiente hospitalar e home care. Habilidade em curativos complexos e monitoramento de pacientes.',
    coren: 'RJ-654321-TEC',
    corenStatus: 'active',
    role: 'Cuidador(a)',
    specialties: ['Curativos Complexos', 'Monitoramento de Sinais Vitais'],
    reviews: [
        { from: 'Hospital Central', quote: 'Muito atencioso e técnico. Um ótimo profissional para se ter na equipe.' },
    ]
  },
  {
    id: 'prof-3',
    name: 'Diogo Lima',
    initials: 'DL',
    email: 'diogo.l@caresync.com',
    phone: '+55 31 93456-7890',
    cpf: '444.555.666-77',
    dateOfBirth: '1988-07-30',
    address: { street: 'Rua dos Inconfidentes', number: '50', neighborhood: 'Funcionários', city: 'Belo Horizonte', state: 'MG', zipCode: '30140-120' },
    avatarUrl: 'https://picsum.photos/seed/prof3/100/100',
    avatarHint: 'male nurse glasses',
    rating: 4.9,
    bio: 'Enfermeiro com vasta experiência em UTI e cuidados intensivos. Especialista em ventilação mecânica e pacientes de alta complexidade.',
    coren: 'MG-112233-ENF',
    corenStatus: 'active',
    role: 'Supervisor(a)',
    specialties: ['UTI', 'Ventilação Mecânica', 'Cuidados Paliativos'],
    reviews: []
  },
    {
    id: 'prof-4',
    name: 'Diana Magalhães',
    initials: 'DM',
    email: 'diana.m@caresync.com',
    phone: '+55 11 94567-8901',
    cpf: '555.666.777-88',
    dateOfBirth: '1998-12-05',
    address: { street: 'Rua Augusta', number: '900', neighborhood: 'Consolação', city: 'São Paulo', state: 'SP', zipCode: '01304-001' },
    avatarUrl: 'https://picsum.photos/seed/prof4/100/100',
    avatarHint: 'young woman nurse',
    rating: 3.2,
    bio: 'Recém-formada em enfermagem, com foco em pediatria. Buscando ganhar experiência em home care.',
    coren: 'SP-998877-ENF',
    corenStatus: 'inactive',
    role: 'Cuidador(a)',
    specialties: ['Pediatria'],
    reviews: [
         { from: 'Hospital Infantil', quote: 'Atrasou em 2 dos 3 plantões alocados.' },
    ]
  },
  {
    id: 'prof-5',
    name: 'Bruno Alves',
    initials: 'BA',
    email: 'bruno.a@caresync.com',
    phone: '+55 41 95678-9012',
    cpf: '666.777.888-99',
    dateOfBirth: '1980-04-12',
    address: { street: 'Rua das Araucárias', number: '150', neighborhood: 'Batel', city: 'Curitiba', state: 'PR', zipCode: '80420-190' },
    avatarUrl: 'https://picsum.photos/seed/prof5/100/100',
    avatarHint: 'male nurse serious',
    rating: 4.7,
    bio: 'Enfermeiro experiente na área de cardiologia, com passagens por grandes hospitais. Agora focado em home care para reabilitação cardíaca.',
    coren: 'PR-445566-ENF',
    corenStatus: 'active',
    role: 'Escalista',
    specialties: ['Cardiologia', 'Home Care', 'Reabilitação'],
    reviews: [
      { from: 'Clínica do Coração', quote: 'Excelente profissional, muito conhecimento técnico e ótimo com os pacientes.' },
    ]
  },
  {
    id: 'prof-6',
    name: 'Juliana Paes',
    initials: 'JP',
    email: 'juliana.p@caresync.com',
    phone: '+55 51 96789-0123',
    cpf: '777.888.999-00',
    dateOfBirth: '1995-09-01',
    address: { street: 'Av. Ipiranga', number: '3000', neighborhood: 'Partenon', city: 'Porto Alegre', state: 'RS', zipCode: '90610-000' },
    avatarUrl: 'https://picsum.photos/seed/prof6/100/100',
    avatarHint: 'woman nurse glasses',
    rating: 4.9,
    bio: 'Especialista em dermatologia e tratamento de lesões de pele. Muito cuidadosa e atenta aos detalhes, ideal para pacientes com necessidade de curativos especiais.',
    coren: 'RS-778899-ENF',
    corenStatus: 'active',
    role: 'Cuidador(a)',
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
    email: 'ricardo.g@caresync.com',
    phone: '+55 71 97890-1234',
    cpf: '888.999.000-11',
    dateOfBirth: '1990-06-20',
    address: { street: 'Av. Oceânica', number: '400', neighborhood: 'Barra', city: 'Salvador', state: 'BA', zipCode: '40140-130' },
    avatarUrl: 'https://picsum.photos/seed/prof7/100/100',
    avatarHint: 'male physiotherapist',
    rating: 4.3,
    bio: 'Fisioterapeuta com foco em reabilitação respiratória e motora. Experiência com pacientes pós-AVC e com doenças neuromusculares.',
    coren: 'BA-223344-FST',
    corenStatus: 'active',
    role: 'Fisioterapeuta',
    specialties: ['Fisioterapia Respiratória', 'Fisioterapia Motora'],
    reviews: []
  }
];

const today = new Date();
const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 }); // 0 for Sunday

export const initialShifts: Shift[] = [
  // Patient 123 - Has active and pending shifts
  { id: 'shift-001', patientId: 'patient-123', professionalId: 'prof-1', dayKey: format(startOfCurrentWeek, 'yyyy-MM-dd'), shiftType: 'diurno', status: 'active', progress: 50, checkIn: '08:02', checkInStatus: 'OK' },
  { id: 'shift-002', patientId: 'patient-123', dayKey: format(startOfCurrentWeek, 'yyyy-MM-dd'), shiftType: 'noturno', status: 'pending' },
  { id: 'shift-003', patientId: 'patient-123', professionalId: 'prof-3', dayKey: format(addDays(startOfCurrentWeek, 1), 'yyyy-MM-dd'), shiftType: 'diurno', status: 'filled' },
  { id: 'shift-004', patientId: 'patient-123', professionalId: 'prof-5', dayKey: format(addDays(startOfCurrentWeek, 1), 'yyyy-MM-dd'), shiftType: 'noturno', status: 'filled' },

  // Patient 456 - Has open, urgent, and completed shifts
  { id: 'shift-005', patientId: 'patient-456', dayKey: format(startOfCurrentWeek, 'yyyy-MM-dd'), shiftType: 'diurno', status: 'open', isUrgent: true },
  { id: 'shift-006', patientId: 'patient-456', professionalId: 'prof-5', dayKey: format(startOfCurrentWeek, 'yyyy-MM-dd'), shiftType: 'noturno', status: 'issue', progress: 90, checkIn: '20:00', checkInStatus: 'OK', hasNotification: true },
  { id: 'shift-007', patientId: 'patient-456', professionalId: 'prof-6', dayKey: format(addDays(startOfCurrentWeek, -1), 'yyyy-MM-dd'), shiftType: 'diurno', status: 'completed', progress: 100, checkIn: '08:00', checkOut: '20:00', checkInStatus: 'OK', checkOutStatus: 'OK' },

  // Patient 789 - Mostly filled
  { id: 'shift-008', patientId: 'patient-789', professionalId: 'prof-2', dayKey: format(startOfCurrentWeek, 'yyyy-MM-dd'), shiftType: 'diurno', status: 'active', progress: 30, checkIn: '07:55', checkInStatus: 'OK' },
  { id: 'shift-009', patientId: 'patient-789', professionalId: 'prof-7', dayKey: format(startOfCurrentWeek, 'yyyy-MM-dd'), shiftType: 'noturno', status: 'filled' },
  { id: 'shift-010', patientId: 'patient-789', dayKey: format(addDays(startOfCurrentWeek, 2), 'yyyy-MM-dd'), shiftType: 'diurno', status: 'open' },
];

export const mockShiftHistory: ShiftHistoryEvent[] = [
    { time: '08:02', event: 'Início do Plantão', details: 'Profissional iniciou o plantão via app.', icon: Footprints },
    { time: '08:15', event: 'Check-in Realizado', details: 'Presença confirmada na residência.', icon: CircleCheck },
    { time: '09:00', event: 'Medicação Administrada', details: 'Administrado Losartana 50mg e Metformina 850mg.', icon: Pill },
    { time: '11:30', event: 'Consulta Médica', details: 'Reavaliação de rotina. PA estável. Solicitado novo exame de sangue.', icon: Stethoscope },
    { time: '14:00', event: 'Coleta para Exame', details: 'Coleta de sangue para hemograma completo e glicemia.', icon: TestTube },
    { time: '20:05', event: 'Check-out Realizado', details: 'Saída da residência confirmada.', icon: CircleX },
    { time: '20:10', event: 'Fim do Plantão', details: 'Profissional finalizou o plantão via app.', icon: Footprints },
];

export const mockPatients = patients.map(p => ({
  ...p,
  lowStockCount: 0,
  criticalStockCount: 0,
}));

export const inventory = [
  { id: 'item-001', name: 'Gaze Estéril', description: 'Pacote com 10 unidades 10x10cm', stock: 45, lowStockThreshold: 20 },
  { id: 'item-002', name: 'Pomada Antibiótica', description: 'Tubo de 30g', stock: 8, lowStockThreshold: 5 },
  { id: 'item-003', name: 'Fita Micropore', description: 'Rolo de 2.5cm x 10m', stock: 12, lowStockThreshold: 10 },
  { id: 'item-004', name: 'Luvas Descartáveis', description: 'Caixa com 100un, tamanho M', stock: 88, lowStockThreshold: 50 },
  { id: 'item-005', name: 'Soro Fisiológico', description: 'Frasco de 500ml', stock: 3, lowStockThreshold: 4 },
  { id: 'item-006', name: 'Seringas', description: '10ml, bico Luer Lock, caixa c/ 50', stock: 2, lowStockThreshold: 30 },
  { id: 'item-007', name: 'Curativos Adesivos', description: 'Caixa com tamanhos variados', stock: 150, lowStockThreshold: 50 },
  { id: 'item-008', name: 'Álcool 70%', description: 'Frasco de 1L', stock: 1, lowStockThreshold: 2 },
];
export const mockInventory = inventory;

export const mockShiftReports = [
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
];

export const mockTasks: Task[] = [
    { id: 'task-1', title: 'Revisar prontuário do novo paciente Sr. Jorge', assignee: 'Admin', priority: 'Alta', status: 'todo' },
    { id: 'task-2', title: 'Aprovar candidaturas para o plantão de sexta-feira', assignee: 'Admin', priority: 'Urgente', status: 'inprogress' },
    { id: 'task-3', title: 'Ligar para a família da Sra. Maria Lopes sobre o novo medicamento', assignee: 'Enf. Chefe', priority: 'Alta', status: 'todo' },
    { id: 'task-4', title: 'Organizar a escala da próxima semana', assignee: 'Admin', priority: 'Média', status: 'done' }
];

const mockInvoices: Invoice[] = [
  { id: 'inv-001', patientId: 'patient-123', patientName: 'João da Silva', issueDate: '2024-07-01', dueDate: '2024-07-10', amount: 1200.00, status: 'Paga' },
  { id: 'inv-002', patientId: 'patient-456', patientName: 'Maria Lopes', issueDate: '2024-07-01', dueDate: '2024-07-05', amount: 8500.00, status: 'Paga' },
  { id: 'inv-003', patientId: 'patient-789', patientName: 'Jorge Mendes', issueDate: '2024-07-01', dueDate: '2024-07-15', amount: 950.00, status: 'Pendente' },
  { id: 'inv-004', patientId: 'patient-123', patientName: 'João da Silva', issueDate: '2024-06-01', dueDate: '2024-06-10', amount: 1200.00, status: 'Paga' },
  { id: 'inv-005', patientId: 'patient-456', patientName: 'Maria Lopes', issueDate: '2024-06-01', dueDate: '2024-06-05', amount: 8500.00, status: 'Atrasada' },
];

const mockExpenses: Expense[] = [
  { id: 'exp-001', professionalId: 'prof-1', professionalName: 'Carla Nogueira', paymentDate: '2024-07-05', description: 'Pagamento ref. plantões Junho', amount: 2500.00, status: 'Paga' },
  { id: 'exp-002', professionalId: 'prof-2', professionalName: 'Fábio Bastos', paymentDate: '2024-07-05', description: 'Pagamento ref. plantões Junho', amount: 1800.00, status: 'Paga' },
  { id: 'exp-003', professionalId: 'prof-3', professionalName: 'Diogo Lima', paymentDate: '2024-07-20', description: 'Pagamento ref. plantões Julho', amount: 2100.00, status: 'Pendente' },
];

export const mockTransactions: Transaction[] = [
  ...mockInvoices.map(inv => ({ type: 'receita' as const, data: inv, transactionDate: inv.issueDate })),
  ...mockExpenses.map(exp => ({ type: 'despesa' as const, data: exp, transactionDate: exp.paymentDate })),
].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

export const mockMonthlyRevenue = [
  { month: format(subMonths(today, 5), 'MMM', { locale: ptBR }), revenue: 15200 },
  { month: format(subMonths(today, 4), 'MMM', { locale: ptBR }), revenue: 17800 },
  { month: format(subMonths(today, 3), 'MMM', { locale: ptBR }), revenue: 16500 },
  { month: format(subMonths(today, 2), 'MMM', { locale: ptBR }), revenue: 19800 },
  { month: format(subMonths(today, 1), 'MMM', { locale: ptBR }), revenue: 21500 },
  { month: format(today, 'MMM', { locale: ptBR }), revenue: 10650 },
];
