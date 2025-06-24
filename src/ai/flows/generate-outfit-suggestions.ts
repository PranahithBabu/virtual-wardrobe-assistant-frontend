// src/ai/flows/generate-outfit-suggestions.ts
'use server';

/**
 * @fileOverview Generates outfit suggestions from a user's wardrobe using AI.
 *
 * - generateOutfitSuggestions - A function that generates outfit suggestions.
 * - GenerateOutfitSuggestionsInput - The input type for the generateOutfitSuggestions function.
 * - GenerateOutfitSuggestionsOutput - The return type for the generateOutfitSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitSuggestionsInputSchema = z.object({
  wardrobeDescription: z
    .string()
    .describe(
      'A detailed description of the user\s wardrobe, including item categories, colors, styles, and any relevant details.'
    ),
  userPreferences: z
    .string()
    .optional()
    .describe(
      'Optional user preferences regarding outfit style, occasion, or any specific requirements.'
    ),
  occasion: z
    .string()
    .optional()
    .describe('Optional occasion for which the outfit is being suggested.'),
});
export type GenerateOutfitSuggestionsInput = z.infer<
  typeof GenerateOutfitSuggestionsInputSchema
>;

const GenerateOutfitSuggestionsOutputSchema = z.object({
  outfitSuggestions: z
    .array(z.string())
    .describe(
      'An array of outfit suggestions, each described in a concise and stylish manner.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why the outfit was suggested based on occasion, style, and wardrobe content.'
    ),
});
export type GenerateOutfitSuggestionsOutput = z.infer<
  typeof GenerateOutfitSuggestionsOutputSchema
>;

export async function generateOutfitSuggestions(
  input: GenerateOutfitSuggestionsInput
): Promise<GenerateOutfitSuggestionsOutput> {
  return generateOutfitSuggestionsFlow(input);
}

const outfitSuggestionsPrompt = ai.definePrompt({
  name: 'outfitSuggestionsPrompt',
  input: {schema: GenerateOutfitSuggestionsInputSchema},
  output: {schema: GenerateOutfitSuggestionsOutputSchema},
  prompt: `You are a personal stylist AI assistant helping the user create outfits from their existing wardrobe.

  Given the following description of the user's wardrobe, their preferences, and the occasion (if specified), generate stylish outfit suggestions.

  Wardrobe Description: {{{wardrobeDescription}}}
  User Preferences: {{{userPreferences}}}
  Occasion: {{{occasion}}}

  Consider the user's preferences and the occasion when generating the outfit suggestions.
  Each suggestion should be a combination of items from the wardrobe that creates a cohesive and stylish look. 
  Also provide a brief reasoning for why the outfit was suggested based on the inputs.
  `,
});

const generateOutfitSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateOutfitSuggestionsFlow',
    inputSchema: GenerateOutfitSuggestionsInputSchema,
    outputSchema: GenerateOutfitSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await outfitSuggestionsPrompt(input);
    return output!;
  }
);
