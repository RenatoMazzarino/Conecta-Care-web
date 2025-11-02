
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    isActive?: boolean;
    onClick?: () => void;
}

export function StatsCard({ title, value, icon: Icon, isActive = false, onClick }: StatsCardProps) {
  return (
      <Card 
        className={cn(
            "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
            onClick && "cursor-pointer",
            isActive && "ring-2 ring-primary bg-primary/5"
        )}
        onClick={onClick}
       >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">
            Clique para filtrar
          </p>
        </CardContent>
      </Card>
  );
}
