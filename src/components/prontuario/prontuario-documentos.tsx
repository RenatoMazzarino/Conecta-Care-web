'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

const mockDocuments = [
    { id: 'doc-001', name: 'Hemograma Completo.pdf', category: 'Exame Laboratorial', date: '2024-07-15', uploader: 'Dr. Roberto Alves' },
    { id: 'doc-002', name: 'Receita - Losartana e Metformina.jpg', category: 'Receita', date: '2024-07-10', uploader: 'Dr. Roberto Alves' },
    { id: 'doc-003', name: 'Laudo Tomografia de Tórax.pdf', category: 'Exame de Imagem', date: '2024-06-20', uploader: 'Clínica ImagemX' },
    { id: 'doc-004', name: 'Evolução Fisioterapia.docx', category: 'Fisioterapia', date: '2024-07-18', uploader: 'Fisio. Amanda Costa' },
    { id: 'doc-005', name: 'Plano Alimentar.pdf', category: 'Nutrição', date: '2024-07-01', uploader: 'Nutri. Beatriz Lima' },
];

const categoryColors: { [key: string]: string } = {
    'Exame Laboratorial': 'bg-blue-100 text-blue-800',
    'Receita': 'bg-green-100 text-green-800',
    'Exame de Imagem': 'bg-indigo-100 text-indigo-800',
    'Fisioterapia': 'bg-orange-100 text-orange-800',
    'Nutrição': 'bg-emerald-100 text-emerald-800'
};

export function ProntuarioDocumentos() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('all');

    const filteredDocuments = mockDocuments.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const allCategories = ['all', ...Array.from(new Set(mockDocuments.map(d => d.category)))];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Central de Documentos</CardTitle>
                <CardDescription>Visualize e gerencie todos os documentos e exames do paciente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome do arquivo..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Filtrar por categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            {allCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>
                                    {cat === 'all' ? 'Todas as Categorias' : cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Arquivo</TableHead>
                                <TableHead className="w-[200px]">Categoria</TableHead>
                                <TableHead className="w-[180px]">Data de Upload</TableHead>
                                <TableHead className="w-[200px]">Enviado por</TableHead>
                                <TableHead className="w-[50px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocuments.length > 0 ? (
                                filteredDocuments.map(doc => (
                                    <TableRow key={doc.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={categoryColors[doc.category] || 'bg-gray-100 text-gray-800'}>
                                                {doc.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(doc.date).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell>{doc.uploader}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Visualizar</DropdownMenuItem>
                                                    <DropdownMenuItem>Download</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum documento encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
