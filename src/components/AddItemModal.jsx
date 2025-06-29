import React, { useState } from 'react'
import { Camera, Edit3, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AddItemModal({ isOpen, onClose, onPhotoUpload, onManualEntry }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPhotoUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-center font-headline">Add New Item</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-6">
          {/* Photo Upload Option */}
          <Card 
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="p-6">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Photo</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Take or upload a photo of your clothing item. Our AI will automatically detect details.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  <span>Click to browse or drag & drop</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </CardContent>
          </Card>

          {/* Manual Entry Option */}
          <Card className="border-2 border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6" onClick={onManualEntry}>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-secondary/50 rounded-full p-4 mb-4">
                  <Edit3 className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Manual Entry</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Enter item details manually. We'll help generate an image and suggest categories.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}