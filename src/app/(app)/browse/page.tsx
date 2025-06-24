'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import AppHeader from '@/components/app/AppHeader';
import ItemCard from '@/components/ItemCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { ClosetItem, ItemCategory, ItemSeason } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

const categories: ItemCategory[] = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
const seasons: ItemSeason[] = ['Spring', 'Summer', 'Autumn', 'Winter', 'All'];

export default function BrowsePage() {
  const { closetItems } = useWardrobe();
  const [filters, setFilters] = useState({
    category: 'all',
    color: 'all',
    season: 'all',
  });
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);

  const colors = useMemo(() => ['all', ...Array.from(new Set(closetItems.map(item => item.color)))], [closetItems]);

  const filteredItems = useMemo(() => {
    return closetItems.filter(item => {
      const categoryMatch = filters.category === 'all' || item.category === filters.category;
      const colorMatch = filters.color === 'all' || item.color === filters.color;
      const seasonMatch = filters.season === 'all' || item.season === filters.season || item.season === 'All';
      return categoryMatch && colorMatch && seasonMatch;
    });
  }, [closetItems, filters]);

  const handleFilterChange = (filterName: string) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Browse Your Closet" />
      <div className="p-4 md:p-6 lg:p-8">
        <Card className="p-4 mb-6 rounded-2xl shadow-soft border-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select onValueChange={handleFilterChange('category')} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={handleFilterChange('color')} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {colors.filter(c => c !== 'all').map(color => <SelectItem key={color} value={color}>{color}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={handleFilterChange('season')} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {seasons.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-muted-foreground/30 text-center">
             <h2 className="text-2xl font-semibold tracking-tight font-headline">No Items Found</h2>
             <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          {selectedItem && (
            <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline">{selectedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
                <div className="aspect-[3/4] relative w-full rounded-lg overflow-hidden">
                    <Image src={selectedItem.imageUrl} alt={selectedItem.name} fill className="object-cover" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedItem.category}</Badge>
                    <Badge variant="secondary">{selectedItem.color}</Badge>
                    <Badge variant="secondary">{selectedItem.season}</Badge>
                </div>
                {selectedItem.lastWorn && (
                  <p className="text-sm text-muted-foreground">
                    Last worn on {format(parseISO(selectedItem.lastWorn), 'MMMM d, yyyy')}
                  </p>
                )}
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
