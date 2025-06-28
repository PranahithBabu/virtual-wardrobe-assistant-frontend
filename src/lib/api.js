const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Auth token management
let authToken = localStorage.getItem('authToken')

export const setAuthToken = (token) => {
  authToken = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

export const getAuthToken = () => {
  return authToken || localStorage.getItem('authToken')
}

export const clearAuthToken = () => {
  authToken = null
  localStorage.removeItem('authToken')
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (response.status === 401) {
      clearAuthToken()
      window.location.href = '/'
      return
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Auth API
export const authAPI = {
  signUp: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  signIn: (credentials) => apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
}

// Closet Items API
export const closetAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value)
    })
    const queryString = params.toString()
    return apiRequest(`/closet-items${queryString ? `?${queryString}` : ''}`)
  },
  
  getById: (id) => apiRequest(`/closet-items/${id}`),
  
  create: (item) => apiRequest('/closet-items', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  
  update: (id, item) => apiRequest(`/closet-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  
  delete: (id) => apiRequest(`/closet-items/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/closet-items/stats'),
  
  getFilters: {
    categories: () => apiRequest('/closet-items/filters/categories'),
    colors: () => apiRequest('/closet-items/filters/colors'),
    seasons: () => apiRequest('/closet-items/filters/seasons'),
  },
}

// Outfits API
export const outfitsAPI = {
  getAll: () => apiRequest('/outfits'),
  getById: (id) => apiRequest(`/outfits/${id}`),
  create: (outfit) => apiRequest('/outfits', {
    method: 'POST',
    body: JSON.stringify(outfit),
  }),
  update: (id, outfit) => apiRequest(`/outfits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(outfit),
  }),
  delete: (id) => apiRequest(`/outfits/${id}`, {
    method: 'DELETE',
  }),
}

// Planned Events API
export const eventsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    const queryString = params.toString()
    return apiRequest(`/planned-events${queryString ? `?${queryString}` : ''}`)
  },
  
  getById: (id) => apiRequest(`/planned-events/${id}`),
  
  create: (event) => apiRequest('/planned-events', {
    method: 'POST',
    body: JSON.stringify(event),
  }),
  
  update: (id, event) => apiRequest(`/planned-events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  }),
  
  delete: (id) => apiRequest(`/planned-events/${id}`, {
    method: 'DELETE',
  }),
}

// User Profile API
export const userAPI = {
  getProfile: () => apiRequest('/user-profiles/default'),
  updateProfile: (id, profile) => apiRequest(`/user-profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  }),
}

// AI API
export const aiAPI = {
  analyzeImage: (imageBase64) => apiRequest('/ai-enhanced/analyze-clothing-image', {
    method: 'POST',
    body: JSON.stringify({ imageBase64 }),
  }),
  
  generateImage: (itemName, description) => apiRequest('/ai-enhanced/generate-clothing-image', {
    method: 'POST',
    body: JSON.stringify({ itemName, description }),
  }),
  
  analyzeText: (itemName) => apiRequest(`/ai-enhanced/analyze-text?itemName=${encodeURIComponent(itemName)}`, {
    method: 'POST',
  }),
  
  getOutfitSuggestions: (data) => apiRequest('/ai/outfit-suggestions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getWeatherBasedSuggestions: (data) => apiRequest('/ai/weather-based-suggestions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}