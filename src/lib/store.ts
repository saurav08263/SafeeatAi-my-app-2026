import { create } from 'zustand'

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type Screen =
  | 'splash'
  | 'welcome'
  | 'trial'
  | 'login'
  | 'signup'
  | 'home'
  | 'scanner'
  | 'results'
  | 'history'
  | 'profile'
  | 'premium'
  | 'combination'
  | 'expiry'
  | 'medicine'
  | 'pregnancy'
  | 'kids'
  | 'gym'
  | 'chat'
  | 'notifications'
  | 'paywall'
  | 'payment-success'
  | 'help'
  | 'about'
  | 'refer'
  | 'privacy'

export interface AllergenAlert {
  name: string
  severity: 'low' | 'medium' | 'high' | 'dangerous'
  description: string
}

export interface IngredientInfo {
  name: string
  safety: 'safe' | 'caution' | 'avoid'
  description: string
  category: string
}

export interface ScanResult {
  id?: string
  productName: string
  safetyScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'dangerous'
  ingredients: IngredientInfo[]
  warnings: string[]
  allergenAlerts: AllergenAlert[]
  nutritionSummary: Record<string, string>
  aiAnalysis: string
  imageData?: string
  scanType: 'image' | 'text' | 'combination' | 'expiry' | 'medicine' | 'pregnancy' | 'kids' | 'gym'
  comboItems?: string[]
  isSaved?: boolean
  createdAt?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  allergies: string[]
  dietaryRestrictions: string[]
  healthGoals: string[]
  isPremium: boolean
  trialStart?: string
  trialEnd?: string
  isTrialUsed: boolean
  scanCount: number
  authProvider: string
  country: string
  notificationEnabled: boolean
}

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: string
}

// ============================================================
// CONSTANTS
// ============================================================

export const ALLERGY_OPTIONS = [
  'Peanuts',
  'Tree Nuts',
  'Milk/Dairy',
  'Eggs',
  'Wheat/Gluten',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
  'Mustard',
  'Celery',
  'Lupin',
  'Mollusks',
  'Sulfites',
  'Corn',
  'Rice',
]

export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Keto',
  'Paleo',
  'Low-Sodium',
  'Low-Sugar',
  'Diabetic-Friendly',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Organic Only',
  'Non-GMO',
]

export const HEALTH_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Heart Health',
  'Diabetes Management',
  'Gut Health',
  'Immune Support',
  'Anti-Inflammatory',
  'Brain Health',
  'Skin Health',
  'Energy Boost',
]

export const POPULAR_COMBOS: { name: string; items: string[] }[] = [
  { name: 'Chicken + Milk', items: ['Chicken', 'Milk'] },
  { name: 'Fish + Curd', items: ['Fish', 'Curd'] },
  { name: 'Banana + Milk', items: ['Banana', 'Milk'] },
  { name: 'Egg + Cheese', items: ['Egg', 'Cheese'] },
  { name: 'Fruit + Milk', items: ['Fruit', 'Milk'] },
  { name: 'Paneer + Spinach', items: ['Paneer', 'Spinach'] },
  { name: 'Dal + Rice', items: ['Dal', 'Rice'] },
  { name: 'Curd + Onion', items: ['Curd', 'Onion'] },
]

// ============================================================
// STORE
// ============================================================

interface AppState {
  // Navigation
  currentScreen: Screen
  previousScreen: Screen | null
  setCurrentScreen: (screen: Screen) => void
  navigateBack: () => void

  // Auth
  isAuthenticated: boolean
  user: UserProfile | null
  login: (user: UserProfile) => void
  logout: () => void
  signup: (user: UserProfile) => void

  // Scanning
  isScanning: boolean
  scanResult: ScanResult | null
  setIsScanning: (v: boolean) => void
  setScanResult: (result: ScanResult | null) => void

  // History
  scanHistory: ScanResult[]
  setScanHistory: (history: ScanResult[]) => void
  addToHistory: (scan: ScanResult) => void
  clearHistory: () => void

  // Profile
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void

  // Manual text input
  manualText: string
  setManualText: (text: string) => void

  // Selected scan from history
  selectedScan: ScanResult | null
  setSelectedScan: (scan: ScanResult | null) => void

  // Chat messages
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChatMessages: () => void

  // Trial state
  trialDaysLeft: number
  isTrialActive: boolean
  setTrialState: (daysLeft: number, isActive: boolean) => void

  // Subscription plan type
  subscriptionPlan: string
  setSubscriptionPlan: (plan: string) => void

  // Ads control
  showAds: boolean
  setShowAds: (show: boolean) => void

  // Premium lock / paywall
  showPaywall: boolean
  setShowPaywall: (show: boolean) => void

  // Onboarding
  hasSeenOnboarding: boolean
  setHasSeenOnboarding: (seen: boolean) => void


}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentScreen: 'splash',
  previousScreen: null,
  setCurrentScreen: (screen) =>
    set({ previousScreen: get().currentScreen, currentScreen: screen }),
  navigateBack: () => {
    const { previousScreen } = get()
    if (previousScreen) {
      set({ currentScreen: previousScreen, previousScreen: null })
    } else {
      set({ currentScreen: 'home' })
    }
  },

  // Auth
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user, profile: user }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      profile: null,
      currentScreen: 'welcome',
      previousScreen: null,
      scanHistory: [],
      scanResult: null,
      selectedScan: null,
      chatMessages: [],
      manualText: '',
    }),
  signup: (user) => set({ isAuthenticated: true, user, profile: user }),

  // Scanning
  isScanning: false,
  scanResult: null,
  setIsScanning: (v) => set({ isScanning: v }),
  setScanResult: (result) => set({ scanResult: result }),

  // History
  scanHistory: [],
  setScanHistory: (history) => set({ scanHistory: history }),
  addToHistory: (scan) =>
    set((state) => ({ scanHistory: [scan, ...state.scanHistory] })),
  clearHistory: () => set({ scanHistory: [] }),

  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Manual text input
  manualText: '',
  setManualText: (text) => set({ manualText: text }),

  // Selected scan
  selectedScan: null,
  setSelectedScan: (scan) => set({ selectedScan: scan }),

  // Chat messages
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChatMessages: () => set({ chatMessages: [] }),

  // Trial state
  trialDaysLeft: 2,
  isTrialActive: false,
  setTrialState: (daysLeft, isActive) =>
    set({ trialDaysLeft: daysLeft, isTrialActive: isActive }),

  // Subscription plan type: 'free' | 'monthly' | 'yearly'
  subscriptionPlan: 'free' as string,
  setSubscriptionPlan: (plan: string) => set({ subscriptionPlan: plan }),

  // Should show ads? Only monthly subscribers see ads
  showAds: false,
  setShowAds: (show: boolean) => set({ showAds: show }),

  // Premium lock / paywall
  showPaywall: false,
  setShowPaywall: (show) => set({ showPaywall: show }),

  // Onboarding
  hasSeenOnboarding: false,
  setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),


}))
