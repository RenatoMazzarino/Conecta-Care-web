'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Upload, FileText, Download, MoreVertical, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

const mockDocuments = [
    { name: 'RG_Frente.pdf', category: 'Documento de Identidade', date: '2023-01-15' },
    { name: 'Certificado_COREN.pdf', category: 'Certificação Profissional', date: '2023-01-15' },
    { name: 'Comprovante_Residencia.jpg', category: 'Comprovante de Endereço', date: '2023-02-01' },
    { name: 'Curso_BLS.pdf', category: 'Curso Complementar', date: '2023-05-20' },
];

export function TeamDocumentsTab() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Documentos do Profissional</CardTitle>
                        <CardDescription>Armazene e gerencie os documentos cadastrais e certificações.</CardDescription>
                    </div>
                    <Button><Upload className="mr-2 h-4 w-4"/>Fazer Upload</Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDocuments.map((doc, index) => (
                    <div key={index} className="group relative flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50">
                        <div className="p-3 bg-muted rounded-md">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.category}</p>
                            <p className="text-xs text-muted-foreground mt-1">Enviado em: {doc.date}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7">
                                    <MoreVertical className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/>Visualizar</DropdownMenuItem>
                                <DropdownMenuItem><Download className="mr-2 h-4 w-4"/>Download</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
                {mockDocuments.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-8">Nenhum documento encontrado.</p>
                )}
            </CardContent>
        </Card>
    )
}
