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

const ClosetItemSchemaForAI = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  color: z.string(),
  season: z.array(z.string()),
  lastWorn: z.string().optional(),
});

const GenerateOutfitSuggestionsInputSchema = z.object({
  closetItems: z
    .array(ClosetItemSchemaForAI)
    .describe("A list of all items available in the user's closet."),
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

const OutfitSuggestionSchema = z.object({
    outfit: z.string().describe('A single outfit suggestion, described in a concise and stylish manner by listing the items.'),
    occasion: z.string().describe('The kind of occasion this outfit would be suitable for (e.g., Casual Hangout, Office Wear, Date Night).'),
    reasoning: z.string().describe('A brief, stylish reason why this specific outfit works well together.'),
    itemIds: z.array(z.number()).describe('The IDs of the closet items used in this outfit suggestion. This is mandatory.'),
});

const GenerateOutfitSuggestionsOutputSchema = z.object({
  outfitSuggestions: z
    .array(OutfitSuggestionSchema)
    .describe(
      'An array of 3-4 diverse outfit suggestions, each with a description, suitable occasion, and reasoning.'
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
  prompt: `You are a personal stylist AI assistant helping the user create outfits from their existing wardrobe. Your tone is encouraging, stylish, and helpful.

  Your goal is to create stylish outfits from the user's existing wardrobe. A key part of being a good stylist is encouraging variety. Use the 'lastWorn' date for each item to prioritize using clothes that haven't been worn recently.

  Given the following list of items from the user's closet, their preferences, and a potential occasion, generate 3-4 diverse and stylish outfit suggestions. For each suggestion, you MUST provide the IDs of the items used.

  Closet Items:
  {{#each closetItems}}
  - ID: {{this.id}}, Name: "{{this.name}}", Category: {{this.category}}, Last Worn: {{#if this.lastWorn}}{{this.lastWorn}}{{else}}N/A{{/if}}
  {{/each}}

  User Preferences: {{{userPreferences}}}
  Occasion: {{{occasion}}}

  For each suggestion, provide:
  1. 'outfit': The combination of items that creates a cohesive and stylish look.
  2. 'occasion': A suitable occasion for the outfit.
  3. 'reasoning': A brief, stylish explanation for why the outfit works.
  4. 'itemIds': An array of the numeric IDs for each item included in the outfit. This is mandatory.
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
