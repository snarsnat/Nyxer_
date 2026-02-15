import { useState } from 'react'
import { useAIStore } from '../store/aiStore'
import { FileCode, Box, GitBranch, BookOpen } from 'lucide-react'
import ThreeDViewer from './ThreeDViewer'
import DiagramViewer from './DiagramViewer'
import CodeViewer from './CodeViewer'
import InstructionsPanel from './InstructionsPanel'

export default function ViewerPanel() {
  const [activeTab, setActiveTab] = useState('3d')
  const { messages } = useAIStore()
  const lastPrototype = messages.filter(m => m.prototype).pop()

  const tabs = [
    { id: '3d', label: '3D Model', icon: Box },
    { id: 'diagram', label: 'Diagrams', icon: GitBranch },
    { id: 'code', label: 'Code', icon: FileCode },
    { id: 'instructions', label: 'Instructions', icon: BookOpen },
  ]

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="flex border-b border-slate-200 bg-white">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === '3d' && (
          <ThreeDViewer modelType={lastPrototype?.prototype?.modelType} />
        )}
        {activeTab === 'diagram' && (
          <DiagramViewer diagrams={lastPrototype?.prototype?.diagrams} />
        )}
        {activeTab === 'code' && (
          <CodeViewer files={lastPrototype?.prototype?.code} />
        )}
        {activeTab === 'instructions' && (
          <InstructionsPanel 
            instructions={lastPrototype?.prototype?.instructions}
            parts={lastPrototype?.prototype?.partsList}
          />
        )}
      </div>
    </div>
  )
}
