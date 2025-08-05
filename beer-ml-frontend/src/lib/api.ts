export interface BeerRatingPayload {
  user_id: string
  beer_name: string
  rating: number
  age: number
  gender: string
  latitude: number
  longitude: number
  dark_white_chocolate: number
  curry_cucumber: number
  vanilla_lemon: number
  caramel_wasabi: number
  blue_mozzarella: number
  sparkling_sweet: number
  barbecue_ketchup: number
  tropical_winter: number
  early_night: number
  beer_frequency: string
  drinks_alcohol: boolean
}

export interface ApiResponse {
  status: string
  id?: number
  error?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const submitBeerRating = async (payload: BeerRatingPayload): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit_rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to submit rating')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting beer rating:', error)
    throw error
  }
}

export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`)
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}
