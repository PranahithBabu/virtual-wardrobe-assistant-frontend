import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt } from 'lucide-react';

interface OutfitCardProps {
  suggestion: string;
}

const OutfitCard = ({ suggestion }: OutfitCardProps) => {
  return (
    <Card className="rounded-2xl shadow-soft border-0">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
            <Shirt className="h-6 w-6 text-primary" />
        </div>
        <div className='pt-1'>
            <p className="font-medium text-foreground">{suggestion}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
