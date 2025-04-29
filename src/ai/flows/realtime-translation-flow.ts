'use server';
/**
 * @fileOverview A real-time translation AI agent.
 *
 * - realtimeTranslation - A function that handles the real-time translation process.
 * - RealtimeTranslationInput - The input type for the realtimeTranslation function.
 * - RealtimeTranslationOutput - The return type for the realtimeTranslation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RealtimeTranslationInputSchema = z.object({
  sourceText: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The source language of the text.'),
  targetLanguage: z.string().describe('The target language for translation.'),
});

export type RealtimeTranslationInput = z.infer<
  typeof RealtimeTranslationInputSchema
>;

const RealtimeTranslationOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});

export type RealtimeTranslationOutput = z.infer<
  typeof RealtimeTranslationOutputSchema
>;

export async function realtimeTranslation(
  input: RealtimeTranslationInput
): Promise<RealtimeTranslationOutput> {
  return realtimeTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realtimeTranslationPrompt',
  input: {
    schema: z.object({
      sourceText: z.string().describe('The text to translate.'),
      sourceLanguage: z.string().describe('The source language of the text.'),
      targetLanguage: z.string().describe('The target language for translation.'),
    }),
  },
  output: {
    schema: z.object({
      translatedText: z.string().describe('The translated text.'),
    }),
  },
  prompt: `You are a real-time translation expert. Translate the given text from the source language to the target language.
Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}
Text to Translate: {{{sourceText}}}
Translation:`,
});

const realtimeTranslationFlow = ai.defineFlow<
  typeof RealtimeTranslationInputSchema,
  typeof RealtimeTranslationOutputSchema
>(
  {
    name: 'realtimeTranslationFlow',
    inputSchema: RealtimeTranslationInputSchema,
    outputSchema: RealtimeTranslationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
