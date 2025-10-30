'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

export function ProntuarioDocumentos() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>Laudos, receitas e outros arquivos do paciente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center h-80">
                    <div className="mb-4">
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-semibold mb-2">Upload de Documentos</div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Funcionalidade de upload de arquivos será implementada em breve.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
