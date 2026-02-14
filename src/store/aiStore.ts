import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import CryptoJS from 'crypto-js'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  prototype?: PrototypeData
}

interface PrototypeData {
  code: GeneratedFile[]
  diagrams: GeneratedFile[]
  instructions: string[]
  partsList?: Part[]
  modelType?: string
}

interface GeneratedFile {
  id: string
  name: string
  content: string
  type: 'code' | 'diagram' | 'text'
  language?: string
}

interface Part {
  name: string
  quantity: number
  description: string
}

interface AIStore {
  provider: string
  apiKey: string
  showProviderModal: boolean
  messages: Message[]
  isProcessing: boolean
  setProvider: (provider: string) => void
  setApiKey: (key: string) => void
  setShowProviderModal: (show: boolean) => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateLastMessage: (updates: Partial<Message>) => void
  setProcessing: (processing: boolean) => void
  clearMessages: () => void
}

const encryptKey = (key: string) => CryptoJS.AES.encrypt(key, 'nyxer-secret').toString()
const decryptKey = (encrypted: string) => CryptoJS.AES.decrypt(encrypted, 'nyxer-secret').toString(CryptoJS.enc.Utf8)

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      provider: '',
      apiKey: '',
      showProviderModal: false,
      messages: [],
      isProcessing: false,
      setProvider: (provider) => set({ provider }),
      setApiKey: (key) => set({ apiKey: encryptKey(key) }),
      setShowProviderModal: (show) => set({ showProviderModal: show }),
      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          timestamp: new Date()
        }
        set((state) => ({ messages: [...state.messages, newMessage] }))
      },
      updateLastMessage: (updates) => {
        set((state) => {
          const messages = [...state.messages]
          if (messages.length > 0) {
            messages[messages.length - 1] = { ...messages[messages.length - 1], ...updates }
          }
          return { messages }
        })
      },
      setProcessing: (processing) => set({ isProcessing: processing }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'nyxer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        provider: state.provider,
        apiKey: state.apiKey
      })
    }
  )
)

export const getDecryptedApiKey = () => {
  const { apiKey, provider } = useAIStore.getState()
  if (!apiKey || !provider) return null
  try {
    return decryptKey(apiKey)
  } catch {
    return null
  }
}
