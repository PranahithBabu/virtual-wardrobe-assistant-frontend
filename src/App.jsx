import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app/AppSidebar'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { WardrobeProvider } from '@/lib/contexts/WardrobeContext'
import { Toaster } from '@/components/ui/toaster'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/closet" element={
          <ProtectedRoute>
            <AppLayout><ClosetPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/suggestions" element={
          <ProtectedRoute>
            <AppLayout><SuggestionsPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <AppLayout><CalendarPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><ProfilePage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <AppLayout><ScanPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App