import { useState } from 'react'
import { useAIStore } from './store/aiStore'
import ProviderModal from './components/ProviderModal'
import ChatPanel from './components/ChatPanel'
import ViewerPanel from './components/ViewerPanel'

export default function App() {
  const { provider, apiKey, setShowProviderModal } = useAIStore()
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <header className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Nyxer_
          </h1>
        </div>
        <button
          onClick={() => setShowProviderModal(true)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition"
        >
          {provider ? `Provider: ${provider}` : 'Select AI Provider'}
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-1/2 border-r border-slate-700">
          <ChatPanel />
        </div>
        
        {/* Viewer Panel */}
        <div className="w-1/2">
          <ViewerPanel activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Provider Modal */}
      <ProviderModal />
    </div>
  )
}
