import { notFound } from 'next/navigation';

import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
import { PatientHeader } from '@/components/patients/v2/patient-header';
import { PatientTabs } from '@/components/patients/v2/patient-tabs';
import type { ClientProfessional } from '@/components/patients/v2/types';
import { savePatientSnapshot } from './actions';

type PatientPageProps = {
  params: { patientId: string };
};

export default async function PatientPage({ params }: PatientPageProps) {
  const patient = mockPatients.find((item) => item.id === params.patientId);
  const professionals: ClientProfessional[] = mockProfessionals.map(({ compatibilityTags, ...rest }) => ({
    ...rest,
    compatibilityTags: compatibilityTags?.map(({ text, variant }) => ({ text, variant })),
  }));

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-10">
      <PatientHeader patient={patient} onSave={savePatientSnapshot} />
      <PatientTabs patient={patient} professionals={professionals} />
    </div>
  );
}
