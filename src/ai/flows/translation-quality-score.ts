'use server';
/**
 * @fileOverview A translation quality score AI agent.
 *
 * - translationQualityScore - A function that handles the translation quality score process.
 * - TranslationQualityScoreInput - The input type for the translationQualityScore function.
 * - TranslationQualityScoreOutput - The return type for the translationQualityScore function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TranslationQualityScoreInputSchema = z.object({
  originalText: z.string().describe('The original text.'),
  translatedText: z.string().describe('The translated text.'),
  sourceLanguage: z.string().describe('The source language.'),
  targetLanguage: z.string().describe('The target language.'),
});
export type TranslationQualityScoreInput = z.infer<
  typeof TranslationQualityScoreInputSchema
>;

const TranslationQualityScoreOutputSchema = z.object({
  qualityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('The quality score of the translation (0-100).'),
  explanation: z.string().describe('Explanation of the quality score.'),
});
export type TranslationQualityScoreOutput = z.infer<
  typeof TranslationQualityScoreOutputSchema
>;

export async function translationQualityScore(
  input: TranslationQualityScoreInput
): Promise<TranslationQualityScoreOutput> {
  return translationQualityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translationQualityScorePrompt',
  input: {
    schema: z.object({
      originalText: z.string().describe('The original text.'),
      translatedText: z.string().describe('The translated text.'),
      sourceLanguage: z.string().describe('The source language.'),
      targetLanguage: z.string().describe('The target language.'),
    }),
  },
  output: {
    schema: z.object({
      qualityScore: z
        .number()
        .min(0)
        .max(100)
        .describe('The quality score of the translation (0-100).'),
      explanation: z.string().describe('Explanation of the quality score.'),
    }),
  },
  prompt: `You are an expert in translation quality assessment.

You are given the original text, the translated text, the source language, and the target language.

You must output a quality score between 0 and 100, where 0 is a very poor translation and 100 is a perfect translation.
Also, give a brief explanation of why you gave the translation that score.

Original Text: {{{originalText}}}
Translated Text: {{{translatedText}}}
Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}`,
});

const translationQualityScoreFlow = ai.defineFlow<
  typeof TranslationQualityScoreInputSchema,
  typeof TranslationQualityScoreOutputSchema
>(
  {
    name: 'translationQualityScoreFlow',
    inputSchema: TranslationQualityScoreInputSchema,
    outputSchema: TranslationQualityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
