import { Stats, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { Debug, Physics, useBox, usePlane, useSphere, useTrimesh, useCylinder, useConvexPolyhedron } from '@react-three/cannon'
import { MeshNormalMaterial, IcosahedronGeometry, TorusKnotGeometry } from 'three'
import { useControls } from 'leva'
import CannonUtils from './CannonUtils'

function Plane(props) {
  const [ref] = usePlane(() => ({ ...props }), useRef())
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial />
    </mesh>
  )
}

function Box(props) {
  const [ref] = useBox(() => ({ args: [1, 1, 1], mass: 1, ...props }), useRef())

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

function Sphere(props) {
  const [ref] = useSphere(() => ({ args: [0.75], mass: 1, ...props }), useRef())

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.75]} />
      <meshNormalMaterial />
    </mesh>
  )
}

function Cylinder(props) {
  const [ref] = useCylinder(() => ({ args: [1, 1, 2, 8], mass: 1, ...props }), useRef())

  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={[1, 1, 2, 8]} />
      <meshNormalMaterial />
    </mesh>
  )
}

function Icosahedron(props) {
  const geometry = useMemo(() => new IcosahedronGeometry(1, 0), [])
  const args = useMemo(() => CannonUtils.toConvexPolyhedronProps(geometry), [geometry])
  const [ref] = useConvexPolyhedron(() => ({ args, mass: 1, ...props }), useRef())

  return (
    <mesh ref={ref} castShadow geometry={geometry}>
      <meshNormalMaterial />
    </mesh>
  )
}

function TorusKnot(props) {
  const geometry = useMemo(() => new TorusKnotGeometry(), [])
  const args = useMemo(() => CannonUtils.toTrimeshProps(geometry), [geometry])
  const [ref] = useTrimesh(() => ({ args, mass: 1, ...props }), useRef())

  return (
    <mesh ref={ref} castShadow>
      <torusKnotGeometry />
      <meshNormalMaterial />
    </mesh>
  )
}

export function Monkey(props) {
  const { nodes } = useGLTF('/models/monkey.glb')
  const args = useMemo(() => CannonUtils.toTrimeshProps(nodes.Suzanne.geometry), [nodes.Suzanne.geometry])
  const [ref] = useTrimesh(() => ({ args, mass: 1, ...props }), useRef())
  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh castShadow geometry={nodes.Suzanne.geometry} material={useMemo(() => new MeshNormalMaterial(), [])} />
    </group>
  )
}

export default function App() {
  const gravity = useControls('Gravity', {
    x: { value: 0, min: -10, max: 10, step: 0.1 },
    y: { value: -9.8, min: -10, max: 10, step: 0.1 },
    z: { value: 0, min: -10, max: 10, step: 0.1 }
  })
  return (
    <Canvas shadows camera={{ position: [0, 2, 4] }}>
      <spotLight position={[2.5, 5, 5]} angle={Math.PI / 4} penumbra={0.5} castShadow />
      <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 4} penumbra={0.5} castShadow />
      <Physics gravity={[gravity.x, gravity.y, gravity.z]}>
        <Debug>
          <Plane rotation={[-Math.PI / 2, 0, 0]} />
          <Box position={[-4, 3, 0]} />
          <Sphere position={[-2, 3, 0]} />
          <Cylinder position={[0, 3, 0]} />
          <Icosahedron position={[2, 3, 0]} />
          <TorusKnot position={[4, 3, 0]} />
          <Monkey position={[-2, 20, 0]} />
        </Debug>
      </Physics>
      <OrbitControls target-y={0.5} />
      <Stats />
    </Canvas>
  )
}
