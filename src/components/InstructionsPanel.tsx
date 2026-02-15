import { useState } from 'react'
import { BookOpen, Package, CheckCircle2 } from 'lucide-react'

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

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveSection('instructions')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeSection === 'instructions'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Build Guide
        </button>
        <button
          onClick={() => setActiveSection('parts')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeSection === 'parts'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Parts List
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {activeSection === 'instructions' ? (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Step-by-Step Instructions</h2>
              </div>
              <div className="space-y-6">
                {instructions.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Package className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Required Components</h2>
              </div>
              <div className="grid gap-4">
                {parts.length > 0 ? (
                  parts.map((part, index) => (
                    <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900">{part.name}</h3>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                            x{part.quantity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{part.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No specific parts listed for this prototype.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
