import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Download, FileText, GitBranch } from 'lucide-react'

interface GeneratedFile {
  id: string
  name: string
  content: string
}

interface DiagramViewerProps {
  diagrams?: GeneratedFile[]
}

export default function DiagramViewer({ diagrams = [] }: DiagramViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    })
  }, [])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || diagrams.length === 0) return

      containerRef.current.innerHTML = ''
      const file = diagrams[selectedIndex]
      
      try {
        const id = `mermaid-${file.id}-${Date.now()}`
        const { svg } = await mermaid.render(id, file.content)
        containerRef.current.innerHTML = svg
      } catch (error) {
        containerRef.current.innerHTML = `
          <div class="p-4 text-slate-500 text-center">
            <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Unable to render diagram</p>
          </div>
        `
      }
    }

    renderDiagram()
  }, [diagrams, selectedIndex])

  const handleDownload = () => {
    if (diagrams.length === 0 || !containerRef.current) return
    
    const svg = containerRef.current.querySelector('svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${diagrams[selectedIndex].name.replace(/\s+/g, '-').toLowerCase()}.svg`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (diagrams.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-3 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-700">Diagrams</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No diagrams generated yet</p>
            <p className="text-xs mt-1">Describe a product with hardware/software components</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-700">Diagrams</h3>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download SVG
        </button>
      </div>

      {diagrams.length > 1 && (
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {diagrams.map((diagram, index) => (
            <button
              key={diagram.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedIndex === index
                  ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {diagram.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 bg-slate-50">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div 
            ref={containerRef}
            className="mermaid-container flex items-center justify-center min-h-[200px]"
            style={{ minHeight: '300px' }}
          />
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-500">
            {diagrams[selectedIndex].name}
          </p>
        </div>
      </div>
    </div>
  )
}
