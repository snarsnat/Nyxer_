import { useState } from 'react'
import { useAIStore } from '../store/aiStore'
import { FileCode, Box, GitBranch, BookOpen, Download, Globe, ChevronDown, File, Folder } from 'lucide-react'
import JSZip from 'jszip'
import ThreeDViewer from './ThreeDViewer'
import DiagramViewer from './DiagramViewer'
import InstructionsPanel from './InstructionsPanel'

export default function ViewerPanel() {
  const [activeTab, setActiveTab] = useState('instructions')
  const { messages } = useAIStore()
  const lastPrototype = messages.filter(m => m.prototype).pop()
  const prototype = lastPrototype?.prototype

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: BookOpen },
    { id: '3d', label: '3D Model', icon: Box },
    { id: 'diagram', label: 'Diagrams', icon: GitBranch },
    { id: 'code', label: 'Code Explorer', icon: FileCode },
  ]

  const handleExport = async () => {
    if (!prototype?.code) return
    
    const zip = new JSZip()
    
    // Add code files
    prototype.code.forEach((file: any) => {
      zip.file(file.name, file.content)
    })
    
    // Add instructions
    const instructionsText = [
      `# Build Instructions: ${lastPrototype?.content || 'Prototype'}`,
      '',
      '## Steps',
      ...prototype.instructions.map((step: string, i: number) => `${i + 1}. ${step}`),
      '',
      '## Parts List',
      ...(prototype.partsList || []).map((part: any) => `- ${part.name} (x${part.quantity}): ${part.description}`)
    ].join('\n')
    
    zip.file('INSTRUCTIONS.md', instructionsText)
    
    // Add diagrams
    prototype.diagrams.forEach((diag: any) => {
      zip.file(`diagrams/${diag.name.replace(/\s+/g, '-').toLowerCase()}.mmd`, diag.content)
    })

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `nyxer-prototype-${Date.now()}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Browser Header */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg flex-1 max-w-2xl">
          <Globe className="w-4 h-4 text-slate-400" />
          <div className="text-xs text-slate-600 font-mono truncate">
            nyxer://prototypes/{lastPrototype?.id || 'new-project'}
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={!prototype}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Project (.zip)
        </button>
      </div>

      {/* Browser Tabs */}
      <div className="flex bg-slate-200/50 px-2 pt-2 gap-1 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium flex items-center gap-2 rounded-t-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {!prototype ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Waiting for prototype generation...</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-hidden">
            {activeTab === 'instructions' && (
              <InstructionsPanel 
                instructions={prototype.instructions}
                parts={prototype.partsList}
              />
            )}
            {activeTab === '3d' && (
              <ThreeDViewer modelType={prototype.modelType} />
            )}
            {activeTab === 'diagram' && (
              <DiagramViewer diagrams={prototype.diagrams} />
            )}
            {activeTab === 'code' && (
              <FileExplorer files={prototype.code} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FileExplorer({ files }: { files: any[] }) {
  const [selectedFile, setSelectedFile] = useState(files[0] || null)

  return (
    <div className="h-full flex">
      {/* Sidebar Explorer */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-3 border-b border-slate-200 bg-white">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Files</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 font-medium">
            <ChevronDown className="w-4 h-4" />
            <Folder className="w-4 h-4 text-blue-500 fill-blue-500" />
            root
          </div>
          <div className="ml-4 space-y-0.5">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
                  selectedFile?.id === file.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <File className="w-4 h-4 opacity-70" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedFile ? (
          <>
            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">{selectedFile.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded uppercase font-bold">
                {selectedFile.language}
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed bg-white">
              <pre className="text-slate-800">{selectedFile.content}</pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a file to view code
          </div>
        )}
      </div>
    </div>
  )
}
