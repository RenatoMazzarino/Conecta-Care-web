import { Bell, AlertCircle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const iconMap = {
    supply: { icon: Package, color: 'text-blue-500' },
    alert: { icon: AlertCircle, color: 'text-red-500' },
    info: { icon: Bell, color: 'text-gray-500' },
}


export function CommunicationsCard({ notifications }: { notifications: Notification[] }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>
           <Link href="/communications" className="hover:underline">
                Comunicações
            </Link>
        </CardTitle>
        <CardDescription>Últimos alertas e avisos do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notif) => {
              const Icon = iconMap[notif.type].icon;
              const color = iconMap[notif.type].color;
              return (
              <li key={notif.id} className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md">
                  <div className="mt-1">
                    <Icon className={cn("h-5 w-5", color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notif.timestamp).toLocaleString('pt-BR', { timeZone: 'UTC'})}
                    </p>
                  </div>
              </li>
            )})}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma notificação.</p>
        )}
      </CardContent>
    </Card>
  );
}
