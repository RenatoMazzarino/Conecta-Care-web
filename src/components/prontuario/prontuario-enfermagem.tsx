'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Syringe, ClipboardList, Filter } from 'lucide-react';
import { Button } from '../ui/button';

const evolucoes = [
    {
        data: '22/07/2024 - 14:30',
        profissional: 'Enf. Carla Nogueira',
        texto: 'Paciente segue em bom estado geral, orientado, contactante e colaborativo. Sinais vitais estáveis. Aceitou bem a dieta oral. Realizado curativo em MID, sem sinais flogísticos. Deambula com auxílio. Sem queixas álgicas no momento.'
    },
    {
        data: '22/07/2024 - 08:00',
        profissional: 'Téc. Enf. Fábio Bastos',
        texto: 'Assumo o plantão com paciente em repouso no leito, sonolento mas responsivo ao chamado. Higiene oral e corporal realizadas. Administrado medicações conforme prescrição. Monitorização de sinais vitais. Segue em observação.'
    },
    {
        data: '21/07/2024 - 19:30',
        profissional: 'Téc. Enf. Diogo Lima',
        texto: 'Passo o plantão com paciente calmo, assistindo TV no quarto. Jantou bem. Familiares presentes e orientados sobre os cuidados. Sem intercorrências no período.'
    }
];

export function ProntuarioEnfermagem() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary"/>
                                Evoluções de Enfermagem
                            </CardTitle>
                            <CardDescription>Histórico de anotações e evoluções da equipe de enfermagem.</CardDescription>
                        </div>
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filtrar</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {evolucoes.map((evolucao, index) => (
                        <div key={index} className="border-l-4 border-primary/50 pl-4 py-2 bg-muted/30 rounded-r-lg">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-sm text-foreground">{evolucao.profissional}</p>
                                <p className="text-xs text-muted-foreground">{evolucao.data}</p>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{evolucao.texto}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

             <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Syringe className="w-5 h-5 text-primary"/>
                            Prescrição de Enfermagem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Em breve: Detalhes sobre as prescrições de enfermagem.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ClipboardList className="w-5 h-5 text-primary"/>
                            Plano de Cuidados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Em breve: Ações e plano de cuidados de enfermagem.</p>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
