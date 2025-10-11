import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, type RenderCallback } from '@react-three/fiber';

type Props = {
  uniforms: THREE.ShaderMaterialParameters['uniforms'];
  vertexShader: THREE.ShaderMaterialParameters['vertexShader'];
  fragmentShader: THREE.ShaderMaterialParameters['fragmentShader'];
  requestFrame?: RenderCallback;
};

const Scene: React.FC<Props> = ({
  uniforms,
  vertexShader,
  fragmentShader,
  requestFrame = () => {},
}) => {
  const shaderMaterialArgs = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      }),
    [uniforms, vertexShader, fragmentShader],
  );
  const $shaderRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta, frame) => {
    // eslint-disable-next-line react-hooks/immutability
    shaderMaterialArgs.uniforms.time = { value: state.clock.getElapsedTime() };
    shaderMaterialArgs.uniforms.resolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );
    requestFrame(state, delta, frame);
  });

  return (
    <>
      <mesh ref={$shaderRef}>
        <perspectiveCamera
          // eslint-disable-next-line react/no-unknown-property
          args={[0, window.innerWidth / window.innerHeight, 0.1, 0]}
        />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          // eslint-disable-next-line react/no-unknown-property
          uniforms={shaderMaterialArgs.uniforms}
          // eslint-disable-next-line react/no-unknown-property
          vertexShader={vertexShader}
          // eslint-disable-next-line react/no-unknown-property
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
};

const ShaderCanvas: React.FC<Props> = (props) => {
  return (
    <Canvas
      shadows
      dpr={[1, 1]}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
};

export default ShaderCanvas;
