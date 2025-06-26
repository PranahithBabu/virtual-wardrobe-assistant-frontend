// Mock implementation for outfit suggestions
// In a real app, this would call your AI service

export async function getOutfitSuggestionsAction(input) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response based on input
  const mockSuggestions = [
    {
      outfit: "White Cotton T-Shirt with Blue Denim Jeans and White Sneakers",
      occasion: input.occasion || "Casual Day Out",
      reasoning: "A classic, comfortable combination perfect for everyday wear. The neutral colors work well together and the outfit is versatile for various activities.",
      itemIds: input.closetItems.slice(0, 3).map(item => item.id)
    },
    {
      outfit: "Black Leather Jacket with Black Trousers and Brown Loafers",
      occasion: "Evening Event",
      reasoning: "A sophisticated look that balances edgy and elegant. The leather jacket adds personality while the trousers keep it polished.",
      itemIds: input.closetItems.slice(1, 4).map(item => item.id)
    },
    {
      outfit: "Gray Hoodie with Denim Shorts and White Sneakers",
      occasion: "Weekend Relaxation",
      reasoning: "Perfect for a laid-back weekend. The hoodie provides comfort while the shorts keep you cool, and sneakers complete the casual vibe.",
      itemIds: input.closetItems.slice(2, 5).map(item => item.id)
    }
  ]

  return {
    outfitSuggestions: mockSuggestions.slice(0, 3)
  }
}