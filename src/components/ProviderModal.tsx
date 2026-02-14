import { useState } from 'react'
import { useAIStore } from '../store/aiStore'

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { id: 'google', name: 'Google', models: ['gemini-pro', 'gemini-ultra'] },
  { id: 'mistral', name: 'Mistral', models: ['mistral-large', 'mistral-medium'] },
  { id: 'cohere', name: 'Cohere', models: ['command-r-plus', 'command-r'] },
]

export default function ProviderModal() {
  const { provider, apiKey, setProvider, setApiKey, setShowProviderModal } = useAIStore()
  const [selectedProvider, setSelectedProvider] = useState(provider || '')
  const [selectedModel, setSelectedModel] = useState('')
  const [key, setKey] = useState(apiKey || '')
  const [step, setStep] = useState(1)

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider)

  const handleSave = () => {
    if (selectedProvider && key) {
      setProvider(selectedProvider)
      setApiKey(key)
      setShowProviderModal(false)
    }
  }

  if (!useAIStore.getState().showProviderModal) return null

  return (
    <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-mono text-lg font-bold">PROVIDER</h2>
          <button
            onClick={() => setShowProviderModal(false)}
            className="font-mono text-xl hover:bg-black hover:text-white px-2"
          >
            ×
          </button>
        </div>
        
        {step === 1 ? (
          <>
            <div className="space-y-0 mb-6">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setStep(2); }}
                  className={`w-full p-4 text-left font-mono border-2 border-black mb-[-2px] transition ${
                    selectedProvider === p.id 
                      ? 'bg-black text-white' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block font-mono text-xs mb-2 uppercase">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 bg-white border-2 border-black font-mono"
              >
                <option value="">Select model...</option>
                {currentProvider?.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block font-mono text-xs mb-2 uppercase">API Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-3 bg-white border-2 border-black font-mono"
              />
              <p className="font-mono text-xs mt-2 text-gray-500">Stored locally. Never sent anywhere else.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 font-mono border-2 border-black hover:bg-black hover:text-white"
              >
                BACK
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedModel || !key}
                className="flex-1 py-3 bg-black text-white font-mono border-2 border-black hover:bg-gray-800 disabled:opacity-50"
              >
                SAVE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
