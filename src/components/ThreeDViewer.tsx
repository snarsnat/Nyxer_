import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface ThreeDViewerProps {
  modelType?: string
}

export default function ThreeDViewer({ modelType = 'simple' }: ThreeDViewerProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  
  return (
    <div className="h-full flex flex-col bg-slate-100">
      <div className="p-3 bg-white border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-700">3D Preview</h3>
        <span className="text-xs text-slate-500">Drag to rotate • Scroll to zoom</span>
      </div>
      <div className="flex-1">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />
          
          <Model type={modelType} hovered={hovered} setHovered={setHovered} />
          
          <OrbitControls 
            enablePan={false}
            minDistance={2}
            maxDistance={15}
          />
        </Canvas>
      </div>
    </div>
  )
}

function Model({ type, hovered, setHovered }: { type: string; hovered: string | null; setHovered: (s: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const [rotation, setRotation] = useState(0)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation + Math.sin(Date.now() / 2000) * 0.1
    }
  })

  switch (type) {
    case 'robot':
      return <RobotModel hovered={hovered} setHovered={setHovered} />
    case 'display':
      return <DisplayModel hovered={hovered} setHovered={setHovered} />
    case 'custom':
      return <CustomModel hovered={hovered} setHovered={setHovered} />
    default:
      return <SimpleModel hovered={hovered} setHovered={setHovered} />
  }
}

function SimpleModel({ hovered, setHovered }: { hovered: string | null; setHovered: (s: string | null) => void }) {
  return (
    <group ref={useRef<THREE.Group>(null)}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[1.2, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
        <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-1.2, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  )
}

function RobotModel({ hovered, setHovered }: { hovered: string | null; setHovered: (s: string | null) => void }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 0.6]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.5]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 1.1, 0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={hovered === 'eye' ? '#10b981' : '#3b82f6'} emissive={hovered === 'eye' ? '#10b981' : '#3b82f6'} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.15, 1.1, 0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={hovered === 'eye' ? '#10b981' : '#3b82f6'} emissive={hovered === 'eye' ? '#10b981' : '#3b82f6'} emissiveIntensity={0.5} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.7, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.6, 4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[0.7, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.6, 4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  )
}

function DisplayModel({ hovered, setHovered }: { hovered: string | null; setHovered: (s: string | null) => void }) {
  return (
    <group>
      {/* Screen */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Display area */}
      <mesh position={[0, 0.5, 0.06]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial 
          color="#111827" 
          emissive="#1f2937"
          emissiveIntensity={hovered === 'screen' ? 0.5 : 0.2}
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CustomModel({ hovered, setHovered }: { hovered: string | null; setHovered: (s: string | null) => void }) {
  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.2, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Main cylinder */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 1.4, 32]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0.5, 1.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}
