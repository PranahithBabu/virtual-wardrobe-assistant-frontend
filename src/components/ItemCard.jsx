import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function ItemCard({ item, onClick }) {
  return (
    <Card
      className="overflow-hidden rounded-2xl shadow-soft border-0 transition-transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 flex flex-col items-start">
        <h3 className="font-semibold text-sm truncate w-full">{item.name}</h3>
        <Badge variant="secondary" className="mt-1">{item.category}</Badge>
      </CardFooter>
    </Card>
  )
}

export default ItemCard