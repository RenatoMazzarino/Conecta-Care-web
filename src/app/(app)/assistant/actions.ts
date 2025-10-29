'use server';

import { askMedicalHistory } from '@/ai/flows/ai-medical-history-assistant';
import { patients } from '@/lib/data';

export async function askQuestionAction(
  prevState: any,
  formData: FormData
): Promise<{
  question: string;
  answer: string;
  error?: string;
}> {
  const question = formData.get('question') as string;
  const patientId = patients[0]?.id; // Using first patient for assistant context

  if (!question) {
    return {
      question: '',
      answer: '',
      error: 'Please enter a question.',
    };
  }

  if (!patientId) {
    return {
      question,
      answer: '',
      error: 'No patient data available to ask questions about.'
    }
  }

  try {
    const result = await askMedicalHistory({
      patientId: patientId,
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
