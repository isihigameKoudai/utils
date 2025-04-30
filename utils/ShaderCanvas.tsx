import React, { useMemo, useRef } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, RenderCallback } from "@react-three/fiber";

type Props = {
  uniforms: THREE.ShaderMaterialParameters['uniforms'];
  vertexShader: THREE.ShaderMaterialParameters['vertexShader'];
  fragmentShader: THREE.ShaderMaterialParameters['fragmentShader'];
  requestFrame?: RenderCallback;
};

const Scene: React.FC<Props> = ({ uniforms, vertexShader, fragmentShader, requestFrame = () => {} }) => {
  const shaderMaterialArgs = useMemo(() =>(
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    })
  ),[uniforms]);
  const $shaderRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state,delta,frame) => {
    shaderMaterialArgs.uniforms.time = { value: state.clock.getElapsedTime()}
    shaderMaterialArgs.uniforms.resolution.value.set(window.innerWidth,window.innerHeight)
    requestFrame(state, delta, frame)
  });
  
  return (
    <>
      <mesh ref={$shaderRef}>
        <perspectiveCamera args={[0, window.innerWidth / window.innerHeight, 0.1, 0]} />
        <planeGeometry args={[2,2]} />
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
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <Scene {...props} />
    </Canvas>
  )
};

export default ShaderCanvas;
