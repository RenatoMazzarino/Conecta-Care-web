'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTubeDiagonal, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';


export function ProntuarioExames() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultados de Exames</CardTitle>
                <CardDescription>Visualize e compare os resultados dos exames laboratoriais.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-80">
                    <div className="mb-4 rounded-full border border-dashed p-4">
                        <TestTubeDiagonal className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-semibold mb-2">Upload de Resultados de Exames</div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        A funcionalidade para anexar e visualizar resultados de exames será implementada em breve.
                    </p>
                    <Button variant="outline" disabled>
                        Anexar Exame (Em Breve)
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
