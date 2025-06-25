'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import type { ClosetItem, Outfit, PlannedEvent, UserProfile } from '../types';
import { mockClosetItems } from '../mock-data';

const initialUserProfile: UserProfile = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    stylePreferences: 'I love a minimalist style with neutral colors. I occasionally like to add a pop of color with accessories. My go-to look is casual chic.',
};

interface WardrobeContextType {
  closetItems: ClosetItem[];
  outfits: Outfit[];
  plannedEvents: PlannedEvent[];
  userProfile: UserProfile;
  addItem: (item: Omit<ClosetItem, 'id'>) => void;
  updateItem: (id: number, itemData: Partial<Omit<ClosetItem, 'id' | 'imageUrl'>> & { imageUrl?: string }) => void;
  deleteItem: (id: number) => void;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => number;
  addEvent: (event: Omit<PlannedEvent, 'id'>) => void;
  updateEvent: (id: string, eventData: Partial<Omit<PlannedEvent, 'id'>>) => void;
  deleteEvent: (id: string) => void;
  getItemById: (id: number) => ClosetItem | undefined;
  getOutfitById: (id: number) => Outfit | undefined;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(mockClosetItems);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  const addItem = useCallback((item: Omit<ClosetItem, 'id'>) => {
    setClosetItems((prevItems) => [
      ...prevItems,
      { ...item, id: Date.now() },
    ]);
  }, []);
  
  const updateItem = useCallback((id: number, itemData: Partial<Omit<ClosetItem, 'id' | 'imageUrl'>> & { imageUrl?: string }) => {
    setClosetItems((prevItems) => prevItems.map(item => {
      if (item.id === id) {
        return { ...item, ...itemData, imageUrl: itemData.imageUrl || item.imageUrl };
      }
      return item;
    }));
  }, []);

  const deleteItem = useCallback((id: number) => {
    setClosetItems((prevItems) => prevItems.filter(item => item.id !== id));
  }, []);

  const addOutfit = useCallback((outfit: Omit<Outfit, 'id'>) => {
    const newId = Date.now();
    setOutfits((prevOutfits) => [
      ...prevOutfits,
      { ...outfit, id: newId },
    ]);
    return newId;
  }, []);
  
  const addEvent = useCallback((event: Omit<PlannedEvent, 'id'>) => {
    setPlannedEvents((prevEvents) => [
      ...prevEvents,
      { ...event, id: Date.now().toString() },
    ]);
    
    // Use a functional update with setOutfits to get the most recent state
    setOutfits(currentOutfits => {
      const outfit = currentOutfits.find(o => o.id === event.outfitId);
      if (outfit && outfit.itemIds.length > 0) {
        setClosetItems(prevItems =>
          prevItems.map(item => {
            if (outfit.itemIds.includes(item.id)) {
              return { ...item, previousLastWorn: item.lastWorn, lastWorn: event.date };
            }
            return item;
          })
        );
      }
      return currentOutfits; // No change to outfits, just using it to read data
    });
  }, []);

  const updateEvent = useCallback((id: string, eventData: Partial<Omit<PlannedEvent, 'id'>>) => {
    const oldEvent = plannedEvents.find(e => e.id === id);
    if (!oldEvent) return;

    setOutfits(currentOutfits => {
      const oldOutfit = currentOutfits.find(o => o.id === oldEvent.outfitId);
      const newOutfitId = eventData.outfitId ?? oldEvent.outfitId;
      const newOutfit = currentOutfits.find(o => o.id === newOutfitId);
      const newDate = eventData.date ?? oldEvent.date;

      setClosetItems(prevItems => prevItems.map(item => {
        const wasInOldOutfit = oldOutfit?.itemIds.includes(item.id) && item.lastWorn === oldEvent.date;
        const isInNewOutfit = newOutfit?.itemIds.includes(item.id);

        if (wasInOldOutfit && isInNewOutfit && oldEvent.date === newDate) {
          return item; // Item remains in the same event, no change needed
        }
        
        let updatedItem = { ...item };

        if (wasInOldOutfit) {
          // Revert item from old event
          updatedItem = { ...updatedItem, lastWorn: item.previousLastWorn, previousLastWorn: undefined };
        }
        
        if (isInNewOutfit) {
          // Apply item to new event
          const originalLastWorn = wasInOldOutfit ? updatedItem.lastWorn : item.lastWorn;
          updatedItem = { ...updatedItem, previousLastWorn: originalLastWorn, lastWorn: newDate };
        }
        
        return updatedItem;
      }));
      return currentOutfits;
    });

    setPlannedEvents(prevEvents => prevEvents.map(event => 
        event.id === id ? { ...event, ...eventData } : event
    ));
  }, [plannedEvents]);

  const deleteEvent = useCallback((id: string) => {
    const eventToDelete = plannedEvents.find(e => e.id === id);
    if (!eventToDelete) return;

    setOutfits(currentOutfits => {
      const outfit = currentOutfits.find(o => o.id === eventToDelete.outfitId);
      if (outfit && outfit.itemIds.length > 0) {
        setClosetItems(prevItems =>
          prevItems.map(item => {
            if (outfit.itemIds.includes(item.id) && item.lastWorn === eventToDelete.date) {
              return { ...item, lastWorn: item.previousLastWorn, previousLastWorn: undefined };
            }
            return item;
          })
        );
      }
      return currentOutfits;
    });

    setPlannedEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  }, [plannedEvents]);

  const updateUserProfile = useCallback((profileData: Partial<UserProfile>) => {
    setUserProfile(prevProfile => ({ ...prevProfile, ...profileData }));
  }, []);

  const getItemById = useCallback((id: number) => closetItems.find(item => item.id === id), [closetItems]);
  const getOutfitById = useCallback((id: number) => outfits.find(outfit => outfit.id === id), [outfits]);

  const value = useMemo(() => ({
    closetItems,
    outfits,
    plannedEvents,
    userProfile,
    addItem,
    updateItem,
    deleteItem,
    addOutfit,
    addEvent,
    updateEvent,
    deleteEvent,
    getItemById,
    getOutfitById,
    updateUserProfile,
  }), [
    closetItems,
    outfits,
    plannedEvents,
    userProfile,
    addItem,
    updateItem,
    deleteItem,
    addOutfit,
    addEvent,
    updateEvent,
    deleteEvent,
    getItemById,
    getOutfitById,
    updateUserProfile,
  ]);

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = (): WardrobeContextType => {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};
