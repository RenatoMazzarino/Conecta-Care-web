'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChatMessage } from '@/lib/types';
import { askQuestionAction } from '@/app/(app)/assistant/actions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

export function ChatInterface() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I have access to the patient's medical history. How can I help you today?",
    },
  ]);

  const [state, formAction] = useFormState(askQuestionAction, {
    question: '',
    answer: '',
  });

  React.useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }

    if (state.question && state.answer) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: state.question },
        { role: 'assistant', content: state.answer },
      ]);
      formRef.current?.reset();
    }
  }, [state, toast]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [messages])


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <p>{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form
          ref={formRef}
          action={formAction}
          className="flex w-full items-center space-x-2"
        >
          <Textarea
            name="question"
            placeholder="e.g., What are the patient's known allergies?"
            className="min-h-0 flex-1 resize-none"
            rows={1}
            required
          />
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
