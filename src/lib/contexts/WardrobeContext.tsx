'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  updateItem: (id: number, itemData: Omit<ClosetItem, 'id' | 'imageUrl'> & { imageUrl?: string }) => void;
  deleteItem: (id: number) => void;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => number;
  addEvent: (event: Omit<PlannedEvent, 'id'>) => void;
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

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    setUserProfile(prevProfile => ({ ...prevProfile, ...profileData }));
  };

  const getItemById = (id: number) => closetItems.find(item => item.id === id);
  const getOutfitById = (id: number) => outfits.find(outfit => outfit.id === id);

  return (
    <WardrobeContext.Provider value={{ closetItems, outfits, plannedEvents, userProfile, addItem, updateItem, deleteItem, addOutfit, addEvent, getItemById, getOutfitById, updateUserProfile }}>
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
