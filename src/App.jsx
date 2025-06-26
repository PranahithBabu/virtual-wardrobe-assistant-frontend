import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app/AppSidebar'
import { WardrobeProvider } from '@/lib/contexts/WardrobeContext'
import { Toaster } from '@/components/ui/toaster'

// Pages
import OnboardingPage from '@/pages/OnboardingPage'
import ClosetPage from '@/pages/ClosetPage'
import SuggestionsPage from '@/pages/SuggestionsPage'
import CalendarPage from '@/pages/CalendarPage'
import ProfilePage from '@/pages/ProfilePage'
import ScanPage from '@/pages/ScanPage'

function AppLayout({ children }) {
  return (
    <WardrobeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </SidebarProvider>
    </WardrobeProvider>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/closet" element={<AppLayout><ClosetPage /></AppLayout>} />
        <Route path="/suggestions" element={<AppLayout><SuggestionsPage /></AppLayout>} />
        <Route path="/calendar" element={<AppLayout><CalendarPage /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/scan" element={<AppLayout><ScanPage /></AppLayout>} />
        <Route path="*" element={<Navigate to="/closet" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App