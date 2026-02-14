import { useState } from 'react'
import { BookOpen, Download, Copy, Check, Package, Wrench } from 'lucide-react'

interface Part {
  name: string
  quantity: number
  description: string
}

interface InstructionsPanelProps {
  instructions?: string[]
  parts?: Part[]
}

export default function InstructionsPanel({ instructions = [], parts = [] }: InstructionsPanelProps) {
  const [activeSection, setActiveSection] = useState<'instructions' | 'parts'>('instructions')
  const [copied, setCopied] = useState(false)

  const handleCopyAll = () => {
    const text = [
      'INSTRUCTIONS',
      '============',
      ...instructions,
      '',
      'PARTS LIST',
      '==========',
      ...parts.map(p => `- ${p.quantity}x ${p.name}: ${p.description}`)
    ].join('\n')
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (instructions.length === 0 && parts.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-3 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-700">Instructions</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No instructions generated yet</p>
            <p className="text-xs mt-1">Describe a product to get step-by-step instructions</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center border-b border-slate-200">
        <button
          onClick={() => setActiveSection('instructions')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeSection === 'instructions'
              ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Wrench className="w-4 h-4" />
            Instructions
          </div>
        </button>
        <button
          onClick={() => setActiveSection('parts')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeSection === 'parts'
              ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Parts ({parts.length})
          </div>
        </button>
        {(instructions.length > 0 || parts.length > 0) && (
          <button
            onClick={handleCopyAll}
            className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border-l border-slate-200"
            title="Copy all"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeSection === 'instructions' && (
          <div className="space-y-4">
            {instructions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No instructions available</p>
            ) : (
              instructions.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'parts' && (
          <div className="space-y-3">
            {parts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No parts list available</p>
            ) : (
              parts.map((part, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{part.name}</span>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">
                        {part.quantity}x
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{part.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
