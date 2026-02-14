export default function CodeViewer() {
  const code = `// nyxer_ generated code
const product = {
  name: "example",
  type: "prototype",
  files: []
};

export default product;`

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b-2 border-black flex justify-between items-center">
        <h3 className="font-mono text-sm font-bold">CODE</h3>
        <span className="font-mono text-xs border-2 border-black px-2 py-1">DOWNLOAD</span>
      </div>
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <pre className="font-mono text-xs bg-white border-2 border-black p-4">{code}</pre>
      </div>
    </div>
  )
}
