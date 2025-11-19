export async function savePatientSnapshot(formData: FormData) {
  'use server';

  const patientId = formData.get('patientId') as string | null;

  // TODO: integrar com Supabase quando disponível.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return { success: true, patientId };
}
