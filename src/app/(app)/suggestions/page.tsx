'use client';

import React, { useState, useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import { getOutfitSuggestionsAction } from '@/app/actions';
import AppHeader from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GenerateOutfitSuggestionsOutput } from '@/ai/flows/generate-outfit-suggestions';
import OutfitCard from '@/components/OutfitCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuggestionsPage() {
  const { closetItems } = useWardrobe();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<GenerateOutfitSuggestionsOutput | null>(null);

  const handleGetSuggestions = () => {
    startTransition(async () => {
      setSuggestions(null);
      if (closetItems.length < 3) {
        toast({
            variant: "destructive",
            title: "Not enough items",
            description: "Please add at least 3 items to your closet to get suggestions.",
        });
        return;
      }

      try {
        const wardrobeDescription = closetItems
          .map((item) => `${item.name} (${item.category}, ${item.color}, for ${item.season.join('/')})`)
          .join(', ');

        const result = await getOutfitSuggestionsAction({ wardrobeDescription });
        setSuggestions(result);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate suggestions. Please try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Outfit Suggestions">
        <Button onClick={handleGetSuggestions} disabled={isPending}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isPending ? 'Generating...' : 'Surprise Me'}
        </Button>
      </AppHeader>
      <div className="flex-grow p-4 sm:p-6">
        {!suggestions && !isPending && (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted-foreground/30 text-center p-4 sm:p-8">
             <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Sparkles className="h-10 w-10 text-primary" />
             </div>
             <h2 className="text-2xl font-semibold tracking-tight font-headline">Feeling Uninspired?</h2>
             <p className="text-muted-foreground mt-2 max-w-sm">Click the "Surprise Me" button to let our AI create stylish outfits from your closet.</p>
          </div>
        )}
        {isPending && (
            <div className='space-y-4'>
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
        )}
        {suggestions && (
          <div className="space-y-4">
            {suggestions.overallReasoning && (
                <Card className="rounded-2xl shadow-soft border-0 bg-primary/10">
                    <CardContent className="p-4">
                        <p className="text-primary-foreground/90 font-medium text-center">{suggestions.overallReasoning}</p>
                    </CardContent>
                </Card>
            )}
            {suggestions.outfitSuggestions.map((suggestion, index) => (
                <OutfitCard key={index} suggestion={suggestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
