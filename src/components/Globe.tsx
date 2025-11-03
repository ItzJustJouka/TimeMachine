// Globe.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useMemo } from 'react'

function FresnelMaterial() {
  const mat = useMemo(() => {
    const shader = THREE.ShaderLib.basic
    return new THREE.ShaderMaterial({
      uniforms: {
        ...shader.uniforms,
        color: { value: new THREE.Color('#66ccff') },
        time: { value: 0 },
      },
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vNormal;
        uniform vec3 color;
        void main() {
          // Fresnel-ish: brighter at grazing angles
          float fres = pow(1.0 - abs(vNormal.z), 2.0);
          gl_FragColor = vec4(color, 0.08 + 0.6 * fres);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])
  // return as a primitive material
  // @ts-ignore
  return <primitive object={mat} attach="material" />
}

function WireSphere({
  radius = 1,
  segments = 16,
  color = '#fff',
  opacity = 0.8,
}) {

  const geo = useMemo(
    () => new THREE.SphereGeometry(radius, segments, segments),
    [radius, segments]
  )

  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity,  }),
    [color, opacity]
  )

  // @ts-ignore
  return (
    <mesh geometry={geo} material={mat} />
  )
}

function Rings({
  radius = 1.001,
  rings = 6,
  color = '#fff',
  opacity = 0.35,
}) {
  // “Latitude” rings as thin torus lines
  const nodes = Array.from({ length: rings })
  return (
    <>
      {nodes.map((_, i) => {
        const t = (i + 1) / (rings + 1) // skip poles
        const ringRadius = Math.cos((t * Math.PI) - Math.PI / 2) * radius
        return ringRadius > 0.001 ? (
          <mesh key={i} rotation={[0, 0, 0]}>
            <torusGeometry args={[ringRadius, 0.0015, 8, 128]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
          </mesh>
        ) : null
      })}
    </>
  )
}

function Meridians({
  radius = 1.001,
  meridians = 12,
  color = '#fff',
  opacity = 0.35,
}) {
  const nodes = Array.from({ length: meridians })
  return (
    <>
      {nodes.map((_, i) => {
        const a = (i / meridians) * Math.PI
        return (
          <mesh key={i} rotation={[0, a, 0]}>
            <torusGeometry args={[radius, 0.0015, 8, 128]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
          </mesh>
        )
      })}
    </>
  )
}

function SpinningGlobe({ auto = true }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!auto || !group.current) return
    group.current.rotation.y += dt * 0.15
  })
  return (
    <group ref={group}>
      {/* Inner faint fill for glow */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <FresnelMaterial />
      </mesh>

      {/* Wireframe mesh */}
      <WireSphere radius={1.7} />

      {/* Stylized grid lines */}
      <Rings radius={1.701} />
      <Meridians radius={1.701} />
    </group>
  )
}

export default function Globe({
  interactive = false,
}: { interactive?: boolean; height?: number }) {
  return (
    <div style={{ width: '350px', height: '350px' }}>
      <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <SpinningGlobe />
        {interactive ? <OrbitControls enableZoom={false} /> : null}
      </Canvas>
    </div>
  )
}
