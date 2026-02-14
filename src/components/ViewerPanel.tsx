const tabs = [
  { id: '3d', label: '3D' },
  { id: 'diagram', label: 'DIAGRAM' },
  { id: 'code', label: 'CODE' },
  { id: 'instructions', label: 'INFO' },
]

export default function ViewerPanel({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex border-b-2 border-black">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-mono border-r-2 border-black last:border-r-0 ${
              activeTab === tab.id
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === '3d' && <ThreeDViewer />}
        {activeTab === 'diagram' && <DiagramViewer />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'instructions' && <Instructions />}
      </div>
    </div>
  )
}

import ThreeDViewer from './ThreeDViewer'
import DiagramViewer from './DiagramViewer'
import CodeViewer from './CodeViewer'
import Instructions from './Instructions'
