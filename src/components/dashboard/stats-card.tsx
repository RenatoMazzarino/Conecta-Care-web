import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ArrowDown, ArrowRight, ArrowUp, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend: string;
    trendDirection: 'up' | 'down' | 'none';
}

const trendConfig = {
    up: { icon: ArrowUp, color: 'text-red-600' },
    down: { icon: ArrowDown, color: 'text-green-600' },
    none: { icon: ArrowRight, color: 'text-muted-foreground' }
}

export function StatsCard({ title, value, icon: Icon, trend, trendDirection }: StatsCardProps) {
  const TrendIcon = trendConfig[trendDirection].icon;
  const trendColor = trendConfig[trendDirection].color;

  const handleQuickAction = (action: string) => {
    trackEvent({
        eventName: 'quick_action',
        properties: {
            action: action,
            target_type: 'kpi_card',
            target_id: title
        }
    })
  }

  return (
      <Card className="flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
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
