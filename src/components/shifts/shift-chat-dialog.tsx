'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal } from 'lucide-react';
import type { ActiveShift, ChatMessage as ChatMessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const mockMessages: ChatMessageType[] = [
    { role: 'system', content: 'Chat iniciado em 08/10/2024 às 10:30' },
    { role: 'user', content: 'Bom dia, Carla. Tudo certo por aí? O Sr. João está estável?'},
    { role: 'assistant', content: 'Bom dia! Tudo certo por aqui. Ele está estável, medicação administrada conforme prescrito.'},
    { role: 'user', content: 'Ótimo. Por favor, me avise se precisar de algo.' },
];

export function ShiftChatDialog({
  isOpen,
  onOpenChange,
  shift,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shift: ActiveShift;
}) {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState(mockMessages);
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: newMessage }]);
    setNewMessage('');
    
    toast({
        title: "Mensagem Enviada",
    });

    // Simulate assistant reply
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Ok, recebido.'}]);
    }, 1000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
             <Avatar className={`h-10 w-10 text-md font-bold ${shift.professional.avatarColor}`}>
                <AvatarFallback className={`bg-transparent text-white`}>{shift.professional.initials}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle>Chat com {shift.professional.name}</DialogTitle>
                <DialogDescription>
                    Plantão: {shift.patientName} - {shift.shift}
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-80 w-full pr-4">
            <div className="space-y-4">
                {messages.map((message, index) => {
                    if (message.role === 'system') {
                        return <div key={index} className="text-center text-xs text-muted-foreground py-2">--- {message.content} ---</div>
                    }
                    return (
                    <div
                        key={index}
                        className={cn(
                        'flex items-end gap-2',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.role === 'assistant' && (
                           <Avatar className={`h-8 w-8 text-sm font-bold ${shift.professional.avatarColor}`}>
                                <AvatarFallback className={`bg-transparent text-white`}>{shift.professional.initials}</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-xs rounded-lg p-3 text-sm',
                            message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                        )}
                        >
                        <p>{message.content}</p>
                        </div>
                    </div>
                    )
                })}
            </div>
        </ScrollArea>
        
        <DialogFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Textarea
                    name="message"
                    placeholder="Digite sua mensagem..."
                    className="min-h-0 flex-1 resize-none"
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                />
                <Button type="submit" size="icon">
                    <SendHorizonal className="h-4 w-4" />
                    <span className="sr-only">Enviar</span>
                </Button>
            </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}