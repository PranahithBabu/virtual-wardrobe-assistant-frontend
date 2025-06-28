import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const timeSlots = [
  { id: 'morning', label: 'Morning', value: 'Morning' },
  { id: 'afternoon', label: 'Afternoon', value: 'Afternoon' },
  { id: 'evening', label: 'Evening', value: 'Evening' },
  { id: 'night', label: 'Night', value: 'Night' },
]

export default function TimeOfDaySelector({ value = [], onChange, error }) {
  const validateContinuousSelection = (newSelection) => {
    if (newSelection.length <= 1) return true
    
    // Find indices of selected times
    const selectedIndices = newSelection
      .map(time => timeSlots.findIndex(slot => slot.value === time))
      .sort((a, b) => a - b)
    
    // Check if indices are continuous
    for (let i = 1; i < selectedIndices.length; i++) {
      if (selectedIndices[i] - selectedIndices[i - 1] !== 1) {
        return false
      }
    }
    
    return true
  }

  const handleTimeChange = (timeValue, checked) => {
    let newSelection
    if (checked) {
      newSelection = [...value, timeValue]
    } else {
      newSelection = value.filter(time => time !== timeValue)
    }
    
    if (validateContinuousSelection(newSelection)) {
      onChange(newSelection)
    }
  }

  return (
    <FormItem>
      <FormLabel>Time of Day</FormLabel>
      <div className="grid grid-cols-2 gap-4">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="flex items-center space-x-2">
            <Checkbox
              id={slot.id}
              checked={value.includes(slot.value)}
              onCheckedChange={(checked) => handleTimeChange(slot.value, checked)}
            />
            <label
              htmlFor={slot.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {slot.label}
            </label>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Select continuous time slots (e.g., Morning & Afternoon, or Afternoon & Evening)
      </p>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}