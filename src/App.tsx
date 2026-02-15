import { useAIStore } from './store/aiStore'
import ProviderModal from './components/ProviderModal'
import ChatPanel from './components/ChatPanel'
import ViewerPanel from './components/ViewerPanel'
import { Settings } from 'lucide-react'

export default function App() {
  const { setShowProviderModal } = useAIStore()

  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
      {/* Left Sidebar - Chat */}
      <aside className="w-80 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm z-10">
        <header className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="font-bold text-slate-900 tracking-tight">Nyxer_</h1>
          </div>
          <button 
            onClick={() => setShowProviderModal(true)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <ChatPanel />
        </div>
      </aside>

      {/* Main Content - Browser Style Viewer */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100">
        <ViewerPanel />
      </main>

      <ProviderModal />
    </div>
  )
}
