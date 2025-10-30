import Link from 'next/link';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Patient } from '@/lib/types';
import { Badge } from '../ui/badge';

export function PatientInfoCard({ patient }: { patient: Patient }) {
  return (
    <Card className="border-l-4 border-primary shadow-sm">
        <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                CPF: {patient.cpf} | Tipo Sanguíneo: {patient.bloodType}
                </p>
            </div>
            </div>
            <Link href={`/patients/${patient.id}`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Ver Prontuário →
            </Badge>
            </Link>
        </div>
        </CardHeader>
    </Card>
  );
}
