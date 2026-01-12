import React from 'react';
import * as THREE from 'three';

import ShaderCanvas from '@/utils/ShaderCanvas';
import vertex from '@/utils/glsl/vertex.vert?raw';
import roundRing from '@/utils/glsl/roundRing.frag?raw';

const ShaderPage: React.FC = () => {
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
        fragmentShader={roundRing}
      />
    </div>
  );
};

export default ShaderPage;
