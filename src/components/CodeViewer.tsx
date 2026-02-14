import { Download, FileCode } from 'lucide-react'

const sampleFiles = [
  { name: 'index.html', language: 'html' },
  { name: 'styles.css', language: 'css' },
  { name: 'app.js', language: 'javascript' },
]

export default function CodeViewer() {
  const code = `// Your generated code will appear here
const product = {
  name: "Awesome Product",
  type: "software",
  features: []
};

console.log("Hello from Nyxer_!");`

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-medium">Code Files</h3>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <Download className="w-4 h-4" /> Download All
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-slate-900 p-4">
        <pre className="text-sm font-mono text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
