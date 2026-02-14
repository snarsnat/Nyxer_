import { useState } from 'react'
import { FileCode, Download, Copy, Check } from 'lucide-react'

interface GeneratedFile {
  id: string
  name: string
  content: string
  language?: string
}

interface CodeViewerProps {
  files?: GeneratedFile[]
}

export default function CodeViewer({ files = [] }: CodeViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (files.length === 0) return
    navigator.clipboard.writeText(files[selectedIndex].content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (files.length === 0) return
    const file = files[selectedIndex]
    const blob = new Blob([file.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLanguageColor = (lang?: string) => {
    const colors: Record<string, string> = {
      javascript: 'text-yellow-500',
      typescript: 'text-blue-500',
      python: 'text-green-500',
      c: 'text-blue-600',
      'c++': 'text-pink-500',
      arduino: 'text-cyan-500',
      html: 'text-orange-500',
      css: 'text-blue-400',
      json: 'text-gray-500',
      markdown: 'text-gray-600'
    }
    return colors[lang || ''] || 'text-slate-500'
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-3 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-700">Code</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <FileCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No code generated yet</p>
            <p className="text-xs mt-1">Describe a product to generate code files</p>
          </div>
        </div>
      </div>
    )
  }

  const currentFile = files[selectedIndex]
  const lines = currentFile.content.split('\n')

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center border-b border-slate-200">
        <div className="flex-1 flex overflow-x-auto">
          {files.map((file, index) => (
            <button
              key={file.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedIndex === index
                  ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 px-2 border-l border-slate-200">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-900">
        <div className="flex">
          <div className="flex-shrink-0 w-12 py-3 text-right pr-3 text-xs text-slate-500 font-mono select-none">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 py-3 pr-4 overflow-x-auto">
            <code className="text-sm font-mono text-slate-300 leading-6 whitespace-pre">
              {currentFile.content}
            </code>
          </pre>
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span className={`text-xs font-medium ${getLanguageColor(currentFile.language)}`}>
          {currentFile.language || 'text'}
        </span>
        <span className="text-xs text-slate-500">
          {lines.length} lines
        </span>
      </div>
    </div>
  )
}
