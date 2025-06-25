'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Sparkles,
  Search,
  Calendar,
  LogOut,
  User,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useWardrobe } from '@/lib/contexts/WardrobeContext';

const AppSidebar = () => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { userProfile } = useWardrobe();

  const menuItems = [
    { href: '/closet', label: 'My Closet', icon: Home },
    { href: '/browse', label: 'Browse Items', icon: Search },
    { href: '/suggestions', label: 'Outfit Suggestions', icon: Sparkles },
    { href: '/calendar', label: 'Calendar Planner', icon: Calendar },
  ];

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center group-data-[state=collapsed]:justify-center">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-0">
        <SidebarMenu className="p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  onClick={handleNavigation}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto group-data-[state=collapsed]:w-auto group-data-[state=collapsed]:h-auto group-data-[state=collapsed]:aspect-square group-data-[state=collapsed]:hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="group-data-[state=collapsed]:hidden">{userProfile.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={isMobile ? 'top' : 'right'} align="end" className="w-56">
                <DropdownMenuItem asChild>
                    <Link href="/profile" onClick={handleNavigation}>
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNavigation}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
