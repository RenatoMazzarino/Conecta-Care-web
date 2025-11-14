'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Building, MapPin, Users, Globe, KeyRound, Clock, Shield, Camera, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FormField = ({
  label,
  children,
  className,
  labelClassName,
}: {
  label: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}) => (
  <div className={cn(className)}>
    <Label className={cn('text-xs text-slate-600', labelClassName)}>{label}</Label>
    <div className="mt-1 text-sm text-slate-900 flex flex-col gap-2">{children}</div>
  </div>
);

const boolOptions = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
];

const zoneOptions = ['Urbana', 'Rural', 'Condomínio Fechado'];
const waterSources = ['Rede Pública', 'Poço', 'Cisterna'];
const backupOptions = ['Gerador', 'Nobreak', 'Inexistente'];
const ambulanceAccess = ['Fácil', 'Médio', 'Difícil'];
const parkingOptions = ['Disponível', 'Restrito', 'Inexistente'];
const hygieneOptions = ['Boa', 'Regular', 'Ruim'];
const ventilationOptions = ['Adequada', 'Insuficiente', 'Artificial'];
const noiseOptions = ['Baixo', 'Médio', 'Alto'];
const riskOptions = ['Baixo', 'Médio', 'Alto'];

type Props = {
  displayData: Patient | null;
  editedData: Patient | null;
  setEditedData: React.Dispatch<React.SetStateAction<Patient | null>>;
  isEditing: boolean;
};

