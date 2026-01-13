import React from 'react';
import * as THREE from 'three';

import vertex from '@/utils/glsl/vertex.vert?raw';
import ShaderCanvas from '@/utils/ShaderCanvas';

import squareSpark from '../shaders/squareSpark.frag?raw';

const SquareSparkPage: React.FC = () => {
  return (
    <div
      id="3D"
      style={{
        width: '100%',
        height: '100svh',
      }}
    >
      <ShaderCanvas
        uniforms={{
          time: {
            value: 0,
          },
          resolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
        }}
        vertexShader={vertex}
        fragmentShader={squareSpark}
      />
    </div>
  );
};

export default SquareSparkPage;
