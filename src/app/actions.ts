'use server';

import {
  generateOutfitSuggestions,
  GenerateOutfitSuggestionsInput,
  GenerateOutfitSuggestionsOutput,
} from '@/ai/flows/generate-outfit-suggestions';

export async function getOutfitSuggestionsAction(
  input: GenerateOutfitSuggestionsInput
): Promise<GenerateOutfitSuggestionsOutput> {
  try {
    const result = await generateOutfitSuggestions(input);
    return result;
  } catch (error) {
    console.error('Error generating outfit suggestions:', error);
    throw new Error('Failed to generate outfit suggestions.');
  }
}
