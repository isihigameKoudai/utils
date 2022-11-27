import React, { useRef, useState } from "react";
import * as THREE from 'three';
import { Canvas, useFrame } from "@react-three/fiber";

type Props = {
  uniforms: THREE.ShaderMaterialParameters['uniforms'];
  vertexShader: string;
  fragmentShader: string;
};

const Scene: React.FC<Props> = ({ uniforms, vertexShader, fragmentShader }) => {
  // TODO: リングに位置がpages/shader/indexと異なるので直す
  const [shaderMaterial, _] = useState(new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  }))
  const $shaderRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    shaderMaterial.uniforms.time = { value: clock.getElapsedTime()}
  });
  
  return (
    <>
      <mesh ref={$shaderRef}>
      <perspectiveCamera args={[0, window.innerWidth / window.innerHeight, 0.1, 0]} />
        <planeBufferGeometry args={[2,2]} />
        <shaderMaterial uniforms={shaderMaterial.uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </mesh>
    </>
  )
}

const ShaderCanvas: React.FC<Props> = (props) => {
  return (
    <Canvas
      shadows
    >
      <Scene {...props} />
    </Canvas>
  )
};

export default ShaderCanvas;
