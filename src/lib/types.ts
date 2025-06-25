export type ItemCategory = 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Shoes' | 'Accessories';
export type ItemSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All';

export interface ClosetItem {
  id: number;
  name: string;
  category: ItemCategory;
  color: string;
  season: ItemSeason[];
  imageUrl: string;
  lastWorn?: string; // 'YYYY-MM-DD'
  previousLastWorn?: string; // For rollback
  dataAiHint?: string;
}

export interface Outfit {
  id: number;
  name: string;
  itemIds: number[];
  reasoning?: string;
}

export interface PlannedEvent {
  id: string;
  date: string; // 'YYYY-MM-DD'
  occasion: string;
  outfitId: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  stylePreferences?: string;
}
