import React, { useEffect } from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../../packages/ShaderCanvas';
import vertex from '../../../../packages/glsl/vertex.vert?raw';
import normalCircle from './normalCircle.frag?raw';

// {
//   if (this.timer) clearTimeout(this.timer);
//   this.coords.set((x / Common.width!) * 2 - 1, -(y / Common.height!) * 2 + 1);
//   this.mouseMoved = true;
//   this.timer = setTimeout(() => {
//     this.mouseMoved = false;
//   }, 100);
// }

const NormalCirclePage: React.FC = () => {
  
  const uniforms = {
    time: {
      value: 0
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    x: {
      value: window.innerWidth
    },
    y: {
      value: window.innerHeight
    },
  };

  const follower = (x: number, y: number) => {

  }

  useEffect(() => {
    // document.addEventListener('mousemove', (e) => {
    //   console.log(e.pageY, e.clientY, e.screenY)
    //   uniforms.x.value = e.clientX;
    //   uniforms.y.value = e.screenY;
    // });
    document.addEventListener('mousemove', (e) => {

    
      uniforms.x.value = e.clientX;
      uniforms.y.value = e.screenY;

      // this.mouseMoved = true;
    });
  },[]);
  
  return <div id="3D" style={{
    width: '100%',
    height: '100svh'
  }}>
    <ShaderCanvas
      uniforms={uniforms}
      vertexShader={vertex}
      fragmentShader={normalCircle}
    />
  </div>;
}

export default NormalCirclePage;
