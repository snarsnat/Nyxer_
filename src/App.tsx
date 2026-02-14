import { useState } from 'react'
import { useAIStore } from './store/aiStore'
import ProviderModal from './components/ProviderModal'
import ChatPanel from './components/ChatPanel'
import ViewerPanel from './components/ViewerPanel'

export default function App() {
  const { provider, setShowProviderModal } = useAIStore()
  const [activeTab, setActiveTab] = useState('3d')

  return (
    <div className="h-screen flex flex-col bg-white text-black font-mono">
      <header className="h-12 border-b-2 border-black flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">nyxer_</span>
        </div>
        <button
          onClick={() => setShowProviderModal(true)}
          className="px-4 py-1 border-2 border-black hover:bg-black hover:text-white text-sm font-mono"
        >
          {provider ? provider.toUpperCase() : 'PROVIDER +'}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r-2 border-black">
          <ChatPanel />
        </div>
        
        <div className="w-1/2">
          <ViewerPanel activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <ProviderModal />
    </div>
  )
}
