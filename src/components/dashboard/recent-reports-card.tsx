import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ShiftReport } from '@/lib/types';

function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    return `${diffInDays} dias atrás`;
}


export function RecentReportsCard({ reports }: { reports: ShiftReport[] }) {
  return (
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Relatórios de Plantão Recentes
            </CardTitle>
            <CardDescription>Últimas atualizações da equipe de cuidado.</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
            {reports.map((report) => (
            <div key={report.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm">{report.careTeamMemberName}</p>
                    <Badge variant={report.shift === 'Diurno' ? 'secondary' : 'default'} className="text-xs">
                        {report.shift} - {formatRelativeDate(report.reportDate)}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{report.observations}</p>
            </div>
            ))}
            {reports.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Nenhum relatório recente.</p>
            )}
        </div>
        <Link href="/reports">
            <p className="text-sm text-primary hover:underline mt-4 text-center font-medium">
            Ver todos os relatórios →
            </p>
        </Link>
        </CardContent>
    </Card>
  );
}
