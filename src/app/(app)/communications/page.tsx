
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Archive, Inbox, Send, Search, Users, FileText, Trash2, Mail, Bot, Phone, CheckSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { patients } from '@/lib/data';

const mockConversations = [
  {
    id: 'convo-1',
    type: 'whatsapp',
    sender: 'Maria da Silva (Familiar)',
    patientId: 'patient-123',
    subject: 'Re: Solicitação de Soro Fisiológico',
    preview: 'Olá, acabei de ver a solicitação. Já fiz a compra, meu filho entrega hoje à tarde, ok?',
    timestamp: '2h atrás',
    read: false,
    content: [
        { role: 'system', text: 'Solicitação de suprimentos enviada via sistema.'},
        { role: 'assistant', text: 'Olá, Sra. Maria. Estamos precisando de 2 unidades de Soro Fisiológico para o Sr. João.'},
        { role: 'user', text: 'Olá, acabei de ver a solicitação. Já fiz a compra, meu filho entrega hoje à tarde, ok?'},
    ]
  },
  {
    id: 'convo-2',
    type: 'email',
    sender: 'lab.diagnosticos@labemail.com',
    patientId: 'patient-456',
    subject: 'Resultado de Exame: Maria Lopes',
    preview: 'Prezados, segue em anexo o resultado do hemograma completo da paciente Maria Lopes...',
    timestamp: '8h atrás',
    read: true,
    content: [
        { role: 'system', text: 'E-mail recebido.'},
        { role: 'user', text: 'Prezados, segue em anexo o resultado do hemograma completo da paciente Maria Lopes. Atenciosamente, Lab Diagnósticos.'}
    ]
  },
  {
    id: 'convo-3',
    type: 'chat',
    sender: 'Carla Nogueira (Enfermeira)',
    patientId: 'patient-123',
    subject: 'Observação sobre o Sr. João',
    preview: 'Apenas para registrar, o paciente apresentou uma leve melhora no apetite hoje durante o almoço.',
    timestamp: 'Ontem',
    read: true,
    content: [
         { role: 'user', text: 'Apenas para registrar, o paciente apresentou uma leve melhora no apetite hoje durante o almoço.'},
    ]
  },
   {
    id: 'convo-4',
    type: 'system',
    sender: 'Sistema CareSync',
    patientId: 'patient-789',
    subject: 'Alerta de Estoque Baixo',
    preview: 'O item "Salbutamol" atingiu o nível de estoque baixo. Restam 3 unidades.',
    timestamp: '2 dias atrás',
    read: true,
    content: [
        { role: 'system', text: 'O item "Salbutamol" atingiu o nível de estoque baixo. Restam 3 unidades.' },
    ]
  },
];

const channelIcons = {
    whatsapp: Phone,
    email: Mail,
    chat: Bot,
    system: 'system'
}

export default function CommunicationsPage() {
    const [selectedConversation, setSelectedConversation] = React.useState(mockConversations[0]);
    const patient = patients.find(p => p.id === selectedConversation.patientId);

    return (
      <div className="flex h-[calc(100vh-6.5rem)] bg-background border rounded-lg">
        
        {/* Coluna 1: Canais e Filtros */}
        <aside className="w-72 border-r flex flex-col">
            <div className="p-4">
                <h2 className="text-xl font-bold">Canais</h2>
            </div>
            <nav className="flex-1 px-2 space-y-1">
                 <Button variant="ghost" className="w-full justify-start bg-accent text-accent-foreground">
                    <Inbox className="mr-2 h-4 w-4" /> Caixa de Entrada
                    <Badge className="ml-auto">{mockConversations.filter(c => !c.read).length}</Badge>
                </Button>
                 <Button variant="ghost" className="w-full justify-start">
                    <Send className="mr-2 h-4 w-4" /> Enviados
                </Button>
                 <Button variant="ghost" className="w-full justify-start">
                    <Archive className="mr-2 h-4 w-4" /> Arquivados
                </Button>
                 <Separator className="my-2"/>
                 <Button variant="ghost" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" /> E-mails
                </Button>
                 <Button variant="ghost" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" /> WhatsApp
                </Button>
                 <Button variant="ghost" className="w-full justify-start">
                    <Bot className="mr-2 h-4 w-4" /> Chat Interno
                </Button>
                 <Separator className="my-2"/>
                  <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pacientes</h3>
                  {patients.map(p => (
                    <Button variant="ghost" key={p.id} className="w-full justify-start gap-2">
                       <Avatar className="h-6 w-6">
                            <AvatarImage src={p.avatarUrl} alt={p.name} />
                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{p.name}</span>
                    </Button>
                  ))}
            </nav>
        </aside>

        {/* Coluna 2: Lista de Conversas */}
        <div className="w-96 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-8" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map(convo => {
                 const Icon = channelIcons[convo.type as keyof typeof channelIcons] || FileText;
                return (
                    <div
                        key={convo.id}
                        onClick={() => setSelectedConversation(convo)}
                        className={cn(
                            "relative p-4 border-b cursor-pointer hover:bg-accent",
                            selectedConversation.id === convo.id && 'bg-muted',
                        )}
                    >
                         {!convo.read && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-sm truncate">{convo.sender}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{convo.timestamp}</span>
                        </div>
                        <p className="font-medium mt-1 truncate">{convo.subject}</p>
                        <p className="text-sm text-muted-foreground mt-1 truncate">{convo.preview}</p>
                    </div>
                )
            })}
          </div>
        </div>

        {/* Coluna 3: Detalhe da Mensagem */}
        <main className="flex-1 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={patient?.avatarUrl}/>
                        <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">{selectedConversation.sender}</h2>
                        <p className="text-sm text-muted-foreground">Relacionado a: {patient?.name}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <TooltipProvider>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon"><Users className="h-5 w-5"/></Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Atribuir a um membro da equipe</p></TooltipContent>
                        </Tooltip>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon"><CheckSquare className="h-5 w-5"/></Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Criar Tarefa</p></TooltipContent>
                        </Tooltip>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon"><FileText className="h-5 w-5"/></Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Anexar ao prontuário</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-5 w-5"/></Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Arquivar conversa</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 <h1 className="text-2xl font-bold leading-tight">{selectedConversation.subject}</h1>
                 {selectedConversation.content.map((message, index) => (
                    message.role === 'system' ? (
                         <div key={index} className="text-center text-xs text-muted-foreground py-2 italic">--- {message.text} ---</div>
                    ) : (
                        <div key={index} className={cn("flex items-end gap-2", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                             {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot/></AvatarFallback>
                                </Avatar>
                            )}
                             <div className={cn(
                                'max-w-md rounded-lg p-3 text-sm',
                                message.role === 'user'
                                ? 'bg-secondary text-secondary-foreground rounded-br-none'
                                : 'bg-primary text-primary-foreground rounded-bl-none'
                            )}>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    )
                 ))}
            </div>
            <div className="p-4 border-t bg-muted/50">
                <div className="relative">
                     <Textarea placeholder="Digite sua resposta aqui..." className="pr-20 bg-background"/>
                    <Button className="absolute right-2.5 bottom-2.5">
                        <Send className="mr-2 h-4 w-4"/>
                        Enviar
                    </Button>
                </div>
            </div>
        </main>
      </div>
  );
}
