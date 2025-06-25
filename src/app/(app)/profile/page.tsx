'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import AppHeader from '@/components/app/AppHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryChart = dynamic(() => import('@/components/app/CategoryChart'), {
  ssr: false,
  loading: () => (
      <Card className="lg:col-span-2 rounded-2xl shadow-soft border-0">
          <CardHeader>
              <CardTitle className="font-headline">Items by Category</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="h-56 sm:h-64 w-full">
                <Skeleton className="h-full w-full" />
              </div>
          </CardContent>
      </Card>
  )
});


const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  stylePreferences: z.string().optional(),
  avatar: z.any(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { closetItems, userProfile, updateUserProfile } = useWardrobe();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      stylePreferences: '',
      avatar: null,
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name,
        stylePreferences: userProfile.stylePreferences || '',
        avatar: userProfile.avatarUrl,
      });
      setPreview(userProfile.avatarUrl);
    }
  }, [userProfile, form]);

  const stats = useMemo(() => {
    const categoryCount = closetItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalItems: closetItems.length,
      categoryCount: Object.entries(categoryCount).map(([name, value]) => ({ name, count: value })),
    };
  }, [closetItems]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreview(newPreviewUrl);
      form.setValue('avatar', e.target.files);
    }
  };
  
  const onSubmit = (data: ProfileFormData) => {
    const newAvatarUrl = data.avatar instanceof FileList && data.avatar.length > 0
        ? URL.createObjectURL(data.avatar[0])
        : userProfile.avatarUrl;

    updateUserProfile({
        name: data.name,
        stylePreferences: data.stylePreferences,
        avatarUrl: newAvatarUrl,
    });
    
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
    });
    form.reset({}, { keepValues: true });
  };

  if (!userProfile) {
    return null; // Or a loading state
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Profile & Settings" />
      <div className="flex-grow p-4 sm:p-6 space-y-8">
        <Card className="rounded-2xl shadow-soft border-0">
          <CardHeader>
            <CardTitle className="font-headline">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={() => (
                                <FormItem>
                                <FormControl>
                                    <label className="relative group cursor-pointer">
                                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background ring-4 ring-primary">
                                            {preview ? <AvatarImage src={preview} alt={userProfile.name} /> : <AvatarFallback>{userProfile.name?.[0].toUpperCase()}</AvatarFallback> }
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="h-8 w-8 text-white" />
                                        </div>
                                        <Input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex-grow w-full space-y-4">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Input value={userProfile.email} disabled className="cursor-not-allowed" />
                            </FormItem>
                        </div>
                    </div>
                     <FormField
                        control={form.control}
                        name="stylePreferences"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Style Preferences</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your style, favorite colors, etc. This will help us give you better suggestions." {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                         <Button type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 rounded-2xl shadow-soft border-0">
                <CardHeader>
                    <CardTitle className="font-headline">Wardrobe Stats</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Total Items</span>
                        <span className="font-bold text-2xl text-primary">{stats.totalItems}</span>
                    </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Categories</span>
                        <span className="font-bold text-2xl text-primary">{stats.categoryCount.length}</span>
                    </div>
                </CardContent>
            </Card>
            <CategoryChart data={stats.categoryCount} />
        </div>
      </div>
    </div>
  );
}
