import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ArrowDown, ArrowRight, ArrowUp, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend: string;
    trendDirection: 'up' | 'down' | 'none';
    actions?: { label: string, href?: string, action?: () => void }[];
}

const trendConfig = {
    up: { icon: ArrowUp, color: 'text-red-600' },
    down: { icon: ArrowDown, color: 'text-green-600' },
    none: { icon: ArrowRight, color: 'text-muted-foreground' }
}

export function StatsCard({ title, value, icon: Icon, trend, trendDirection, actions }: StatsCardProps) {
  const TrendIcon = trendConfig[trendDirection].icon;
  const trendColor = trendConfig[trendDirection].color;

  return (
      <Card className="flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {actions && actions.length > 0 ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {actions.map((action, i) => (
                           <DropdownMenuItem key={i} asChild>
                             {action.href ? <Link href={action.href}>{action.label}</Link> : <button onClick={action.action} className="w-full text-left">{action.label}</button>}
                           </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                 <Icon className="h-4 w-4 text-muted-foreground" />
            )}
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{value}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendIcon className={cn("h-3 w-3", trendColor)} />
            <span className={cn("font-semibold", trendColor)}>{trend}</span>
            <span>em relação a ontem</span>
          </div>
        </CardContent>
      </Card>
  );
}
