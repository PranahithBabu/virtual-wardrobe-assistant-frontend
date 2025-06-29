import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, X, CalendarIcon, Sparkles, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

import { useWardrobe } from '@/lib/contexts/WardrobeContext'
import { aiAPI } from '@/lib/api'
import AppHeader from '@/components/app/AppHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'All']

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  category: z.enum(categories),
  color: z.string().min(2, { message: 'Please enter a color.' }),
  seasons: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one season.',
  }),
  image: z.any().refine((files) => files?.length > 0 || typeof files === 'string', 'Image is required.'),
  lastWorn: z.date().optional(),
})

export default function ScanPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { addItem, getItemById, updateItem } = useWardrobe()
  const { toast } = useToast()
  const [preview, setPreview] = useState(null)
  const [isLastWornPickerOpen, setLastWornPickerOpen] = useState(false)
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  
  const itemId = searchParams.get('edit')
  const isEditMode = !!itemId
  const itemToEdit = isEditMode ? getItemById(Number(itemId)) : null

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '',
      seasons: [],
      image: undefined,
      lastWorn: undefined,
    },
  })

  // Handle uploaded file from AddItemModal
  useEffect(() => {
    if (location.state?.uploadedFile) {
      const file = location.state.uploadedFile
      setUploadedFile(file)
      setPreview(URL.createObjectURL(file))
      form.setValue('image', [file])
      
      // Trigger AI analysis for uploaded images
      handleImageAnalysis(file)
      
      // Clear the state to prevent re-processing
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  useEffect(() => {
    if (isEditMode && itemToEdit) {
      form.reset({
        name: itemToEdit.name,
        category: itemToEdit.category,
        color: itemToEdit.color,
        seasons: itemToEdit.season,
        image: itemToEdit.imageUrl,
        lastWorn: itemToEdit.lastWorn ? parseISO(itemToEdit.lastWorn) : undefined,
      })
      setPreview(itemToEdit.imageUrl)
    }
  }, [isEditMode, itemToEdit, form])

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result.split(',')[1] // Remove data:image/jpeg;base64, prefix
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleImageAnalysis = async (file) => {
    setIsAIProcessing(true)
    try {
      const base64 = await convertFileToBase64(file)
      const analysis = await aiAPI.analyzeImage(base64)
      
      setAiSuggestion(analysis)
      
      // Auto-fill form with AI suggestions
      if (analysis.name && analysis.name !== 'Unknown') {
        form.setValue('name', analysis.name)
      }
      if (analysis.category && categories.includes(analysis.category)) {
        form.setValue('category', analysis.category)
      }
      if (analysis.color && analysis.color !== 'Unknown') {
        form.setValue('color', analysis.color)
      }
      if (analysis.seasons && analysis.seasons.length > 0) {
        // Filter valid seasons
        const validSeasons = analysis.seasons.filter(season => seasons.includes(season))
        if (validSeasons.length > 0) {
          form.setValue('seasons', validSeasons)
        }
      }
      
      toast({
        title: "AI Analysis Complete!",
        description: "We've auto-filled the form with detected information. Feel free to edit as needed.",
      })
    } catch (error) {
      console.error('AI Analysis Error:', error)
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "We couldn't analyze the image. Please fill in the details manually.",
      })
    } finally {
      setIsAIProcessing(false)
    }
  }

  const handleTextAnalysis = async (itemName) => {
    if (!itemName || itemName.length < 2) return
    
    setIsAIProcessing(true)
    try {
      const analysis = await aiAPI.analyzeText(itemName)
      
      setAiSuggestion(analysis)
      
      // Auto-fill form with AI suggestions (except name which user already entered)
      if (analysis.category && analysis.category !== 'Unknown' && categories.includes(analysis.category)) {
        form.setValue('category', analysis.category)
      }
      if (analysis.color && analysis.color !== 'Unknown') {
        form.setValue('color', analysis.color)
      }
      if (analysis.seasons && analysis.seasons.length > 0) {
        // Filter valid seasons
        const validSeasons = analysis.seasons.filter(season => seasons.includes(season))
        if (validSeasons.length > 0) {
          form.setValue('seasons', validSeasons)
        }
      }
      
      // Generate image for manual entry
      const imageResponse = await aiAPI.generateImage(itemName, '')
      if (imageResponse.imageUrl) {
        setPreview(imageResponse.imageUrl)
        form.setValue('image', imageResponse.imageUrl)
      }
      
      toast({
        title: "AI Suggestions Ready!",
        description: "We've suggested categories and generated an image. Feel free to adjust as needed.",
      })
    } catch (error) {
      console.error('Text Analysis Error:', error)
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "We couldn't analyze the text. Please fill in the details manually.",
      })
    } finally {
      setIsAIProcessing(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const lastWornDate = data.lastWorn ? format(data.lastWorn, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      
      if (isEditMode && itemToEdit) {
          const { image, ...updateData } = data
          const newImageData = image instanceof FileList ? URL.createObjectURL(image[0]) : undefined

          await updateItem(itemToEdit.id, {
              ...updateData,
              season: data.seasons,
              lastWorn: lastWornDate,
              ...(newImageData && { imageUrl: newImageData })
          })

          toast({
              title: "Item Updated!",
              description: `${data.name} has been updated.`,
          })
      } else {
          const imageUrl = typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image[0])
          
          await addItem({
              name: data.name,
              category: data.category,
              color: data.color,
              season: data.seasons,
              imageUrl: imageUrl,
              lastWorn: lastWornDate,
              dataAiHint: aiSuggestion?.dataAiHint || `${data.color.toLowerCase()} ${data.name.toLowerCase()}`,
          })
          toast({
              title: "Item Added!",
              description: `${data.name} has been added to your closet.`,
          })
      }
      navigate('/closet')
    } catch (error) {
      console.error('Error saving item:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save item. Please try again.",
      })
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      form.setValue('image', e.target.files)
      setUploadedFile(file)
      
      // Trigger AI analysis for uploaded images
      if (!isEditMode) {
        await handleImageAnalysis(file)
      }
    }
  }

  const clearPreview = () => {
    setPreview(null)
    form.setValue('image', undefined, { shouldValidate: true })
    setAiSuggestion(null)
    setUploadedFile(null)
  }

  // Watch name field for text analysis (only for manual entry without image)
  const watchedName = form.watch('name')
  useEffect(() => {
    if (!isEditMode && watchedName && watchedName.length >= 3 && !preview && !uploadedFile) {
      const timeoutId = setTimeout(() => {
        handleTextAnalysis(watchedName)
      }, 1000) // Debounce for 1 second
      
      return () => clearTimeout(timeoutId)
    }
  }, [watchedName, isEditMode, preview, uploadedFile])

  return (
    <div className="flex flex-col h-full">
      <AppHeader title={isEditMode ? "Edit Item" : "Add New Item"} />
      <div className="flex-grow p-4 md:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto rounded-2xl shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Item Details
              {isAIProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI analyzing...
                </div>
              )}
            </CardTitle>
            {aiSuggestion && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                AI suggestions applied
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="w-full">
                            {preview ? (
                                <div className='relative w-40 h-56 sm:w-48 sm:h-64 mx-auto'>
                                    <img src={preview} alt="Preview" className="w-full h-full rounded-lg object-cover" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 rounded-full h-7 w-7 z-10" onClick={clearPreview}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                                        {!isEditMode && (
                                          <p className="text-xs text-primary mt-2">✨ AI will auto-detect item details</p>
                                        )}
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., White Cotton T-Shirt" {...field} />
                        </FormControl>
                        {!isEditMode && !preview && !uploadedFile && (
                          <FormDescription>
                            ✨ AI will suggest details as you type
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., White" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="seasons"
                    render={() => (
                        <FormItem>
                        <FormLabel>Season</FormLabel>
                        <div className="flex flex-wrap gap-4">
                            {seasons.map((item) => (
                            <FormField
                                key={item}
                                control={form.control}
                                name="seasons"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                            if (item === 'All' && checked) {
                                                return field.onChange(['All'])
                                            }
                                            
                                            const newSeasons = field.value?.filter(s => s !== 'All') || []
                                            
                                            if (checked) {
                                                field.onChange([...newSeasons, item])
                                            } else {
                                                field.onChange(
                                                    newSeasons.filter(
                                                        (value) => value !== item
                                                    )
                                                )
                                            }
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="lastWorn"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Worn</FormLabel>
                      <Popover open={isLastWornPickerOpen} onOpenChange={setLastWornPickerOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                                field.onChange(date)
                                setLastWornPickerOpen(false)
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Optional. This helps us suggest outfits you haven't worn in a while. Defaults to today if left blank.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting || isAIProcessing}>
                        {form.formState.isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Item')}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}