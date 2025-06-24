export type ItemCategory = 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Shoes' | 'Accessories';
export type ItemSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All';

export interface ClosetItem {
  id: number;
  name: string;
  category: ItemCategory;
  color: string;
  season: ItemSeason;
  imageUrl: string;
  lastWorn?: string;
}

export interface Outfit {
  id: number;
  name: string;
  items: ClosetItem[];
  reasoning?: string;
}

export interface PlannedEvent {
  id: string;
  date: string;
  occasion: string;
  outfitId: number;
}
