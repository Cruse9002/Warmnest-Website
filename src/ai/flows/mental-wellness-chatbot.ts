// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview A mental wellness chatbot for answering basic questions and guiding users to support.
 *
 * - mentalWellnessChatbot - A function that handles the chatbot interaction.
 * - MentalWellnessChatbotInput - The input type for the mentalWellnessChatbot function.
 * - MentalWellnessChatbotOutput - The return type for the mentalWellnessChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentalWellnessChatbotInputSchema = z.object({
  language: z.enum(['en', 'ta']).describe('The language to use for the chatbot interaction (en: English, ta: Tamil).'),
  userMessage: z.string().describe('The user message to the chatbot.'),
});
export type MentalWellnessChatbotInput = z.infer<typeof MentalWellnessChatbotInputSchema>;

const MentalWellnessChatbotOutputSchema = z.object({
  chatbotResponse: z.string().describe('The chatbot response to the user message.'),
  escalateToHuman: z.boolean().describe('Whether the chatbot should escalate to human support.'),
});
export type MentalWellnessChatbotOutput = z.infer<typeof MentalWellnessChatbotOutputSchema>;

export async function mentalWellnessChatbot(input: MentalWellnessChatbotInput): Promise<MentalWellnessChatbotOutput> {
  return mentalWellnessChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalWellnessChatbotPrompt',
  input: {schema: MentalWellnessChatbotInputSchema},
  output: {schema: MentalWellnessChatbotOutputSchema},
  prompt: `You are a mental wellness chatbot designed to answer basic questions and provide guidance.
  You can answer in either English or Tamil, depending on the user's language preference.

  If the user asks a question that is beyond your capabilities, or indicates a need for immediate support,
  set escalateToHuman to true. Otherwise, set it to false.

  Language: {{language}}
  User Message: {{{userMessage}}}

  Response format: JSON
  {
    "chatbotResponse": "your response here",
    "escalateToHuman": true/false
  }`,
});

const mentalWellnessChatbotFlow = ai.defineFlow(
  {
    name: 'mentalWellnessChatbotFlow',
    inputSchema: MentalWellnessChatbotInputSchema,
    outputSchema: MentalWellnessChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
