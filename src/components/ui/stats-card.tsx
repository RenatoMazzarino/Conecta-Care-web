
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from '@phosphor-icons/react';
import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ComponentType<IconProps>;
    comparisonText?: string;
    trend?: 'up' | 'down' | 'neutral';
    isActive?: boolean;
    onClick?: () => void;
}

const trendConfig = {
    up: { icon: ArrowUp, color: 'text-green-600' },
    down: { icon: ArrowDown, color: 'text-red-600' },
    neutral: { icon: Minus, color: 'text-muted-foreground' },
}

export function StatsCard({ title, value, icon: Icon, comparisonText, trend = 'neutral', isActive = false, onClick }: StatsCardProps) {
  const TrendIcon = trendConfig[trend].icon;
  const trendColor = trendConfig[trend].color;
  
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
          {comparisonText && (
            <p className={cn("text-xs flex items-center gap-1", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                {comparisonText}
            </p>
          )}
        </CardContent>
      </Card>
  );
}
