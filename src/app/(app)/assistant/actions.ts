'use server';

import { askMedicalHistory } from '@/ai/flows/ai-medical-history-assistant';
import { patient } from '@/lib/data';

export async function askQuestionAction(
  prevState: any,
  formData: FormData
): Promise<{
  question: string;
  answer: string;
  error?: string;
}> {
  const question = formData.get('question') as string;

  if (!question) {
    return {
      question: '',
      answer: '',
      error: 'Please enter a question.',
    };
  }

  try {
    const result = await askMedicalHistory({
      patientId: patient.id,
      question: question,
    });
    return {
      question,
      answer: result.answer,
    };
  } catch (error) {
    console.error(error);
    return {
      question,
      answer: '',
      error: 'Sorry, I was unable to answer the question. Please try again.',
    };
  }
}
