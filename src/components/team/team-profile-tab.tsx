'use client';

import type { Professional } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, Home, Award, UserCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeamProfileTab({ professional }: { professional: Professional }) {

    const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => (
        <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <p className="mt-1 ml-6 text-base text-foreground">{value || '-'}</p>
        </div>
    )

    const compatibilityColors = {
        positive: 'border-green-200 bg-green-50 text-green-700',
        warning: 'border-amber-200 bg-amber-50 text-amber-700',
        default: 'border-border bg-muted/50 text-foreground',
    }
    
    const fullAddress = `${professional.address.street}, ${professional.address.number} - ${professional.address.neighborhood}, ${professional.address.city}/${professional.address.state}`;
    const dateOfBirth = new Date(professional.dateOfBirth).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Dados Cadastrais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem icon={User} label="Nome Completo" value={professional.name} />
                        <InfoItem icon={User} label="CPF" value={professional.cpf} />
                        <InfoItem icon={Calendar} label="Data de Nascimento" value={dateOfBirth} />
                        <InfoItem icon={Badge} label="COREN" value={professional.coren} />
                        <InfoItem icon={Mail} label="Email" value={professional.email} />
                        <InfoItem icon={Phone} label="Telefone" value={professional.phone} />
                    </div>
                     <InfoItem icon={Home} label="Endereço" value={fullAddress} />
                </CardContent>
            </Card>

            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="w-5 h-5 text-primary"/>
                            Status de Atividade
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm font-semibold">{professional.lastActivity || 'Indisponível'}</p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <UserCheck className="w-5 h-5 text-primary"/>
                            Destaques de Compatibilidade
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       {professional.compatibilityTags && professional.compatibilityTags.length > 0 ? (
                            professional.compatibilityTags.map(tag => (
                                 <div key={tag.text} className={cn("flex items-center gap-2 p-2 rounded-md text-sm font-medium", compatibilityColors[tag.variant || 'default'])}>
                                    <tag.icon className="h-4 w-4" />
                                    <span>{tag.text}</span>
                                </div>
                            ))
                       ) : (
                           <p className="text-sm text-muted-foreground text-center py-2">Nenhum destaque especial.</p>
                       )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Award className="w-5 h-5 text-primary"/>
                            Especialidades
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {professional.specialties.map(spec => (
                                <Badge key={spec} variant="secondary" className="text-base py-1 px-3">{spec}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
