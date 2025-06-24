'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { format, parse, startOfDay, isBefore } from 'date-fns';
import { Sparkles } from 'lucide-react';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import AppHeader from '@/components/app/AppHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getOutfitSuggestionsAction } from '@/app/actions';
import OutfitCard from '@/components/OutfitCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Outfit } from '@/lib/types';


export default function CalendarPage() {
  const { closetItems, plannedEvents, addEvent, outfits, getOutfitById, addOutfit } = useWardrobe();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit | null>(null);
  const [manualOutfitName, setManualOutfitName] = useState("");
  const [planType, setPlanType] = useState("suggest");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (isBefore(selectedDate, startOfDay(new Date()))) {
        toast({ variant: "destructive", title: "Cannot plan for past dates." });
        return;
    }

    setDate(selectedDate);
    
    const existingEvent = plannedEvents.find(
      e => format(parse(e.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    
    setSuggestedOutfit(null);
    setOccasion('');
    setManualOutfitName('');
    setPlanType('suggest');

    if (existingEvent) {
        setOccasion(existingEvent.occasion);
        const outfit = getOutfitById(existingEvent.outfitId);
        if (outfit) {
            setSuggestedOutfit(outfit);
        }
    }
    
    setDialogOpen(true);
  };
  
  const handleGetSuggestion = () => {
    if (!occasion) {
        toast({ variant: "destructive", title: "Please enter an occasion."});
        return;
    }
    startTransition(async () => {
      const wardrobeDescription = closetItems.map((item) => item.name).join(', ');
      try {
        const result = await getOutfitSuggestionsAction({ wardrobeDescription, occasion });
        const newOutfitSuggestion = result.outfitSuggestions[0];
        if (!newOutfitSuggestion) {
           toast({ variant: "destructive", title: "Could not get a suggestion." });
           return;
        }
        
        const newOutfit: Omit<Outfit, 'id'> = {
          name: newOutfitSuggestion.outfit,
          items: [], // In a real app, you'd parse items from the suggestion
          reasoning: newOutfitSuggestion.reasoning,
        };
        const newOutfitId = addOutfit(newOutfit);
        setSuggestedOutfit({ ...newOutfit, id: newOutfitId });
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to get suggestion" });
      }
    });
  };

  const handleAddToCalendar = () => {
    if (!date) return;
    
    let outfitId_to_add: number | null = null;
    let occasion_to_add = occasion;

    if (planType === 'manual') {
        if (!manualOutfitName) {
            toast({ variant: "destructive", title: "Please enter an outfit name."});
            return;
        }
        const newOutfit: Omit<Outfit, 'id'> = { name: manualOutfitName, items: [] };
        outfitId_to_add = addOutfit(newOutfit);
        if (!occasion_to_add) occasion_to_add = "General";

    } else { // suggest
        if (!suggestedOutfit) {
            toast({ variant: "destructive", title: "Please generate an outfit first."});
            return;
        }
        outfitId_to_add = suggestedOutfit.id;
    }

    addEvent({
      date: format(date, 'yyyy-MM-dd'),
      occasion: occasion_to_add,
      outfitId: outfitId_to_add,
    });

    setDialogOpen(false);
    toast({ title: "Event Added", description: "Outfit has been scheduled." });
  };
  
  const EventDisplay = ({ date }: { date: Date }) => {
    const event = plannedEvents.find(e => format(parse(e.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    if (!event) return null;
    const outfit = getOutfitById(event.outfitId);

    return (
        <Card className="rounded-2xl shadow-soft border-0 mt-6">
            <CardHeader>
                <CardTitle className="font-headline">{format(date, 'MMMM d, yyyy')}</CardTitle>
                <p className='text-sm text-muted-foreground'>Occasion: {event.occasion}</p>
            </CardHeader>
            <CardContent>
                <p className="font-semibold mb-2">Scheduled Outfit:</p>
                {outfit ? <OutfitCard suggestion={{ outfit: outfit.name, occasion: event.occasion, reasoning: outfit.reasoning || ''}}/> : <p>Outfit not found.</p>}
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Calendar Planner" />
      <div className="flex-grow p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card className="p-0 sm:p-4 rounded-2xl shadow-soft border-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="w-full"
                    disabled={{ before: startOfDay(new Date()) }}
                    modifiers={{
                        planned: plannedEvents.map(e => startOfDay(parse(e.date, 'yyyy-MM-dd', new Date()))),
                    }}
                    modifiersStyles={{
                        planned: {
                        color: 'hsl(var(--primary-foreground))',
                        backgroundColor: 'hsl(var(--primary))',
                        },
                    }}
                />
            </Card>
        </div>
        <div className="lg:col-span-1">
            {date && <EventDisplay date={date} />}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Plan for {date ? format(date, 'MMMM d, yyyy') : ''}</DialogTitle>
            <DialogDescription>
              Suggest an outfit with AI or manually enter one.
            </DialogDescription>
          </DialogHeader>
          <Tabs value={planType} onValueChange={setPlanType} className="w-full pt-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggest">Suggest Outfit</TabsTrigger>
                <TabsTrigger value="manual">Enter Manually</TabsTrigger>
            </TabsList>
            <TabsContent value="suggest" className="space-y-4 py-4">
                <Input
                placeholder="e.g., Casual brunch, Work meeting"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                />
                <Button onClick={handleGetSuggestion} disabled={isPending} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {isPending ? 'Getting suggestion...' : 'Suggest Outfit'}
                </Button>
                {suggestedOutfit && (
                <div className="pt-4">
                    <p className="font-semibold mb-2 text-sm">Suggested:</p>
                    <OutfitCard suggestion={{outfit: suggestedOutfit.name, occasion: occasion, reasoning: suggestedOutfit.reasoning || ''}} />
                </div>
                )}
            </TabsContent>
            <TabsContent value="manual" className="space-y-4 py-4">
                <Input
                    placeholder="e.g., Casual brunch, Work meeting"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                />
                <Input
                    placeholder="Enter outfit name (e.g., Blue Jeans & White Tee)"
                    value={manualOutfitName}
                    onChange={(e) => setManualOutfitName(e.target.value)}
                />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddToCalendar} disabled={planType === 'suggest' && !suggestedOutfit}>Add to Calendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
