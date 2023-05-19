import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Stats } from '@react-three/drei/core/Stats';

import vertexShader from './vertexShader.vert?raw';
import fragmentShader from './fragmentShader.frag?raw';

// TODO:
const ParticleScene: React.FC = () => {
  const planePositions = useMemo(() => {
    const planeGeometry = new THREE.PlaneGeometry(6,6,128,128);
    const positions = planeGeometry.attributes.position.array;
    return positions;
  },[]);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: {
        value: 0
      }
    },
    vertexShader,
    fragmentShader
  }),[]);

  useFrame(() => {
    shaderArgs.uniforms.uTime.value++;
  });

  return ( 
    <points rotation={[-Math.PI / 2, 0, 0]}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={planePositions}
          itemSize={3}
          count={planePositions.length / 3}
        />
        <shaderMaterial
          transparent
          depthTest={false}
          depthWrite={false}
          args={[shaderArgs]}
        />
      </bufferGeometry>
    </points>
  )
}

const ParticlePage: React.FC = () => {
  return (
    <Canvas dpr={2} style={{
      width: '100%',
      height: '100vh'
    }}>
      <color attach="background" args={[0xf5f3fd]} />
      <OrbitControls makeDefault />
      <Stats />
      <ParticleScene />
    </Canvas>
  )
}

export default ParticlePage;
