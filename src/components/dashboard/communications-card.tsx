import { Bell, AlertCircle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';


const iconMap = {
    supply: { icon: Package, color: 'text-blue-500' },
    alert: { icon: AlertCircle, color: 'text-red-500' },
    info: { icon: Bell, color: 'text-gray-500' },
}


export function CommunicationsCard({ notifications }: { notifications: Notification[] }) {

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <CardTitle>
           <Link href="/communications" className="hover:underline">
                Comunicações
            </Link>
        </CardTitle>
        <CardDescription>Últimos alertas e avisos do sistema.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {notifications.length > 0 ? (
          <ScrollArea className="flex-1">
            <ul className="space-y-2 pr-2">
              {notifications.map((notif) => {
                const Icon = iconMap[notif.type].icon;
                const color = iconMap[notif.type].color;
                return (
                <li key={notif.id}>
                  <Link href="/communications" className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-md">
                      <div className="mt-1">
                        <Icon className={cn("h-5 w-5", color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.timestamp).toLocaleString('pt-BR', { timeZone: 'UTC'})}
                        </p>
                      </div>
                  </Link>
                </li>
              )})}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground text-center flex-1 flex items-center justify-center">Nenhuma notificação.</p>
        )}
      </CardContent>
    </Card>
  );
}
