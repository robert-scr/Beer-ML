import { create } from 'zustand'

export interface UserProfile {
  age: number | null
  gender: string
  latitude: number | null
  longitude: number | null
}

export interface TastePreferences {
  white_dark: number
  curry_soup: number
  lemon_vanilla: number
  salmon_chicken: number
  cucumber_pumpkin: number
  espresso_latte: number
  chili_risotto: number
  grapefruit_banana: number
  cheese_mozzarella: number
  almonds_honey: number
}

export interface BeerRatingState {
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
  white_dark: 5,
  curry_soup: 5,
  lemon_vanilla: 5,
  salmon_chicken: 5,
  cucumber_pumpkin: 5,
  espresso_latte: 5,
  chili_risotto: 5,
  grapefruit_banana: 5,
  cheese_mozzarella: 5,
  almonds_honey: 5,
}

export const useBeerRatingStore = create<BeerRatingState>((set, get) => ({
  profile: initialProfile,
  preferences: initialPreferences,
  completedBeers: new Array(10).fill(false), // 10 beers, all initially not completed
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
    const { completedBeers } = get()
    return {
      completed: completedBeers.filter(Boolean).length,
      total: completedBeers.length
    }
  },
  reset: () => set({
    profile: initialProfile,
    preferences: initialPreferences,
    completedBeers: new Array(10).fill(false),
    isSubmitting: false,
    surveyEndedEarly: false,
  }),
}))
