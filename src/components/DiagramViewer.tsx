import { GitBranch, Download } from 'lucide-react'

export default function DiagramViewer() {
  const sampleDiagram = `
graph TD
    A[User Input] --> B[AI Analysis]
    B --> C{Hardware?}
    C -->|Yes| D[Generate Circuit]
    C -->|No| E{Software?}
    E -->|Yes| F[Generate Architecture]
    E -->|Both| G[Generate Both]
    D --> H[3D Model]
    F --> H
    G --> H
    H --> I[Download Files]
  `

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-medium">Diagram Viewer</h3>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <Download className="w-4 h-4" /> SVG
        </button>
      </div>
      <div className="flex-1 p-4 bg-slate-800 overflow-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <GitBranch className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-2">Circuit & Architecture Diagrams</p>
            <p className="text-xs text-slate-500">
              Describe a hardware product → circuit diagram<br/>
              Describe software → architecture diagram
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
