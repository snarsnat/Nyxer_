import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Torus, Cylinder } from '@react-three/drei'

export default function ThreeDViewer() {
  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-3 border-b-2 border-black bg-white">
        <h3 className="font-mono text-sm font-bold">3D VIEWER</h3>
      </div>
      <div className="flex-1 bg-gray-200">
        <Canvas camera={{ position: [3, 3, 3] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} />
          <Box position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <Sphere position={[1.5, 0.5, 0]} args={[0.5, 32, 32]}>
            <meshStandardMaterial color="#333" />
          </Sphere>
          <Torus position={[-1.5, 0.5, 0]} args={[0.4, 0.15, 16, 32]}>
            <meshStandardMaterial color="#666" />
          </Torus>
          <Cylinder position={[0, 0.5, 1.5]} args={[0.3, 0.3, 0.8, 32]}>
            <meshStandardMaterial color="#999" />
          </Cylinder>
          <OrbitControls />
        </Canvas>
      </div>
      <div className="p-2 bg-white border-t-2 border-black text-xs font-mono text-center">
        DRAG TO ROTATE • SCROLL TO ZOOM
      </div>
    </div>
  )
}
