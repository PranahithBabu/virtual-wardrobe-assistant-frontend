import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt } from 'lucide-react';
import { Badge } from './ui/badge';

interface OutfitCardProps {
  suggestion: {
    outfit: string;
    occasion: string;
    reasoning?: string;
  };
}

const OutfitCard = ({ suggestion }: OutfitCardProps) => {
  return (
    <Card className="rounded-2xl shadow-soft border-0">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="bg-primary/10 p-3 rounded-lg mt-1">
            <Shirt className="h-6 w-6 text-primary" />
        </div>
        <div className='flex-grow'>
            <p className="text-sm font-medium text-foreground">{suggestion.outfit}</p>
            <div className='flex items-center gap-2 mt-2'>
              <Badge variant="secondary">{suggestion.occasion}</Badge>
            </div>
             {suggestion.reasoning && (
              <p className="text-sm text-muted-foreground mt-2">{suggestion.reasoning}</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