export function FichaEndereco({ displayData, editedData, setEditedData, isEditing }: Props) {
  if (!displayData || !editedData) return null;

  const dataForView = isEditing ? editedData : displayData;
  const address = dataForView.address;
  const domicile = dataForView.domicile ?? {};
  const fullAddress = `${address.street}, ${address.number}`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${fullAddress}, ${address.city}`)}`;

  const handleAddressChange = (field: keyof Patient['address'], value: string) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.address = {
        ...next.address,
        [field]: value,
      };
      return next;
    });
  };

  const handleGeolocationChange = (key: 'lat' | 'lng', value: string) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const parsed = value === '' ? undefined : Number(value);
      const existing = { ...(next.address.geolocation ?? {}) };
      if (parsed === undefined || Number.isNaN(parsed)) {
        delete existing[key];
      } else {
        existing[key] = parsed;
      }
      if (existing.lat === undefined && existing.lng === undefined) {
        delete next.address.geolocation;
      } else {
        next.address.geolocation = existing as { lat: number; lng: number };
      }
      return next;
    });
  };

  const handleDomicileChange = (field: keyof NonNullable<Patient['domicile']>, value: unknown) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const current = { ...(next.domicile ?? {}) } as NonNullable<Patient['domicile']>;
      const shouldDelete =
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);
      if (shouldDelete && typeof value !== 'boolean') {
        delete current[field];
      } else {
        current[field] = value as never;
      }
      next.domicile = current;
      return next;
    });
  };

  const handleBooleanDomicile = (field: keyof NonNullable<Patient['domicile']>, value: string) => {
    handleDomicileChange(field, value === 'true');
  };

  const handleAccessibilityChange = (value: string) => {
    const items = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    handleDomicileChange('accessibilityFeatures', items);
  };

  const residents = domicile.otherResidents ?? [];

  const handleResidentChange = (index: number, field: 'name' | 'relationship', value: string) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const current = [...(next.domicile?.otherResidents ?? [])];
      current[index] = { ...(current[index] ?? { name: '', relationship: '' }), [field]: value };
      next.domicile = {
        ...(next.domicile ?? {}),
        otherResidents: current,
      };
      return next;
    });
  };

  const addResident = () => {
    handleDomicileChange('otherResidents', [...residents, { name: '', relationship: '' }]);
  };

  const removeResident = (index: number) => {
    handleDomicileChange(
      'otherResidents',
      residents.filter((_, i) => i !== index),
    );
  };

  const renderBoolean = (value?: boolean) => (value === undefined ? '-' : value ? 'Sim' : 'Não');
  const renderList = (list?: string[]) => (list && list.length > 0 ? list.join(', ') : '-');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Localização e identificação
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={gmapsUrl} target="_blank">
                Ver no mapa
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField label="CEP" className="md:col-span-2">
            {isEditing ? (
              <Input value={address.zipCode} onChange={(e) => handleAddressChange('zipCode', e.target.value)} />
            ) : (
              address.zipCode
            )}
          </FormField>
          <FormField label="Logradouro / número" className="md:col-span-2">
            {isEditing ? (
              <div className="flex flex-col md:flex-row gap-2">
                <Input value={address.street} onChange={(e) => handleAddressChange('street', e.target.value)} placeholder="Rua" />
                <Input value={address.number} onChange={(e) => handleAddressChange('number', e.target.value)} placeholder="Número" className="md:w-32" />
              </div>
            ) : (
              `${address.street}, ${address.number}`
            )}
          </FormField>
          <FormField label="Complemento" className="md:col-span-2">
            {isEditing ? (
              <Input value={address.complement ?? ''} onChange={(e) => handleAddressChange('complement', e.target.value)} />
            ) : (
              address.complement || '-'
            )}
          </FormField>
          <FormField label="Bairro" className="md:col-span-2">
            {isEditing ? (
              <Input value={address.neighborhood} onChange={(e) => handleAddressChange('neighborhood', e.target.value)} />
            ) : (
              address.neighborhood
            )}
          </FormField>
          <FormField label="Cidade / estado" className="md:col-span-2">
            {isEditing ? (
              <div className="flex flex-col md:flex-row gap-2">
                <Input value={address.city} onChange={(e) => handleAddressChange('city', e.target.value)} placeholder="Cidade" />
                <Input value={address.state} onChange={(e) => handleAddressChange('state', e.target.value)} placeholder="UF" className="md:w-24" />
              </div>
            ) : (
              `${address.city} / ${address.state}`
            )}
          </FormField>
          <FormField label="Ponto de referência" className="md:col-span-2">
            {isEditing ? (
              <Textarea value={address.pontoReferencia ?? ''} onChange={(e) => handleAddressChange('pontoReferencia', e.target.value)} rows={2} />
            ) : (
              address.pontoReferencia || '-'
            )}
          </FormField>
          <FormField
            label={
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Tipo de zona
              </span>
            }
          >
            {isEditing ? (
              <Select value={address.zoneType ?? ''} onValueChange={(value) => handleAddressChange('zoneType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {zoneOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              address.zoneType || '-'
            )}
          </FormField>
          <FormField
            label={
              <span className="flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                Identificação na portaria
              </span>
            }
          >
            {isEditing ? (
              <Input value={address.gateIdentification ?? ''} onChange={(e) => handleAddressChange('gateIdentification', e.target.value)} />
            ) : (
              address.gateIdentification || '-'
            )}
          </FormField>
          <FormField
            label={
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Horários de visita
              </span>
            }
          >
            {isEditing ? (
              <Input value={address.allowedVisitHours ?? ''} onChange={(e) => handleAddressChange('allowedVisitHours', e.target.value)} />
            ) : (
              address.allowedVisitHours || 'Não especificado'
            )}
          </FormField>
          <FormField
            label={
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Condições de segurança
              </span>
            }
          >
            {isEditing ? (
              <Textarea value={address.localSafetyConditions ?? ''} onChange={(e) => handleAddressChange('localSafetyConditions', e.target.value)} rows={2} />
            ) : (
              address.localSafetyConditions || 'Não especificado'
            )}
          </FormField>
          <FormField
            label={
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Geolocalização
              </span>
            }
          >
            {isEditing ? (
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  type="number"
                  step="any"
                  value={address.geolocation?.lat?.toString() ?? ''}
                  onChange={(e) => handleGeolocationChange('lat', e.target.value)}
                  placeholder="Latitude"
                />
                <Input
                  type="number"
                  step="any"
                  value={address.geolocation?.lng?.toString() ?? ''}
                  onChange={(e) => handleGeolocationChange('lng', e.target.value)}
                  placeholder="Longitude"
                />
              </div>
            ) : address.geolocation ? (
              `${address.geolocation.lat}, ${address.geolocation.lng}`
            ) : (
              '-'
            )}
          </FormField>
          <FormField
            label={
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Foto da fachada
              </span>
            }
          >
            {isEditing ? (
              <Input type="url" placeholder="URL da imagem" value={address.facadeImageUrl ?? ''} onChange={(e) => handleAddressChange('facadeImageUrl', e.target.value)} />
            ) : address.facadeImageUrl ? (
              <Button variant="secondary" size="sm" asChild>
                <Link href={address.facadeImageUrl} target="_blank">
                  Abrir
                </Link>
              </Button>
            ) : (
              'Não disponível'
            )}
          </FormField>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Estrutura do domicílio
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField label="Tipo de residência">
            {isEditing ? (
              <Input value={domicile.tipoResidencia ?? ''} onChange={(e) => handleDomicileChange('tipoResidencia', e.target.value)} />
            ) : (
              domicile.tipoResidencia || '-'
            )}
          </FormField>
          <FormField label="Acesso interno">
            {isEditing ? (
              <Input value={domicile.internalAccess ?? ''} onChange={(e) => handleDomicileChange('internalAccess', e.target.value)} />
            ) : (
              domicile.internalAccess || '-'
            )}
          </FormField>
          <FormField label="Quarto do paciente">
            {isEditing ? (
              <Input value={domicile.patientRoom ?? ''} onChange={(e) => handleDomicileChange('patientRoom', e.target.value)} />
            ) : (
              domicile.patientRoom || '-'
            )}
          </FormField>
          <FormField label="Pavimento">
            {isEditing ? (
              <Input
                type="number"
                value={domicile.floor?.toString() ?? ''}
                onChange={(e) =>
                  handleDomicileChange('floor', e.target.value === '' ? undefined : Number(e.target.value))
                }
              />
            ) : (
              domicile.floor ?? '-'
            )}
          </FormField>
          <FormField label="Possui elevador?">
            {isEditing ? (
              <Select
                value={domicile.hasElevator === undefined ? '' : domicile.hasElevator ? 'true' : 'false'}
                onValueChange={(value) => handleBooleanDomicile('hasElevator', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {boolOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              renderBoolean(domicile.hasElevator)
            )}
          </FormField>
          <FormField label="Infraestrutura elétrica">
            {isEditing ? (
              <Textarea value={domicile.electricalInfrastructure ?? ''} onChange={(e) => handleDomicileChange('electricalInfrastructure', e.target.value)} rows={2} />
            ) : (
              domicile.electricalInfrastructure || '-'
            )}
          </FormField>
          <FormField label="Fonte de água">
            {isEditing ? (
              <Select value={domicile.waterSource ?? ''} onValueChange={(value) => handleDomicileChange('waterSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {waterSources.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.waterSource || '-'
            )}
          </FormField>
          <FormField label="Tem Wi-Fi?">
            {isEditing ? (
              <Select
                value={domicile.hasWifi === undefined ? '' : domicile.hasWifi ? 'true' : 'false'}
                onValueChange={(value) => handleBooleanDomicile('hasWifi', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {boolOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              renderBoolean(domicile.hasWifi)
            )}
          </FormField>
          <FormField label="Energia backup">
            {isEditing ? (
              <Select value={domicile.backupPowerSource ?? ''} onValueChange={(value) => handleDomicileChange('backupPowerSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {backupOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.backupPowerSource || '-'
            )}
          </FormField>
          <FormField label="Banheiro adaptado">
            {isEditing ? (
              <Select
                value={domicile.hasAdaptedBathroom === undefined ? '' : domicile.hasAdaptedBathroom ? 'true' : 'false'}
                onValueChange={(value) => handleBooleanDomicile('hasAdaptedBathroom', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {boolOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              renderBoolean(domicile.hasAdaptedBathroom)
            )}
          </FormField>
          <FormField label="Acesso para ambulância">
            {isEditing ? (
              <Select value={domicile.ambulanceAccess ?? ''} onValueChange={(value) => handleDomicileChange('ambulanceAccess', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ambulanceAccess.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.ambulanceAccess || '-'
            )}
          </FormField>
          <FormField label="Estacionamento para equipe">
            {isEditing ? (
              <Select value={domicile.teamParking ?? ''} onValueChange={(value) => handleDomicileChange('teamParking', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {parkingOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.teamParking || '-'
            )}
          </FormField>
          <FormField label="Procedimento de entrada" className="md:col-span-2">
            {isEditing ? (
              <Textarea value={domicile.entryProcedure ?? ''} onChange={(e) => handleDomicileChange('entryProcedure', e.target.value)} rows={2} />
            ) : (
              domicile.entryProcedure || '-'
            )}
          </FormField>
          <FormField label="Risco de acesso noturno" className="md:col-span-2">
            {isEditing ? (
              <Select value={domicile.nightAccessRisk ?? ''} onValueChange={(value) => handleDomicileChange('nightAccessRisk', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {riskOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.nightAccessRisk || '-'
            )}
          </FormField>
          <FormField label="Obstáculos atuais" className="md:col-span-2">
            {isEditing ? (
              <Textarea value={domicile.currentObstacles ?? ''} onChange={(e) => handleDomicileChange('currentObstacles', e.target.value)} rows={2} />
            ) : (
              domicile.currentObstacles || 'Não informado'
            )}
          </FormField>
          <FormField label="Recursos de acessibilidade" className="md:col-span-2">
            {isEditing ? (
              <Textarea
                rows={3}
                placeholder="Digite um item por linha"
                value={(domicile.accessibilityFeatures ?? []).join('\n')}
                onChange={(e) => handleAccessibilityChange(e.target.value)}
              />
            ) : (
              renderList(domicile.accessibilityFeatures)
            )}
          </FormField>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Fatores ambientais e familiares
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField label="Animais" className="md:col-span-2">
            {isEditing ? (
              <Input value={domicile.pets ?? ''} onChange={(e) => handleDomicileChange('pets', e.target.value)} />
            ) : (
              domicile.pets || 'Nenhum'
            )}
          </FormField>
          <FormField label="Fumantes">
            {isEditing ? (
              <Select
                value={domicile.hasSmokers === undefined ? '' : domicile.hasSmokers ? 'true' : 'false'}
                onValueChange={(value) => handleBooleanDomicile('hasSmokers', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {boolOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              renderBoolean(domicile.hasSmokers)
            )}
          </FormField>
          <FormField label="Ventilação">
            {isEditing ? (
              <Select value={domicile.ventilation ?? ''} onValueChange={(value) => handleDomicileChange('ventilation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ventilationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.ventilation || 'Não informado'
            )}
          </FormField>
          <FormField label="Nível de ruído">
            {isEditing ? (
              <Select value={domicile.noiseLevel ?? ''} onValueChange={(value) => handleDomicileChange('noiseLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {noiseOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.noiseLevel || 'Não informado'
            )}
          </FormField>
          <FormField label="Higiene geral">
            {isEditing ? (
              <Select value={domicile.hygieneConditions ?? ''} onValueChange={(value) => handleDomicileChange('hygieneConditions', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {hygieneOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              domicile.hygieneConditions || 'Não informado'
            )}
          </FormField>
          <FormField label="Pessoas que residem" className="md:col-span-2">
            {isEditing ? (
              <div className="space-y-3">
                {residents.length === 0 && <p className="text-sm text-muted-foreground">Nenhum responsável informado.</p>}
                {residents.map((resident, index) => (
                  <div key={`${index}-${resident.name}`} className="border rounded-lg p-3 space-y-2">
                    <div className="flex flex-col gap-2">
                      <Input placeholder="Nome" value={resident.name} onChange={(e) => handleResidentChange(index, 'name', e.target.value)} />
                      <Input
                        placeholder="Parentesco"
                        value={resident.relationship}
                        onChange={(e) => handleResidentChange(index, 'relationship', e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 self-start" onClick={() => removeResident(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addResident}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar residente
                </Button>
              </div>
            ) : (
              residents.map((resident) => `${resident.name} (${resident.relationship})`).join(', ') || 'Não informado'
            )}
          </FormField>
          <FormField label="Cuidadores fixos" className="md:col-span-2">
            {isEditing ? (
              <Textarea value={domicile.fixedCaregivers ?? ''} onChange={(e) => handleDomicileChange('fixedCaregivers', e.target.value)} rows={2} />
            ) : (
              domicile.fixedCaregivers || 'Não informado'
            )}
          </FormField>
          <FormField label="Riscos ambientais" className="md:col-span-2">
            {isEditing ? (
              <Textarea value={domicile.environmentalRisks ?? ''} onChange={(e) => handleDomicileChange('environmentalRisks', e.target.value)} rows={2} />
            ) : (
              domicile.environmentalRisks || 'Nenhum identificado'
            )}
          </FormField>
          <FormField label="Observações gerais" className="md:col-span-2">
            {isEditing ? (
              <Textarea value={domicile.generalObservations ?? ''} onChange={(e) => handleDomicileChange('generalObservations', e.target.value)} rows={3} />
            ) : (
              domicile.generalObservations || 'Nenhuma observação.'
            )}
          </FormField>
        </CardContent>
      </Card>
    </div>
  );
}
