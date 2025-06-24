import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app/AppSidebar';
import { WardrobeProvider } from '@/lib/contexts/WardrobeContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WardrobeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </SidebarProvider>
    </WardrobeProvider>
  );
}
