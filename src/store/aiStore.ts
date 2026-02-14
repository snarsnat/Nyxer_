import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIStore {
  provider: string
  apiKey: string
  showProviderModal: boolean
  messages: Message[]
  setProvider: (provider: string) => void
  setApiKey: (key: string) => void
  setShowProviderModal: (show: boolean) => void
  addMessage: (message: Message) => void
}

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      provider: '',
      apiKey: '',
      showProviderModal: false,
      messages: [],
      setProvider: (provider) => set({ provider }),
      setApiKey: (apiKey) => set({ apiKey }),
      setShowProviderModal: (show) => set({ showProviderModal: show }),
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
    }),
    { name: 'nyxer-storage' }
  )
)
