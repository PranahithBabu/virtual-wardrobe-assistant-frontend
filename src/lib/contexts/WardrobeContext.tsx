'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ClosetItem, Outfit, PlannedEvent } from '../types';
import { mockClosetItems } from '../mock-data';

interface WardrobeContextType {
  closetItems: ClosetItem[];
  outfits: Outfit[];
  plannedEvents: PlannedEvent[];
  addItem: (item: Omit<ClosetItem, 'id'>) => void;
  updateItem: (id: number, itemData: Omit<ClosetItem, 'id' | 'imageUrl'> & { imageUrl?: string }) => void;
  deleteItem: (id: number) => void;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => number;
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
  
  const updateItem = (id: number, itemData: Omit<ClosetItem, 'id' | 'imageUrl'> & { imageUrl?: string }) => {
    setClosetItems((prevItems) => prevItems.map(item => {
      if (item.id === id) {
        return { ...item, ...itemData, imageUrl: itemData.imageUrl || item.imageUrl };
      }
      return item;
    }));
  };

  const deleteItem = (id: number) => {
    setClosetItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const addOutfit = (outfit: Omit<Outfit, 'id'>) => {
    const newId = Date.now();
    setOutfits((prevOutfits) => [
      ...prevOutfits,
      { ...outfit, id: newId },
    ]);
    return newId;
  };
  
  const addEvent = (event: Omit<PlannedEvent, 'id'>) => {
    setPlannedEvents((prevEvents) => {
       const otherEvents = prevEvents.filter(e => e.date !== event.date);
       return [...otherEvents, { ...event, id: Date.now().toString() }]
    });
  };

  const getItemById = (id: number) => closetItems.find(item => item.id === id);
  const getOutfitById = (id: number) => outfits.find(outfit => outfit.id === id);

  return (
    <WardrobeContext.Provider value={{ closetItems, outfits, plannedEvents, addItem, updateItem, deleteItem, addOutfit, addEvent, getItemById, getOutfitById }}>
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
