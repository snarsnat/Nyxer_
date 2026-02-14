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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold mb-4">Select AI Provider</h2>
        
        {step === 1 ? (
          <>
            <div className="space-y-2 mb-4">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setStep(2); }}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedProvider === p.id 
                      ? 'bg-cyan-500/20 border border-cyan-500' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium">{p.name}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowProviderModal(false)}
              className="text-slate-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">
                Select Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
              >
                <option value="">Choose a model...</option>
                {currentProvider?.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">
                API Key (stored locally, never shared)
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedModel || !key}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
