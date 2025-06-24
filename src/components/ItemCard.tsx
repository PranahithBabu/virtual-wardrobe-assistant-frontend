import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ClosetItem } from '@/lib/types';

interface ItemCardProps {
  item: ClosetItem;
  onClick?: () => void;
}

const ItemCard = ({ item, onClick }: ItemCardProps) => {
  return (
    <Card
      className="overflow-hidden rounded-2xl shadow-soft border-0 transition-transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            data-ai-hint={item.dataAiHint}
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 flex flex-col items-start">
        <h3 className="font-semibold text-sm truncate w-full">{item.name}</h3>
        <Badge variant="secondary" className="mt-1">{item.category}</Badge>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
