import { useState, useRef } from 'react'
import { useAIStore } from '../store/aiStore'
import { Send, Loader2 } from 'lucide-react'

export default function ChatPanel() {
  const { messages, addMessage, provider, apiKey } = useAIStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    if (!input.trim() || !provider || !apiKey) return
    
    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input, timestamp: new Date() }
    addMessage(userMessage)
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Understood. Processing: "${input}"\n\nGenerating prototype files, diagrams, and models. This is a demo — real AI integration coming soon.`,
        timestamp: new Date()
      }
      addMessage(aiResponse)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col bg-white text-black">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="max-w-xs">
              <p className="mb-2">nyxer_</p>
              <p className="text-xs">Describe a product. Get code, diagrams, 3D models. That's it.</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`font-mono text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className="text-xs text-gray-400 mb-1 block">
                {msg.role === 'user' ? '→ you' : '← nyxer'}
              </span>
              <div className={`inline-block p-3 max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-black border border-gray-200'
              }`}>
                <pre className="whitespace-pre-wrap font-mono text-sm">{msg.content}</pre>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEnd} />
      </div>

      <div className="p-4 border-t-2 border-black">
        <div className="flex gap-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={provider ? "describe a product..." : "select a provider first"}
            disabled={!provider}
            className="flex-1 p-3 bg-white border-2 border-black font-mono text-sm focus:outline-none focus:bg-gray-50 disabled:bg-gray-100"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="px-6 bg-black text-white border-2 border-black font-mono text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '...' : '→'}
          </button>
        </div>
      </div>
    </div>
  )
}
