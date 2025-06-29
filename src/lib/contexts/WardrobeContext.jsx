import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { closetAPI, userAPI } from '@/lib/api'
import { useAuth } from './AuthContext'

const WardrobeContext = createContext(undefined)

export function WardrobeProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [closetItems, setClosetItems] = useState([])
  const [outfits, setOutfits] = useState([])
  const [plannedEvents, setPlannedEvents] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData()
    } else {
      // Reset data when user logs out
      setClosetItems([])
      setOutfits([])
      setPlannedEvents([])
      setUserProfile(null)
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user profile from authenticated user data
      setUserProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        stylePreferences: user.stylePreferences,
      })

      // Load closet items from API
      const items = await closetAPI.getAll()
      setClosetItems(items || [])
      
    } catch (error) {
      console.error('Error loading user data:', error)
      // Set user profile from auth context even if API fails
      setUserProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        stylePreferences: user.stylePreferences,
      })
    } finally {
      setLoading(false)
    }
  }

  const addItem = useCallback(async (item) => {
    try {
      const newItem = await closetAPI.create(item)
      setClosetItems((prevItems) => [...prevItems, newItem])
      return newItem
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    }
  }, [])
  
  const updateItem = useCallback(async (id, itemData) => {
    try {
      const updatedItem = await closetAPI.update(id, itemData)
      setClosetItems((prevItems) => prevItems.map(item => 
        item.id === id ? updatedItem : item
      ))
      return updatedItem
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }, [])

  const deleteItem = useCallback(async (id) => {
    try {
      await closetAPI.delete(id)
      setClosetItems((prevItems) => prevItems.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }, [])

  const addOutfit = useCallback((outfit) => {
    const newId = Date.now()
    setOutfits((prevOutfits) => [
      ...prevOutfits,
      { ...outfit, id: newId },
    ])
    return newId
  }, [])
  
  const addEvent = useCallback((event) => {
    setPlannedEvents((prevEvents) => [
      ...prevEvents,
      { ...event, id: Date.now().toString() },
    ])
    
    // Use a functional update with setOutfits to get the most recent state
    setOutfits(currentOutfits => {
      const outfit = currentOutfits.find(o => o.id === event.outfitId)
      if (outfit && outfit.itemIds.length > 0) {
        setClosetItems(prevItems =>
          prevItems.map(item => {
            if (outfit.itemIds.includes(item.id)) {
              return { ...item, previousLastWorn: item.lastWorn, lastWorn: event.date }
            }
            return item
          })
        )
      }
      return currentOutfits // No change to outfits, just using it to read data
    })
  }, [])

  const updateEvent = useCallback((id, eventData) => {
    const oldEvent = plannedEvents.find(e => e.id === id)
    if (!oldEvent) return

    setOutfits(currentOutfits => {
      const oldOutfit = currentOutfits.find(o => o.id === oldEvent.outfitId)
      const newOutfitId = eventData.outfitId ?? oldEvent.outfitId
      const newOutfit = currentOutfits.find(o => o.id === newOutfitId)
      const newDate = eventData.date ?? oldEvent.date

      setClosetItems(prevItems => prevItems.map(item => {
        const wasInOldOutfit = oldOutfit?.itemIds.includes(item.id) && item.lastWorn === oldEvent.date
        const isInNewOutfit = newOutfit?.itemIds.includes(item.id)

        if (wasInOldOutfit && isInNewOutfit && oldEvent.date === newDate) {
          return item // Item remains in the same event, no change needed
        }
        
        let updatedItem = { ...item }

        if (wasInOldOutfit) {
          // Revert item from old event
          updatedItem = { ...updatedItem, lastWorn: item.previousLastWorn, previousLastWorn: undefined }
        }
        
        if (isInNewOutfit) {
          // Apply item to new event
          const originalLastWorn = wasInOldOutfit ? updatedItem.lastWorn : item.lastWorn
          updatedItem = { ...updatedItem, previousLastWorn: originalLastWorn, lastWorn: newDate }
        }
        
        return updatedItem
      }))
      return currentOutfits
    })

    setPlannedEvents(prevEvents => prevEvents.map(event => 
        event.id === id ? { ...event, ...eventData } : event
    ))
  }, [plannedEvents])

  const deleteEvent = useCallback((id) => {
    const eventToDelete = plannedEvents.find(e => e.id === id)
    if (!eventToDelete) return

    setOutfits(currentOutfits => {
      const outfit = currentOutfits.find(o => o.id === eventToDelete.outfitId)
      if (outfit && outfit.itemIds.length > 0) {
        setClosetItems(prevItems =>
          prevItems.map(item => {
            if (outfit.itemIds.includes(item.id) && item.lastWorn === eventToDelete.date) {
              return { ...item, lastWorn: item.previousLastWorn, previousLastWorn: undefined }
            }
            return item
          })
        )
      }
      return currentOutfits
    })

    setPlannedEvents(prevEvents => prevEvents.filter(event => event.id !== id))
  }, [plannedEvents])

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      if (userProfile?.id) {
        await userAPI.updateProfile(userProfile.id, profileData)
      }
      setUserProfile(prevProfile => ({ ...prevProfile, ...profileData }))
    } catch (error) {
      console.error('Error updating profile:', error)
      // Still update local state even if API fails
      setUserProfile(prevProfile => ({ ...prevProfile, ...profileData }))
    }
  }, [userProfile])

  const getItemById = useCallback((id) => closetItems.find(item => item.id === id), [closetItems])
  const getOutfitById = useCallback((id) => outfits.find(outfit => outfit.id === id), [outfits])

  const value = useMemo(() => ({
    closetItems,
    outfits,
    plannedEvents,
    userProfile,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addOutfit,
    addEvent,
    updateEvent,
    deleteEvent,
    getItemById,
    getOutfitById,
    updateUserProfile,
    refreshData: loadUserData,
  }), [
    closetItems,
    outfits,
    plannedEvents,
    userProfile,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addOutfit,
    addEvent,
    updateEvent,
    deleteEvent,
    getItemById,
    getOutfitById,
    updateUserProfile,
  ])

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  )
}

export function useWardrobe() {
  const context = useContext(WardrobeContext)
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider')
  }
  return context
}