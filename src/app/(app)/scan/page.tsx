'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import AppHeader from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ItemCategory, ItemSeason } from '@/lib/types';

const categories: ItemCategory[] = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
const seasons: ItemSeason[] = ['Spring', 'Summer', 'Autumn', 'Winter', 'All'];

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  category: z.enum(categories),
  color: z.string().min(2, { message: 'Please enter a color.' }),
  seasons: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'You have to select at least one season.',
  }),
  image: z.any().refine((files) => files?.length > 0, 'Image is required.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, getItemById, updateItem } = useWardrobe();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  
  const itemId = searchParams.get('edit');
  const isEditMode = !!itemId;
  const itemToEdit = isEditMode ? getItemById(Number(itemId)) : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '',
      seasons: [],
      image: undefined,
    },
  });

  useEffect(() => {
    if (isEditMode && itemToEdit) {
      form.reset({
        name: itemToEdit.name,
        category: itemToEdit.category,
        color: itemToEdit.color,
        seasons: itemToEdit.season,
        image: itemToEdit.imageUrl, // We use this to satisfy validation, won't be submitted
      });
      setPreview(itemToEdit.imageUrl);
    }
  }, [isEditMode, itemToEdit, form]);
  
  // Watch for changes in 'All' season checkbox
  const watchedSeasons = form.watch('seasons');
  useEffect(() => {
      const allIndex = watchedSeasons.indexOf('All');
      if (allIndex !== -1 && watchedSeasons.length > 1) {
          form.setValue('seasons', ['All']);
      }
  }, [watchedSeasons, form]);


  const onSubmit = (data: FormData) => {
    if (isEditMode && itemToEdit) {
        const { image, ...updateData } = data;
        const newImageData = image instanceof FileList ? URL.createObjectURL(image[0]) : undefined;

        updateItem(itemToEdit.id, {
            ...updateData,
            season: data.seasons as ItemSeason[],
            ...(newImageData && { imageUrl: newImageData })
        });

        toast({
            title: "Item Updated!",
            description: `${data.name} has been updated.`,
        });
    } else {
        addItem({
            name: data.name,
            category: data.category,
            color: data.color,
            season: data.seasons as ItemSeason[],
            imageUrl: URL.createObjectURL(data.image[0]),
        });
        toast({
            title: "Item Added!",
            description: `${data.name} has been added to your closet.`,
        });
    }
    router.push('/closet');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue('image', e.target.files);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    form.setValue('image', undefined, { shouldValidate: true });
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title={isEditMode ? "Edit Item" : "Add New Item"} />
      <div className="flex-grow p-4 md:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto rounded-2xl shadow-soft border-0">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
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
                                <div className='relative w-48 h-64 mx-auto'>
                                    <Image src={preview} alt="Preview" fill className="rounded-lg object-cover" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 rounded-full h-7 w-7 z-10" onClick={clearPreview}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
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
                                                field.onChange(['All']);
                                            } else {
                                                const newSeasons = field.value?.filter(s => s !== 'All');
                                                return checked
                                                    ? field.onChange([...(newSeasons || []), item])
                                                    : field.onChange(
                                                        newSeasons?.filter(
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
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Item')}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
