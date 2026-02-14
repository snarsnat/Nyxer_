import { BookOpen } from 'lucide-react'

const instructions = [
  {
    title: 'Getting Started',
    content: `
1. Click "Select AI Provider" in the top right
2. Choose your AI provider (OpenAI, Anthropic, etc.)
3. Enter your API key (stored locally, never shared)
4. Start describing your product idea!
    `
  },
  {
    title: 'Writing Good Prompts',
    content: `
• Be specific about product type (hardware/software/hybrid)
• Describe features and functionality
• Mention any specific requirements
• Example: "A smart thermostat with mobile app control"
    `
  },
  {
    title: 'Viewing 3D Models',
    content: `
• Use mouse drag to rotate
• Scroll to zoom in/out
• Click Download to save as file
    `
  },
  {
    title: 'Downloading Files',
    content: `
• Click Download buttons in each tab
• Get SVG for diagrams
• Get ZIP for code
• Get 3D files (OBJ/GLTF)
    `
  }
]

export default function Instructions() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700">
        <h3 className="font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          How to Use Nyxer_
        </h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {instructions.map((item, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-cyan-400 mb-2">{item.title}</h4>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap">{item.content}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
