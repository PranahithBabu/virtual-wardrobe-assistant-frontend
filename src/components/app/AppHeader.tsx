import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const AppHeader = ({ title, children }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
          {title}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">{children}</div>
    </header>
  );
};

export default AppHeader;
