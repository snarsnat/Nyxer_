import { useState, useEffect } from 'react'
import { useAIStore, getDecryptedApiKey } from '../store/aiStore'
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const PROVIDERS = [
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250514'],
    url: 'https://console.anthropic.com/api-keys'
  },
  { 
    id: 'openai', 
    name: 'OpenAI', 
    models: ['gpt-4o', 'gpt-4o-mini'],
    url: 'https://platform.openai.com/api-keys'
  }
]

export default function ProviderModal() {
  const { provider: storedProvider, apiKey: encryptedKey, setProvider, setApiKey, setShowProviderModal } = useAIStore()
  const [selectedProvider, setSelectedProvider] = useState(storedProvider || '')
  const [selectedModel, setSelectedModel] = useState('')
  const [key, setKey] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider)

  useEffect(() => {
    if (encryptedKey && storedProvider) {
      setSelectedProvider(storedProvider)
      setStep(3)
    }
  }, [encryptedKey, storedProvider])

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const testPrompt = 'Respond with exactly: {"status": "ok"}'
      
      if (selectedProvider === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 100
          })
        })

        if (!response.ok) throw new Error('Invalid API key')
      } else if (selectedProvider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 100
          })
        })

        if (!response.ok) throw new Error('Invalid API key')
      }

      setTestResult({ success: true, message: 'Connection successful!' })
    } catch (err) {
      setTestResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Connection failed' 
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    if (selectedProvider && key && selectedModel) {
      setProvider(selectedProvider)
      setApiKey(key)
      setShowProviderModal(false)
    }
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    else if (step === 3) {
      setSelectedProvider('')
      setSelectedModel('')
      setKey('')
      setStep(1)
    }
  }

  if (!useAIStore.getState().showProviderModal) return null

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">AI Provider Setup</h2>
          <button
            onClick={() => setShowProviderModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <>
              <div className="space-y-3">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProvider(p.id); setStep(2); }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedProvider === p.id 
                        ? 'border-slate-900 bg-slate-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{p.name}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {p.models.length} models available
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && currentProvider && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Choose a model...</option>
                  {currentProvider.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm"
                />
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Shield className="w-4 h-4" />
                  Your key is encrypted and stored locally
                </div>
              </div>

              {testResult && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {testResult.message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={testConnection}
                    disabled={!key || !selectedModel || testing}
                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {testing && <Loader2 className="w-4 h-4 animate-spin" />}
                    Test
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!key || !selectedModel}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>

              <a
                href={currentProvider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-center text-sm text-slate-500 hover:text-slate-700"
              >
                Get your API key from {currentProvider.name} →
              </a>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {currentProvider?.name} Connected
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Your API key is saved and ready to use.
                </p>
                <button
                  onClick={() => setShowProviderModal(false)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  Start Prototyping
                </button>
              </div>

              <button
                onClick={handleBack}
                className="w-full mt-4 px-4 py-2 text-slate-600 hover:text-slate-900 text-sm"
              >
                Change provider
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
