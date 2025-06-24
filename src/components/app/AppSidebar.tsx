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
} from '@/components/ui/sidebar';
import {
  Home,
  Sparkles,
  Search,
  Calendar,
  User,
  Settings,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AppSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/closet', label: 'My Closet', icon: Home },
    { href: '/browse', label: 'Browse Items', icon: Search },
    { href: '/suggestions', label: 'Outfit Suggestions', icon: Sparkles },
    { href: '/calendar', label: 'Calendar Planner', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
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
        <SidebarMenu>
            <SidebarMenuItem>
                 <Link href="/profile" legacyBehavior passHref>
                    <SidebarMenuButton>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span>User</span>
                    </SidebarMenuButton>
                 </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
