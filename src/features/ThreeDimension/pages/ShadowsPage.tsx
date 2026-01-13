import { OrbitControls, useHelper } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { DoubleSide, Mesh, DirectionalLightHelper } from 'three';

const Content: React.FC = () => {
  const ref = useRef<Mesh>(null!);
  // 照明の補助線
  const lightRef = useRef(null!);
  useHelper(lightRef, DirectionalLightHelper);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    ref.current.rotation.x = a * 1;
    ref.current.rotation.y = a * 1;
    ref.current.rotation.z = a * 0;
  });

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <color attach="background" args={[0x222222]} />
      <OrbitControls />
      {/* <directionalLight ref={lightRef} position={[5,5,5]} intensity={1} shadowMapWidth={2048} shadowMapHeight={2048} castShadow /> */}

      {/* eslint-disable-next-line react/no-unknown-property */}
      <mesh ref={ref} position={[0, 2, 0]} receiveShadow castShadow>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="blue" />
      </mesh>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <mesh position={[1, 3, 2]} scale={0.5} castShadow receiveShadow>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="red" />
      </mesh>

      <mesh
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -0.5, 0]}
        // eslint-disable-next-line react/no-unknown-property
        rotation={[-Math.PI / 2, 0, 0]}
        // eslint-disable-next-line react/no-unknown-property
        receiveShadow
      >
        {/* eslint-disable-next-line react/no-unknown-property */}
        <boxGeometry args={[10, 10]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshPhongMaterial color="#e5e5e5" side={DoubleSide} />
      </mesh>
      {/* 補助グリッド戦 */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <gridHelper position={[0, 0.01, 0]} args={[10, 10, 'red', '#222']} />
    </>
  );
};

const ShadowsPage: React.FC = () => {
  return (
    <div
      id="3D"
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <Canvas
        camera={{
          fov: 50,
          position: [0, 3, 10],
        }}
        shadows
      >
        <Content />
      </Canvas>
    </div>
  );
};

export default ShadowsPage;
