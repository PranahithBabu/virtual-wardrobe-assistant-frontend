import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface OutfitCardProps {
  suggestion: {
    outfit: string;
    occasion: string;
    reasoning: string;
  };
}

const OutfitCard = ({ suggestion }: OutfitCardProps) => {
  return (
    <Card className="rounded-2xl shadow-soft border-0">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-lg mt-1">
            <Shirt className="h-6 w-6 text-primary" />
        </div>
        <div className='flex-grow'>
            <p className="font-medium text-foreground">{suggestion.outfit}</p>
            <div className='flex items-center gap-2 mt-2'>
              <Badge variant="secondary">{suggestion.occasion}</Badge>
              {suggestion.reasoning && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{suggestion.reasoning}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
