import { notFound } from 'next/navigation';

import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
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
    <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col gap-8 px-4 pb-10 pt-8 sm:px-6 lg:px-10">
      <PatientTabs patient={patient} professionals={professionals} onSave={savePatientSnapshot} withHeader />
    </main>
  );
}
