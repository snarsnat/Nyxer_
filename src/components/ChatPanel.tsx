import { useState, useRef, useEffect } from 'react'
import { useAIStore, getDecryptedApiKey } from '../store/aiStore'
import { generatePrototype } from '../services/aiService'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

export default function ChatPanel() {
  const { messages, addMessage, updateLastMessage, provider, isProcessing, setProcessing } = useAIStore()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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
      setError('Please set up your API key first')
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
        content: '',
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
      
      updateLastMessage({
        content: `Error: ${errorMessage}`
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={provider ? "Describe a product idea..." : "Set up your API key first"}
            disabled={!provider}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  const { setShowProviderModal, provider } = useAIStore()
  
  return (
    <div className="h-full flex items-center justify-center text-center p-8">
      <div className="max-w-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Nyxer_</h2>
        <p className="text-slate-500 mb-6">
          Describe a product idea — hardware, software, or hybrid — and I'll generate code, diagrams, and 3D models.
        </p>
        {!provider && (
          <button
            onClick={() => setShowProviderModal(true)}
            className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-slate-600" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[75%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-2.5 rounded-2xl ${
          isUser 
            ? 'bg-slate-900 text-white' 
            : 'bg-slate-100 text-slate-900'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.prototype && (
          <PrototypeCard prototype={message.prototype} />
        )}
      </div>
    </div>
  )
}

function PrototypeCard({ prototype }: { prototype: any }) {
  return (
    <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Prototype Generated
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-emerald-600">
        <div>{prototype.code?.length || 0} files</div>
        <div>{prototype.diagrams?.length || 0} diagrams</div>
        <div>{prototype.instructions?.length || 0} steps</div>
      </div>
    </div>
  )
}
