import React, { useCallback, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

const Box = (props: ThreeElements['mesh']) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y -= 0.01;
  });

  const handleClick = useCallback(() => {
    setClicked(!clicked);
  },[clicked]);

  return (
    <mesh {...props} ref={ref} scale={clicked ? 2 : 1} onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color={hovered ? '#ff0000' : '#0000ff'} />
    </mesh>
  );
}

const ThreeDimension: React.FC = () => {
  return <div id="3D" style={{
    width: '100%',
    height: '100vh'
  }}>
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[10,10, 0]} />
      <Box position={[-1, 0, 0]} />
      <Box position={[1, 0, 0]}/>
    </Canvas>
  </div>;
}

export default ThreeDimension;
