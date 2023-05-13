import React from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../../packages/ShaderCanvas';
import vertex from '../../../../packages/glsl/vertex.vert?raw';
import normalCircle from './normalCircle.frag?raw';

const NormalCirclePage: React.FC = () => {
  
  return <div id="3D" style={{
    width: '100%',
    height: '100svh'
  }}>
    <ShaderCanvas
      uniforms={{
        time: {
          value: 0
        },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        }
      }}
      vertexShader={vertex}
      fragmentShader={normalCircle}
    />
  </div>;
}

export default NormalCirclePage;
