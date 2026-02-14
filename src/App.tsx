import { useEffect } from 'react'
import { useAIStore } from './store/aiStore'
import ProviderModal from './components/ProviderModal'
import ChatPanel from './components/ChatPanel'
import ViewerPanel from './components/ViewerPanel'

export default function App() {
  const { provider } = useAIStore()

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Nyxer_</h1>
        </div>
        <ProviderButton />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ChatPanel />
        <ViewerPanel />
      </div>

      <ProviderModal />
    </div>
  )
}

function ProviderButton() {
  const { provider, setShowProviderModal } = useAIStore()

  return (
    <button
      onClick={() => setShowProviderModal(true)}
      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
    >
      {provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'Setup Provider'}
    </button>
  )
}
