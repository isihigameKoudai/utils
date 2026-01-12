import { Canvas, type ThreeElements, useFrame } from '@react-three/fiber';
import React, { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';

const Box = (props: ThreeElements['mesh']) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y -= 0.01;
    }
  });

  const handleClick = useCallback(() => {
    setClicked(!clicked);
  }, [clicked]);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 2 : 1}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#ff0000' : '#0000ff'} />
    </mesh>
  );
};

const BoxPage: React.FC = () => {
  return (
    <div
      id="3D"
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <Canvas>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          // eslint-disable-next-line react/no-unknown-property
          position={[10, 10, 10]}
          // eslint-disable-next-line react/no-unknown-property
          angle={0.15}
          // eslint-disable-next-line react/no-unknown-property
          penumbra={1}
          // eslint-disable-next-line react/no-unknown-property
          decay={0}
          // eslint-disable-next-line react/no-unknown-property
          intensity={Math.PI}
        />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <pointLight position={[10, 10, 0]} decay={0} intensity={Math.PI} />
        <Box position={[-1, 0, 0]} />
        <Box position={[1, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default BoxPage;
