
'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
    Home, Building, MapPin, ParkingCircle, Ambulance, Wind, Cigarette, Ear, PawPrint, Users, Router, HardDrive, Droplets, BedDouble
} from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const FormField = ({ label, children, className, labelClassName }: { 
    label: string | React.ReactNode, 
    children: React.ReactNode,
    className?: string,
    labelClassName?: string,
}) => (
    <div className={cn(className)}>
        <Label className={cn("text-xs text-slate-600", labelClassName)}>{label}</Label>
        <div className="mt-1 text-sm text-slate-900 flex items-center gap-2">
            {children}
        </div>
    </div>
);

type FichaEnderecoProps = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: (data: Patient | null) => void;
  isEditing: boolean;
};

export function FichaEndereco({ displayData, editedData, setEditedData, isEditing }: FichaEnderecoProps) {

    if (!displayData || !editedData) return null;
    
    const handleFieldChange = (path: string, value: any) => {
        setEditedData(prevData => {
            if (!prevData) return null;
            const newEditedData = JSON.parse(JSON.stringify(prevData));
            let current = newEditedData;
            const keys = path.split('.');
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newEditedData;
        });
    };
    
    const fullAddress = `${displayData.address.street}, ${displayData.address.number}`
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress + ', ' + displayData.address.city)}`;


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Localização e Identificação
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={gmapsUrl} target="_blank">Ver no Mapa</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <FormField label="CEP">{displayData.address.zipCode}</FormField>
                    <FormField label="Logradouro / Número">{displayData.address.street}, {displayData.address.number}</FormField>
                    <FormField label="Complemento">{displayData.address.complement || '-'}</FormField>
                    <FormField label="Bairro">{displayData.address.neighborhood}</FormField>
                    <FormField label="Cidade / Estado">{displayData.address.city} / {displayData.address.state}</FormField>
                    <FormField label="Ponto de Referência">{displayData.address.pontoReferencia || '-'}</FormField>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        Estrutura Física do Domicílio
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <FormField label="Tipo de Residência">{displayData.domicile?.tipoResidencia || '-'}</FormField>
                     <FormField label="Andar">{displayData.domicile?.floor ? `${displayData.domicile.floor}º` : '-'}</FormField>
                     <FormField label="Elevador">{displayData.domicile?.hasElevator ? 'Sim' : 'Não'}</FormField>
                     <FormField label="Acesso Interno">{displayData.domicile?.internalAccess || 'Não informado'}</FormField>
                     <FormField label="Local de Permanência">{displayData.domicile?.patientRoom || 'Não informado'}</FormField>
                     <FormField label="Banheiro Adaptado">{displayData.domicile?.hasAdaptedBathroom ? 'Sim' : 'Não'}</FormField>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Ambulance className="w-5 h-5 text-primary" />
                        Logística e Acesso
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <FormField label="Acesso para Ambulância">{displayData.domicile?.ambulanceAccess || '-'}</FormField>
                     <FormField label="Estacionamento para Equipe">{displayData.domicile?.teamParking || '-'}</FormField>
                     <FormField label="Procedimento de Entrada">{displayData.domicile?.entryProcedure || '-'}</FormField>
                     <FormField label="Risco de Acesso Noturno">{displayData.domicile?.nightAccessRisk || '-'}</FormField>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Home className="w-5 h-5 text-primary" />
                        Fatores Ambientais e Familiares
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <FormField label="Animais Domésticos"><PawPrint className="w-4 h-4"/>{displayData.domicile?.pets || 'Nenhum'}</FormField>
                     <FormField label="Outros Residentes"><Users className="w-4 h-4"/>{displayData.domicile?.otherResidents?.length || '0'}</FormField>
                     <FormField label="Fumantes no Domicílio"><Cigarette className="w-4 h-4"/>{displayData.domicile?.hasSmokers ? 'Sim' : 'Não'}</FormField>
                     <FormField label="Higiene e Organização">{displayData.domicile?.hygieneConditions || '-'}</FormField>
                     <FormField label="Ventilação"><Wind className="w-4 h-4"/>{displayData.domicile?.ventilation || '-'}</FormField>
                     <FormField label="Nível de Ruído"><Ear className="w-4 h-4"/>{displayData.domicile?.noiseLevel || '-'}</FormField>
                     <FormField label="Internet / Wi-Fi"><Router className="w-4 h-4"/>{displayData.domicile?.hasWifi ? 'Sim' : 'Não'}</FormField>
                     <FormField label="Energia Reserva"><HardDrive className="w-4 h-4"/>{displayData.domicile?.backupPowerSource || '-'}</FormField>
                     <FormField label="Fonte de Água"><Droplets className="w-4 h-4"/>{displayData.domicile?.waterSource || '-'}</FormField>
                </CardContent>
            </Card>
        </div>
    );
}

