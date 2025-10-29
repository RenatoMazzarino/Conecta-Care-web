'use server';

/**
 * @fileOverview An AI agent that provides information about a patient's medical history.
 *
 * - askMedicalHistory - A function that allows healthcare professionals to ask questions about a patient's medical history.
 * - AskMedicalHistoryInput - The input type for the askMedicalHistory function.
 * - AskMedicalHistoryOutput - The return type for the askMedicalHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskMedicalHistoryInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient.'),
  question: z.string().describe('The question about the patient medical history.'),
});
export type AskMedicalHistoryInput = z.infer<typeof AskMedicalHistoryInputSchema>;

const AskMedicalHistoryOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the patient medical history.'),
});
export type AskMedicalHistoryOutput = z.infer<typeof AskMedicalHistoryOutputSchema>;

export async function askMedicalHistory(input: AskMedicalHistoryInput): Promise<AskMedicalHistoryOutput> {
  return askMedicalHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askMedicalHistoryPrompt',
  input: {schema: AskMedicalHistoryInputSchema},
  output: {schema: AskMedicalHistoryOutputSchema},
  prompt: `You are an AI assistant providing information about a patient's medical history.

  You have access to the patient's medical history.
  Answer the following question about the patient:

  Question: {{{question}}}
  Patient ID: {{{patientId}}}`,
});

const askMedicalHistoryFlow = ai.defineFlow(
  {
    name: 'askMedicalHistoryFlow',
    inputSchema: AskMedicalHistoryInputSchema,
    outputSchema: AskMedicalHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

