import React, { useMemo, useRef } from "react";
import * as THREE from 'three';
import { Canvas, useFrame } from "@react-three/fiber";

type Props = {
  uniforms: THREE.ShaderMaterialParameters['uniforms'];
  vertexShader: THREE.ShaderMaterialParameters['vertexShader'];
  fragmentShader: THREE.ShaderMaterialParameters['fragmentShader'];
};

const Scene: React.FC<Props> = ({ uniforms, vertexShader, fragmentShader }) => {
  const shaderMaterialArgs = useMemo(() =>(
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    })
  ),[]);
  const $shaderRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    shaderMaterialArgs.uniforms.time = { value: clock.getElapsedTime()}
  });
  
  return (
    <>
      <mesh ref={$shaderRef}>
        <perspectiveCamera args={[0, window.innerWidth / window.innerHeight, 0.1, 0]} />
        <planeBufferGeometry args={[2,2]} />
        <shaderMaterial uniforms={shaderMaterialArgs.uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </mesh>
    </>
  )
}

const ShaderCanvas: React.FC<Props> = (props) => {
  return (
    <Canvas
      shadows
      dpr={[1,1]}
    >
      <Scene {...props} />
    </Canvas>
  )
};

export default ShaderCanvas;
