'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { format, parse, startOfDay, parseISO } from 'date-fns';
import { Sparkles, Edit, Trash2 } from 'lucide-react';

import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import AppHeader from '@/components/app/AppHeader';
import { Calendar } from '@/components/ui/calendar';
import type { DayModifiers } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getOutfitSuggestionsAction } from '@/app/actions';
import OutfitCard from '@/components/OutfitCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Outfit, PlannedEvent } from '@/lib/types';
import type { GenerateOutfitSuggestionsOutput } from '@/ai/flows/generate-outfit-suggestions';
import { Badge } from '@/components/ui/badge';

type OutfitSuggestion = GenerateOutfitSuggestionsOutput['outfitSuggestions'][0];

export default function CalendarPage() {
  const { 
    closetItems,
    userProfile,
    plannedEvents, 
    addEvent, 
    updateEvent,
    deleteEvent,
    getOutfitById, 
    addOutfit 
  } = useWardrobe();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PlannedEvent | null>(null);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  // Dialog form state
  const [occasion, setOccasion] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState<OutfitSuggestion | null>(null);
  const [suggestedOutfitId, setSuggestedOutfitId] = useState<number | null>(null);
  const [manualOutfitName, setManualOutfitName] = useState("");
  const [planType, setPlanType] = useState("suggest");
  
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (isDialogOpen && !selectedEvent) {
      setOccasion('');
      setCurrentSuggestion(null);
      setSuggestedOutfitId(null);
      setManualOutfitName('');
      setPlanType('suggest');
    }
  }, [isDialogOpen, selectedEvent]);
  
   useEffect(() => {
    if (isDialogOpen && selectedEvent) {
        const outfit = getOutfitById(selectedEvent.outfitId);
        setOccasion(selectedEvent.occasion);
        if (outfit) {
            if (outfit.reasoning) { // AI-suggested outfit
                setPlanType('suggest');
                setCurrentSuggestion({
                    outfit: outfit.name,
                    occasion: selectedEvent.occasion,
                    reasoning: outfit.reasoning,
                    itemIds: outfit.itemIds,
                });
                setSuggestedOutfitId(outfit.id);
            } else { // Manually entered outfit
                setPlanType('manual');
                setManualOutfitName(outfit.name);
            }
        }
    }
  }, [isDialogOpen, selectedEvent, getOutfitById]);

  const handleDayClick = (day: Date, modifiers: DayModifiers) => {
    if (modifiers.disabled) return;
    setDate(day);
  };

  const handleOpenDialogForNew = () => {
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleOpenDialogForEdit = (event: PlannedEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (eventId: string) => {
    setEventToDeleteId(eventId);
  };
  
  const handleConfirmDelete = () => {
    if (eventToDeleteId) {
      deleteEvent(eventToDeleteId);
      toast({ title: "Event Deleted", description: "The planned outfit has been removed." });
      setEventToDeleteId(null);
    }
  };

  const handleGetSuggestion = () => {
    if (!occasion) {
        toast({ variant: "destructive", title: "Please enter an occasion."});
        return;
    }
    startTransition(async () => {
      try {
        const result = await getOutfitSuggestionsAction({ 
            closetItems, 
            occasion,
            userPreferences: userProfile.stylePreferences,
        });
        const newOutfitSuggestion = result.outfitSuggestions[0];
        if (!newOutfitSuggestion) {
           toast({ variant: "destructive", title: "Could not get a suggestion." });
           return;
        }
        
        const newOutfit: Omit<Outfit, 'id'> = {
          name: newOutfitSuggestion.outfit,
          itemIds: newOutfitSuggestion.itemIds, 
          reasoning: newOutfitSuggestion.reasoning,
        };
        const newOutfitId = addOutfit(newOutfit);
        setCurrentSuggestion(newOutfitSuggestion);
        setSuggestedOutfitId(newOutfitId);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to get suggestion" });
      }
    });
  };

  const handleSaveEvent = () => {
    if (!date) return;
    
    let outfitId_to_add: number | null = null;
    let occasion_to_add = occasion;

    if (planType === 'manual') {
        if (!manualOutfitName) {
            toast({ variant: "destructive", title: "Please enter an outfit name."});
            return;
        }
        const newOutfit: Omit<Outfit, 'id'> = { name: manualOutfitName, itemIds: [] };
        outfitId_to_add = addOutfit(newOutfit);
        if (!occasion_to_add) occasion_to_add = "General";

    } else { 
        if (!suggestedOutfitId || !currentSuggestion) {
            toast({ variant: "destructive", title: "Please generate or select an outfit first."});
            return;
        }
        outfitId_to_add = suggestedOutfitId;
        occasion_to_add = currentSuggestion.occasion;
    }

    const eventData = {
      date: format(date, 'yyyy-MM-dd'),
      occasion: occasion_to_add,
      outfitId: outfitId_to_add,
    };
    
    if (selectedEvent) {
        updateEvent(selectedEvent.id, eventData);
        toast({ title: "Event Updated", description: "Your plan has been successfully updated." });
    } else {
        addEvent(eventData);
        toast({ title: "Event Added", description: "Outfit has been scheduled." });
    }

    setDialogOpen(false);
  };
  
  const EventsForDay = ({ selectedDate }: { selectedDate: Date }) => {
    const eventsForDay = plannedEvents
      .filter(e => format(parse(e.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
      .sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return (
      <Card className="rounded-2xl shadow-soft border-0 lg:sticky lg:top-24">
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <CardTitle className="font-headline text-lg sm:text-xl">{format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                {eventsForDay.length > 0 ? `${eventsForDay.length} outfit${eventsForDay.length > 1 ? 's' : ''} planned` : 'No outfits planned'}
              </p>
            </div>
            <Button onClick={handleOpenDialogForNew} size="sm">Plan Outfit</Button>
          </div>
        </CardHeader>
        <CardContent>
          {eventsForDay.length > 0 ? (
            <div className="space-y-3">
              {eventsForDay.map(event => {
                const outfit = getOutfitById(event.outfitId);
                if (!outfit) return null;
                
                return (
                  <Card key={event.id} className="rounded-xl shadow-sm border p-3">
                    <div className="flex justify-between items-start gap-2">
                       <div className="flex-1">
                         <p className="font-semibold text-sm">{outfit.name}</p>
                         <p className="text-xs text-muted-foreground">{event.occasion}</p>
                         {outfit.reasoning && <Badge variant="outline" className="mt-2 text-xs">AI Suggested</Badge>}
                       </div>
                       <div className="flex items-center gap-0">
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialogForEdit(event)}>
                           <Edit className="h-4 w-4" />
                           <span className="sr-only">Edit</span>
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteRequest(event.id)}>
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete</span>
                         </Button>
                       </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
             <div className="text-center py-8 text-sm text-muted-foreground">
                <p>Click 'Plan Outfit' to add a new plan for this day.</p>
             </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Calendar Planner" />
      <div className="flex-grow p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card className="p-0 sm:p-2 md:p-4 rounded-2xl shadow-soft border-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    onDayClick={handleDayClick}
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
            {date && <EventsForDay selectedDate={date} />}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <DialogTitle className="text-lg sm:text-xl font-headline">{selectedEvent ? 'Edit Plan' : 'Plan an Outfit'}</DialogTitle>
            <DialogDescription>
              For {date ? format(date, 'MMMM d, yyyy') : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto px-4 sm:px-6">
            <Tabs value={planType} onValueChange={setPlanType} className="w-full">
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
                    {currentSuggestion && (
                    <div className="pt-4">
                        <p className="font-semibold mb-2 text-sm">Suggested:</p>
                        <OutfitCard suggestion={currentSuggestion} />
                    </div>
                    )}
                </TabsContent>
                <TabsContent value="manual" className="space-y-4 py-4">
                    <Input
                        placeholder="Occasion (optional, e.g., Work meeting)"
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
          </div>
          <DialogFooter className="p-4 sm:p-6 pt-4 border-t mt-auto">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent} disabled={(planType === 'suggest' && !suggestedOutfitId) || (planType === 'manual' && !manualOutfitName)}>
                {selectedEvent ? 'Update Plan' : 'Add to Calendar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!eventToDeleteId} onOpenChange={(isOpen) => !isOpen && setEventToDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this planned outfit.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
