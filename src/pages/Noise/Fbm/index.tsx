import React from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../../packages/ShaderCanvas';
import vertex from '../../../../packages/glsl/vertex.vert?raw';
import fbm from './fbm.frag?raw';

const FbmNoisePage: React.FC = () => {
  const uniforms = {
    time: {
      value: 0
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
  };

  return <div id="3D" style={{
    width: '100%',
    height: '100svh'
  }}>
    <ShaderCanvas
      uniforms={uniforms}
      vertexShader={vertex}
      fragmentShader={fbm}
    />
  </div>;
}

export default FbmNoisePage;
