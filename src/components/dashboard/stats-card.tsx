import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    link: string;
}

export function StatsCard({ title, value, icon: Icon, color, link }: StatsCardProps) {
  return (
    <Link href={link}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted">
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
