'use server';
/**
 * @fileOverview An AI agent to handle item requests and requisitions via WhatsApp.
 *
 * - aiItemRequestFromWhatsapp - A function that handles the item request process from WhatsApp.
 * - AIItemRequestFromWhatsappInput - The input type for the aiItemRequestFromWhatsapp function.
 * - AIItemRequestFromWhatsappOutput - The return type for the aiItemRequestFromWhatsapp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIItemRequestFromWhatsappInputSchema = z.object({
  requestText: z.string().describe('The item request text from WhatsApp.'),
});
export type AIItemRequestFromWhatsappInput = z.infer<typeof AIItemRequestFromWhatsappInputSchema>;

const AIItemRequestFromWhatsappOutputSchema = z.object({
  requestedItems: z.array(
    z.object({
      itemName: z.string().describe('The name of the requested item.'),
      quantity: z.number().describe('The quantity of the requested item.'),
    })
  ).describe('A list of items requested with their quantities.'),
  requisitionNotes: z.string().describe('Any additional notes for the requisition.'),
});
export type AIItemRequestFromWhatsappOutput = z.infer<typeof AIItemRequestFromWhatsappOutputSchema>;

export async function aiItemRequestFromWhatsapp(input: AIItemRequestFromWhatsappInput): Promise<AIItemRequestFromWhatsappOutput> {
  return aiItemRequestFromWhatsappFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiItemRequestFromWhatsappPrompt',
  input: {schema: AIItemRequestFromWhatsappInputSchema},
  output: {schema: AIItemRequestFromWhatsappOutputSchema},
  prompt: `You are an AI assistant helping healthcare professionals manage item requests and requisitions via WhatsApp.

  Based on the following request text, extract the items requested and their quantities.  Also, identify any requisition notes.

  Request Text: {{{requestText}}}

  Format the output as a JSON object with 'requestedItems' and 'requisitionNotes' fields.  The 'requestedItems' field should be a list of objects, each with 'itemName' and 'quantity' fields.
  `,
});

const aiItemRequestFromWhatsappFlow = ai.defineFlow(
  {
    name: 'aiItemRequestFromWhatsappFlow',
    inputSchema: AIItemRequestFromWhatsappInputSchema,
    outputSchema: AIItemRequestFromWhatsappOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
