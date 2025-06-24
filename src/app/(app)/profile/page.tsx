'use client';

import React, { useMemo } from 'react';
import AppHeader from '@/components/app/AppHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';
import { LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProfilePage() {
  const { closetItems } = useWardrobe();

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

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Profile & Settings" />
      <div className="flex-grow p-4 md:p-6 lg:p-8 space-y-8">
        <Card className="rounded-2xl shadow-soft border-0">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background ring-4 ring-primary">
              <AvatarImage src="https://placehold.co/100x100.png" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold font-headline">User</h2>
              <p className="text-muted-foreground">user@styleai.com</p>
              <Button variant="destructive" className="mt-4">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
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

            <Card className="lg:col-span-2 rounded-2xl shadow-soft border-0">
                <CardHeader>
                    <CardTitle className="font-headline">Items by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-56 sm:h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.categoryCount} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
