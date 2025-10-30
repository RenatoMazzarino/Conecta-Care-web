'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { patients } from '@/lib/data';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const linkedPatients = [patients[0], patients[2]]; // Mock data

export function TeamPatientsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pacientes Vinculados</CardTitle>
                <CardDescription>Lista de pacientes que este profissional atende ou já atendeu.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {linkedPatients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{patient.name}</p>
                                <p className="text-sm text-muted-foreground">Último plantão: 2d atrás</p>
                            </div>
                        </div>
                         <Button variant="ghost" size="icon" asChild>
                            <Link href={`/patients/${patient.id}`}>
                                <ArrowRight className="h-4 w-4"/>
                            </Link>
                        </Button>
                    </div>
               ))}
               {linkedPatients.length === 0 && (
                 <p className="text-muted-foreground col-span-full text-center py-8">Nenhum paciente vinculado.</p>
               )}
            </CardContent>
        </Card>
    )
}
