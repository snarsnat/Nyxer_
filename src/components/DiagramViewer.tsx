export default function DiagramViewer() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b-2 border-black">
        <h3 className="font-mono text-sm font-bold">DIAGRAM VIEWER</h3>
      </div>
      <div className="flex-1 p-8 bg-white flex items-center justify-center">
        <div className="border-2 border-black p-8 max-w-lg w-full">
          <div className="font-mono text-center mb-4">FLOWCHART</div>
          <div className="space-y-2 font-mono text-xs">
            <div className="border-2 border-black p-2 text-center">INPUT</div>
            <div className="text-center">↓</div>
            <div className="border-2 border-black p-2 text-center">ANALYSIS</div>
            <div className="text-center">↓</div>
            <div className="border-2 border-black p-2 text-center">GENERATE</div>
            <div className="text-center">↓</div>
            <div className="border-2 border-black p-2 text-center">OUTPUT</div>
          </div>
        </div>
      </div>
    </div>
  )
}
