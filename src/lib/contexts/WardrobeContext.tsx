'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ClosetItem, Outfit, PlannedEvent, ItemCategory, ItemSeason } from '../types';
import { mockClosetItems } from '../mock-data';

interface WardrobeContextType {
  closetItems: ClosetItem[];
  outfits: Outfit[];
  plannedEvents: PlannedEvent[];
  addItem: (item: Omit<ClosetItem, 'id'>) => void;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => void;
  addEvent: (event: Omit<PlannedEvent, 'id'>) => void;
  getItemById: (id: number) => ClosetItem | undefined;
  getOutfitById: (id: number) => Outfit | undefined;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(mockClosetItems);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);

  const addItem = (item: Omit<ClosetItem, 'id'>) => {
    setClosetItems((prevItems) => [
      ...prevItems,
      { ...item, id: Date.now() },
    ]);
  };

  const addOutfit = (outfit: Omit<Outfit, 'id'>) => {
    setOutfits((prevOutfits) => [
      ...prevOutfits,
      { ...outfit, id: Date.now() },
    ]);
  };
  
  const addEvent = (event: Omit<PlannedEvent, 'id'>) => {
    setPlannedEvents((prevEvents) => [
      ...prevEvents,
      { ...event, id: Date.now().toString() },
    ]);
  };

  const getItemById = (id: number) => closetItems.find(item => item.id === id);
  const getOutfitById = (id: number) => outfits.find(outfit => outfit.id === id);

  return (
    <WardrobeContext.Provider value={{ closetItems, outfits, plannedEvents, addItem, addOutfit, addEvent, getItemById, getOutfitById }}>
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
