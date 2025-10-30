'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Target, ClipboardCheck, Filter } from 'lucide-react';
import { Button } from '../ui/button';

export function ProntuarioFisioterapia() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-primary"/>
                            Evoluções de Fisioterapia
                        </CardTitle>
                        <CardDescription>Histórico de sessões, exercícios e progresso do paciente.</CardDescription>
                    </div>
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filtrar</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-80">
                    <Dumbbell className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Nenhuma evolução de fisioterapia registrada</h3>
                    <p className="text-sm text-muted-foreground mt-2">Esta área exibirá o histórico de sessões e progressos.</p>
                     <Button variant="secondary" className="mt-4" disabled>Adicionar Evolução (Em Breve)</Button>
                </div>
            </CardContent>
        </Card>
    )
}
