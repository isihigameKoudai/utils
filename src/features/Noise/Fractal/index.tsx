import React from 'react';
import * as THREE from 'three';

import vertex from '../../../../utils/glsl/vertex.vert?raw';
import ShaderCanvas from '../../../../utils/ShaderCanvas';

import fractal from './fractal.frag?raw';

const FractalNoisePage: React.FC = () => {
  const uniforms = {
    time: {
      value: 0,
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
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
        fragmentShader={fractal}
      />
    </div>
  );
};

export default FractalNoisePage;
