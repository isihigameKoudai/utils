/**
 * https://codepen.io/FrankFitzGerald/pen/nrOwPL
 */
import React, { useEffect } from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../../packages/ShaderCanvas';
import vertex from '../../../../packages/glsl/vertex.vert?raw';
// import normalCircle from './normalCircle.frag?raw';

const SakuraPage: React.FC = () => {

  const uniforms = {
    time: {
      value: 0
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    num: {
      value: 0.0
    }
  };
  let isInit = false;

  useEffect(() => {
    if (isInit) {
      
      isInit = true;
    }
    return () => {
      isInit = false
    }
  },[]);
  
  return <div>
    <div style={{
    width: '100%',
    height: '100svh'
  }}>
    {/* <ShaderCanvas
      uniforms={uniforms}
      vertexShader={vertex}
      // fragmentShader={AudioCircle}
    /> */}
  </div>
  </div>;
}

export default SakuraPage;
