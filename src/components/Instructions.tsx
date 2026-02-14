const instructions = [
  { title: 'SETUP', content: 'Select provider → Enter API key → Start chatting' },
  { title: 'PROMPTS', content: 'Be specific. Hardware. Software. Hybrid. Describe features.' },
  { title: '3D', content: 'Drag to rotate. Scroll to zoom. Simple.' },
  { title: 'FILES', content: 'Download buttons in each panel. SVG for diagrams. Code as text.' },
]

export default function Instructions() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b-2 border-black">
        <h3 className="font-mono text-sm font-bold">INFO</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {instructions.map((item, i) => (
            <div key={i} className="border-2 border-black p-4">
              <h4 className="font-mono text-sm font-bold mb-2">{item.title}</h4>
              <p className="font-mono text-xs">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
