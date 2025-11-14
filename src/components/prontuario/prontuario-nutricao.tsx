'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Filter } from 'lucide-react';
import { Button } from '../ui/button';

export function ProntuarioNutricao() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Apple className="w-5 h-5 text-primary"/>
                            Acompanhamento Nutricional
                        </CardTitle>
                        <CardDescription>Plano alimentar, avaliações e evoluções da equipe de nutrição.</CardDescription>
                    </div>
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filtrar</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-80">
                    <Apple className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Nenhum acompanhamento nutricional registrado</h3>
                    <p className="text-sm text-muted-foreground mt-2">Esta área exibirá o plano alimentar e as avaliações.</p>
                     <Button variant="secondary" className="mt-4" disabled>Adicionar Avaliação (Em Breve)</Button>
                </div>
            </CardContent>
        </Card>
    )
}
