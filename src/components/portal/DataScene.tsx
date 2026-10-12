import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Palette = { cyan: string; gold: string; violet: string };
function Network({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => Array.from({ length: 84 }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + .5) / 84);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    return new THREE.Vector3(2.35 * Math.sin(phi) * Math.cos(theta), 2.35 * Math.cos(phi), 2.35 * Math.sin(phi) * Math.sin(theta));
  }), []);
  const positions = useMemo(() => new Float32Array(nodes.flatMap(n => n.toArray())), [nodes]);
  const edges = useMemo(() => {
    const values: number[] = [];
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { if (a.distanceTo(b) < 1.02) values.push(...a.toArray(), ...b.toArray()); }));
    return new Float32Array(values);
  }, [nodes]);
  const particles = useMemo(() => new Float32Array(Array.from({ length: 220 * 3 }, (_, i) => Math.sin(i * 123.45) * (i % 3 === 0 ? 11 : 5.5))), []);
  useFrame(({ pointer, camera }, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, .05);
    if (group.current) { group.current.rotation.y += dt * .085; group.current.rotation.z = Math.sin(group.current.rotation.y) * .12; }
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * .4, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * .25, 2, dt);
    camera.lookAt(0, 0, 0);
  });
  return <>
    <group ref={group} position={[1.3, -.1, -1]} rotation={[.3, .2, -.15]}>
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[edges, 3]} /></bufferGeometry><lineBasicMaterial color={palette.cyan} transparent opacity={.23} /></lineSegments>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color={palette.cyan} size={.065} transparent opacity={.9} sizeAttenuation /></points>
      {[0, 1, 2].map(i => <mesh key={i} rotation={[Math.PI / 2 + i * .7, i * .5, i * .5]}><torusGeometry args={[2.8 + i * .11, .006, 5, 100]} /><meshBasicMaterial color={i === 1 ? palette.gold : palette.cyan} transparent opacity={.24} /></mesh>)}
      {nodes.filter((_, i) => i % 12 === 0).map((n, i) => <mesh position={n} key={i}><sphereGeometry args={[.065, 12, 8]} /><meshStandardMaterial color={palette.gold} emissive={palette.gold} emissiveIntensity={1.5} metalness={.6} roughness={.2} /></mesh>)}
    </group>
    <group position={[4.1, -1.9, -2]} rotation={[.1, -.5, .08]}>
      {[.7, 1.2, .95, 1.65, 2.1, 1.75].map((h, i) => <mesh key={i} position={[i * .32, h / 2, 0]}><boxGeometry args={[.18, h, .22]} /><meshStandardMaterial color={i > 3 ? palette.gold : palette.cyan} metalness={.5} roughness={.23} transparent opacity={.55} emissive={palette.cyan} emissiveIntensity={.12} /></mesh>)}
    </group>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry><pointsMaterial color={palette.cyan} size={.02} transparent opacity={.25} /></points>
  </>;
}
export default function DataScene() {
  const [palette, setPalette] = useState<Palette>();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const colour = (name: string) => {
      const el = document.createElement('span'); el.style.color = css.getPropertyValue(name); document.body.appendChild(el);
      const computed = getComputedStyle(el).color; el.remove();
      // Canvas resolves OKLCH tokens into sRGB, which Three.js can consume.
      const context = document.createElement('canvas').getContext('2d');
      if (!context) return computed;
      context.fillStyle = computed; context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      return `rgb(${r},${g},${b})`;
    };
    setPalette({ cyan: colour('--scene-cyan'), gold: colour('--gold'), violet: colour('--violet') });
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  if (!palette) return null;
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 11], fov: 42 }} gl={{ alpha: true, antialias: true }} frameloop={reduced ? 'demand' : 'always'}>
    <ambientLight intensity={.5} /><directionalLight position={[4, 5, 8]} intensity={2} />
    <Environment resolution={64}><Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} /><Lightformer intensity={1} color={palette.gold} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 1, 1]} /></Environment>
    <Network palette={palette} reduced={reduced} />
  </Canvas>;
}
