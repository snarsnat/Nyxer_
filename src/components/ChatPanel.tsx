import { useState, useRef, useEffect } from 'react'
import { useAIStore, getDecryptedApiKey } from '../store/aiStore'
import { generatePrototype } from '../services/aiService'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

export default function ChatPanel() {
  const { messages, addMessage, updateLastMessage, provider, isProcessing, setProcessing } = useAIStore()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return
    
    const apiKey = getDecryptedApiKey()
    if (!apiKey) {
      setError('Set up API key first')
      return
    }
    
    setError(null)
    const userMessage = input.trim()
    setInput('')
    
    addMessage({
      role: 'user',
      content: userMessage,
      prototype: undefined
    })
    
    setProcessing(true)
    
    try {
      addMessage({
        role: 'assistant',
        content: 'Thinking...',
        prototype: undefined
      })
      
      const response = await generatePrototype(userMessage, provider)
      
      updateLastMessage({
        content: response.content,
        prototype: {
          code: response.code as any,
          diagrams: response.diagrams as any,
          instructions: response.instructions,
          partsList: response.parts,
          modelType: response.modelType
        }
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      updateLastMessage({ content: `Error: ${errorMessage}` })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Bot className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Describe your product idea to start prototyping.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                message.role === 'user' ? 'bg-slate-900' : 'bg-slate-100'
              }`}>
                {message.role === 'user' ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-slate-600" />}
              </div>
              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                message.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-100 bg-white">
        {error && (
          <div className="mb-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </div>
        )}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
            placeholder="What are we building?"
            className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 bottom-2 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
