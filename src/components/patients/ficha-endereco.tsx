'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
    Home, Building, MapPin, ParkingCircle, Ambulance, Wind, Cigarette, Ear, PawPrint, Users, Router, HardDrive, Droplets, BedDouble, Globe, KeyRound, Clock, Shield, Camera, Route
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <Card className="lg:col-span-1">
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
                    <FormField label="CEP" className="md:col-span-2">{displayData.address.zipCode}</FormField>
                    <FormField label="Logradouro / Número" className="md:col-span-2">{displayData.address.street}, {displayData.address.number}</FormField>
                    <FormField label="Complemento" className="md:col-span-2">{displayData.address.complement || '-'}</FormField>
                    <FormField label="Bairro" className="md:col-span-2">{displayData.address.neighborhood}</FormField>
                    <FormField label="Cidade / Estado" className="md:col-span-2">{displayData.address.city} / {displayData.address.state}</FormField>
                    <FormField label="Ponto de Referência" className="md:col-span-2">{displayData.address.pontoReferencia || '-'}</FormField>
                    
                    <FormField label={<div className='flex items-center gap-1'><Globe className="w-3 h-3"/> Tipo de Zona</div>} className="md:col-span-1">
                        {displayData.address.zoneType || '-'}
                    </FormField>
                    <FormField label={<div className='flex items-center gap-1'><KeyRound className="w-3 h-3"/> Identificação na Portaria</div>} className="md:col-span-1">
                        {displayData.address.gateIdentification || '-'}
                    </FormField>
                    <FormField label={<div className='flex items-center gap-1'><Clock className="w-3 h-3"/> Horário de Visitas</div>} className="md:col-span-1">
                        {displayData.address.allowedVisitHours || 'Não especificado'}
                    </FormField>
                    <FormField label={<div className='flex items-center gap-1'><Shield className="w-3 h-3"/> Condições de Segurança</div>} className="md:col-span-1">
                        {displayData.address.localSafetyConditions || 'Não especificado'}
                    </FormField>

                     <FormField label={<div className='flex items-center gap-1'><MapPin className="w-3 h-3"/> Geolocalização</div>} className="md:col-span-1">
                        {displayData.address.geolocation ? `${displayData.address.geolocation.lat}, ${displayData.address.geolocation.lng}` : '-'}
                    </FormField>
                    <FormField label={<div className='flex items-center gap-1'><Camera className="w-3 h-3"/> Foto da Fachada</div>} className="md:col-span-1">
                         {displayData.address.facadeImageUrl ? (
                            <Button variant="secondary" size="sm" asChild>
                                <Link href={displayData.address.facadeImageUrl} target="_blank">Ver Foto</Link>
                            </Button>
                        ) : '-'}
                    </FormField>
                </CardContent>
            </Card>

            <Card className="lg:col-span-1">
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
                     <FormField label="Infraestrutura Elétrica">{displayData.domicile?.electricalInfrastructure || 'Não informado'}</FormField>
                     <FormField label="Fonte de Água">{displayData.domicile?.waterSource || 'Não informado'}</FormField>
                     <FormField label="Internet / Wi-Fi">{displayData.domicile?.hasWifi ? 'Sim' : 'Não'}</FormField>
                     <FormField label="Fonte de Energia Reserva">{displayData.domicile?.backupPowerSource || 'Não informado'}</FormField>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Route className="w-5 h-5 text-primary" />
                        Logística e Acesso
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <FormField label="Acesso Ambulância">{displayData.domicile?.ambulanceAccess || '-'}</FormField>
                     <FormField label="Estacionamento Equipe">{displayData.domicile?.teamParking || '-'}</FormField>
                     <FormField label="Procedimento de Entrada" className="md:col-span-2">{displayData.domicile?.entryProcedure || '-'}</FormField>
                     <FormField label="Risco Acesso Noturno">{displayData.domicile?.nightAccessRisk || '-'}</FormField>
                     <FormField label="Obstáculos Atuais">{displayData.domicile?.currentObstacles || 'Nenhum'}</FormField>
                </CardContent>
            </Card>
        </div>
    );
}
