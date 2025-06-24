'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import AppHeader from '@/components/app/AppHeader';
import ItemCard from '@/components/ItemCard';
import { Button } from '@/components/ui/button';

export default function ClosetPage() {
  const { closetItems } = useWardrobe();

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="My Closet" />
      <div className="flex-grow p-4 md:p-6 lg:p-8">
        {closetItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {closetItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted-foreground/30 text-center">
             <h2 className="text-2xl font-semibold tracking-tight font-headline">Your Closet is Empty</h2>
             <p className="text-muted-foreground mt-2">Start by adding your first item.</p>
             <Button asChild className="mt-4">
                <Link href="/scan">Add Item</Link>
             </Button>
          </div>
        )}
      </div>
       <Link href="/scan" passHref legacyBehavior>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="h-8 w-8" />
          <span className="sr-only">Scan New Item</span>
        </Button>
      </Link>
    </div>
  );
}
