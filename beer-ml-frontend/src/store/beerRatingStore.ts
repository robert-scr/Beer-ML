import { create } from 'zustand'

// Generate a UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export interface UserProfile {
  age: number | null
  gender: string
  latitude: number | null
  longitude: number | null
}

export interface TastePreferences {
  dark_white_chocolate: number // Dark Chocolate (1) to White Chocolate (10)
  curry_cucumber: number // Curry (1) to Cucumber salad (10)
  vanilla_lemon: number // Vanilla ice cream (1) to Lemon sorbet (10)
  caramel_wasabi: number // Caramel popcorn (1) to Wasabi peas (10)
  blue_mozzarella: number // Blue cheese (1) to Fresh mozzarella (10)
  sparkling_sweet: number // Sparkling water (1) to Sweet soda (10)
  barbecue_ketchup: number // Barbecue sauce (1) to Tomato ketchup (10)
  tropical_winter: number // Tropical paradise (1) to Winter wonderland (10)
  early_night: number // Early bird (1) to Night out (10)
  beer_frequency: string // 'never', 'rarely', 'often', 'very_often'
  drinks_alcohol: boolean // true = drinks alcohol, false = doesn't drink alcohol
}

export interface BeerRatingState {
  userId: string // UUID to track user across all their beer ratings
  profile: UserProfile
  preferences: TastePreferences
  completedBeers: boolean[] // Track which beers have been rated
  isSubmitting: boolean
  surveyEndedEarly: boolean // Track if survey was ended early
  
  setProfile: (profile: UserProfile) => void
  setPreferences: (preferences: TastePreferences) => void
  setBeerCompleted: (beerIndex: number) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setSurveyEndedEarly: (ended: boolean) => void
  reset: () => void
  getCompletionStatus: () => { completed: number; total: number }
}

const initialProfile: UserProfile = {
  age: null,
  gender: '',
  latitude: null,
  longitude: null,
}

const initialPreferences: TastePreferences = {
  dark_white_chocolate: 5,
  curry_cucumber: 5,
  vanilla_lemon: 5,
  caramel_wasabi: 5,
  blue_mozzarella: 5,
  sparkling_sweet: 5,
  barbecue_ketchup: 5,
  tropical_winter: 5,
  early_night: 5,
  beer_frequency: 'never',
  drinks_alcohol: true,
}

export const useBeerRatingStore = create<BeerRatingState>((set, get) => ({
  userId: generateUUID(), // Generate unique user ID when store is created
  profile: initialProfile,
  preferences: initialPreferences,
  completedBeers: new Array(9).fill(false), // 9 alcoholic beers (largest list), all initially not completed
  isSubmitting: false,
  surveyEndedEarly: false,
  
  setProfile: (profile) => set({ profile }),
  setPreferences: (preferences) => set({ preferences }),
  setBeerCompleted: (beerIndex) => set((state) => ({
    completedBeers: state.completedBeers.map((completed, index) => 
      index === beerIndex ? true : completed
    )
  })),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSurveyEndedEarly: (ended) => set({ surveyEndedEarly: ended }),
  getCompletionStatus: () => {
    const { completedBeers, preferences } = get()
    const drinksAlcohol = preferences.drinks_alcohol
    const totalBeers = 9 // Both alcoholic and non-alcoholic lists now have 9 beers
    const relevantCompleted = completedBeers.slice(0, totalBeers)
    
    return {
      completed: relevantCompleted.filter(Boolean).length,
      total: totalBeers
    }
  },
  reset: () => set({
    userId: generateUUID(), // Generate new user ID on reset
    profile: initialProfile,
    preferences: initialPreferences,
    completedBeers: new Array(9).fill(false),
    isSubmitting: false,
    surveyEndedEarly: false,
  }),
}))
