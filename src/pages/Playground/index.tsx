import React from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../packages/ShaderCanvas';
import vertex from '../../../packages/glsl/vertex.vert?raw';
import fragment from './glsl/fragment.frag?raw';

const PlaygroundPage: React.FC = () => {
  
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
      fragmentShader={fragment}
    />
  </div>;
}

export default PlaygroundPage;
