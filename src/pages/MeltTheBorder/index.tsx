import React from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../packages/ShaderCanvas';
import vertex from '../../../packages/glsl/vertex.vert?raw';
import fragment from './fragment.frag?raw';

const MeltTheBorder: React.FC = () => {
  const uniforms = {
    time: {
      value: 0
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    x: {
      value: window.innerWidth / 2
    },
    y: {
      value: -window.innerHeight / 2
    },
  };

  return <div id="3D" style={{
    width: '100%',
    height: '100svh'
  }}>
    <div>melt the border</div>
    <ShaderCanvas
      uniforms={uniforms}
      vertexShader={vertex}
      fragmentShader={fragment}
    />
  </div>;
}

export default MeltTheBorder;
