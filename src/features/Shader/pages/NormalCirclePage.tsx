import React from 'react';
import * as THREE from 'three';

import ShaderCanvas from '@/utils/ShaderCanvas';
import vertex from '@/utils/glsl/vertex.vert?raw';
import normalCircle from '../shaders/normalCircle.frag?raw';

const NormalCirclePage: React.FC = () => {
  const uniforms = {
    time: {
      value: 0,
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    x: {
      value: window.innerWidth / 2,
    },
    y: {
      value: -window.innerHeight / 2,
    },
  };

  return (
    <div
      id="3D"
      style={{
        width: '100%',
        height: '100svh',
      }}
    >
      <ShaderCanvas
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={normalCircle}
      />
    </div>
  );
};

export default NormalCirclePage;
