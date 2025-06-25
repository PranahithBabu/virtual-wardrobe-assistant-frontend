'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import type { ClosetItem, ItemSeason } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const initialFilters = {
  category: 'all',
  color: 'all',
  season: 'all',
};

export default function BrowsePage() {
  const router = useRouter();
  const { closetItems, deleteItem } = useWardrobe();
  const { toast } = useToast();
  const [filters, setFilters] = useState(initialFilters);
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);

  const handleFilterChange = (filterType: keyof typeof initialFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const isFiltersDefault = useMemo(() => {
    return filters.category === 'all' && filters.color === 'all' && filters.season === 'all';
  }, [filters]);

  const filteredItems = useMemo(() => {
    return closetItems.filter(item => {
      const categoryMatch = filters.category === 'all' || item.category === filters.category;
      const colorMatch = filters.color === 'all' || item.color === filters.color;
      const seasonMatch = filters.season === 'all' || item.season.includes(filters.season as ItemSeason);
      return categoryMatch && colorMatch && seasonMatch;
    });
  }, [closetItems, filters]);
  
  const availableCategories = useMemo(() => {
    return ['all', ...Array.from(new Set(closetItems.map(item => item.category)))];
  }, [closetItems]);

  const availableColors = useMemo(() => {
    const items = closetItems.filter(item => {
      const categoryMatch = filters.category === 'all' || item.category === filters.category;
      const seasonMatch = filters.season === 'all' || item.season.includes(filters.season as ItemSeason);
      return categoryMatch && seasonMatch;
    });
    return ['all', ...Array.from(new Set(items.map(item => item.color)))];
  }, [closetItems, filters.category, filters.season]);

  const availableSeasons = useMemo(() => {
    const items = closetItems.filter(item => {
        const categoryMatch = filters.category === 'all' || item.category === filters.category;
        const colorMatch = filters.color === 'all' || item.color === filters.color;
        return categoryMatch && colorMatch;
    });
    const seasons = new Set(items.flatMap(item => item.season));
    return ['all', ...Array.from(seasons)];
  }, [closetItems, filters.category, filters.color]);
  

  const handleDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem.id);
      toast({ title: "Item Deleted", description: `${selectedItem.name} has been removed from your closet.`});
      setSelectedItem(null);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Browse Your Closet" />
      <div className="flex-grow p-4 sm:p-6">
        <Card className="p-4 mb-6 rounded-2xl shadow-soft border-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('color', value)} value={filters.color}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by color" />
              </SelectTrigger>
              <SelectContent>
                {availableColors.map(color => <SelectItem key={color} value={color}>{color === 'all' ? 'All Colors' : color}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('season', value)} value={filters.season}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by season" />
              </SelectTrigger>
              <SelectContent>
                {availableSeasons.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'Any Season' : (s === 'All' ? 'All-Season Wear' : s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-4">
              <Button variant="ghost" onClick={handleResetFilters} disabled={isFiltersDefault}>
                  Reset Filters
              </Button>
          </div>
        </Card>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 min-h-[50vh] rounded-lg border-2 border-dashed border-muted-foreground/30 text-center">
             <h2 className="text-2xl font-semibold tracking-tight font-headline">No Items Found</h2>
             <p className="text-muted-foreground mt-2">Try adjusting your filters or adding more items.</p>
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
                    {selectedItem.season.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
                {selectedItem.lastWorn && (
                  <p className="text-sm text-muted-foreground">
                    Last worn on {format(parseISO(selectedItem.lastWorn), 'MMMM d, yyyy')}
                  </p>
                )}
            </div>
            <DialogFooter className="sm:justify-between gap-2 mt-4">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete "{selectedItem.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push(`/scan?edit=${selectedItem.id}`)}>Edit</Button>
            </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
