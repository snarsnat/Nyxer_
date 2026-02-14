import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Torus, Cylinder } from '@react-three/drei'

export default function ThreeDViewer() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-medium">3D Model Viewer</h3>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
      <div className="flex-1 bg-slate-800">
        <Canvas camera={{ position: [3, 3, 3] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Box position={[0, 0.5, 0]}>
            <meshStandardMaterial color="cyan" />
          </Box>
          <Sphere position={[1.5, 0.5, 0]}>
            <meshStandardMaterial color="purple" />
          </Sphere>
          <Torus position={[-1.5, 0.5, 0]}>
            <meshStandardMaterial color="pink" />
          </Torus>
          <Cylinder position={[0, 0.5, 1.5]}>
            <meshStandardMaterial color="yellow" />
          </Cylinder>
          <OrbitControls />
        </Canvas>
      </div>
      <div className="p-3 text-xs text-slate-500 text-center">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
