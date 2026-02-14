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

    // Simulated AI response (replace with real API call)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `🎉 Great idea! I'm generating your product prototype for: "${input}"

Here's what I'm creating:
📦 Project Structure
🔌 Circuit Diagram (for hardware)
🏗️ Architecture Diagram (for software)  
🎨 3D Model Preview

This is a demo response. The full AI integration will generate actual code, diagrams, and 3D models!`,
        timestamp: new Date()
      }
      addMessage(aiResponse)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-center">
            <div>
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-lg font-medium mb-2">Welcome to Nyxer_!</p>
              <p className="text-sm">Describe a product idea and I'll generate<br/>code, diagrams, and 3D models!</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/20 border border-cyan-500/30' 
                  : 'bg-slate-700'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={provider ? "Describe your product idea..." : "Select a provider first"}
            disabled={!provider || !apiKey}
            className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || !provider || loading}
            className="p-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
