import { Code2, Box, GitBranch, BookOpen, Download } from 'lucide-react'
import ThreeDViewer from './ThreeDViewer'
import DiagramViewer from './DiagramViewer'
import CodeViewer from './CodeViewer'
import Instructions from './Instructions'

interface ViewerPanelProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = [
  { id: '3d', label: '3D Model', icon: Box },
  { id: 'diagram', label: 'Diagrams', icon: GitBranch },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'instructions', label: 'Instructions', icon: BookOpen },
]

export default function ViewerPanel({ activeTab, setActiveTab }: ViewerPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition ${
              activeTab === tab.id
                ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === '3d' && <ThreeDViewer />}
        {activeTab === 'diagram' && <DiagramViewer />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'instructions' && <Instructions />}
      </div>
    </div>
  )
}
