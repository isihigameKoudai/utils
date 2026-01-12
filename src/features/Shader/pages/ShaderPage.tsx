import React, { useEffect, useRef } from 'react';

import Shader from '@/utils/Shader';

import * as THREE from 'three';
import vertex from '@/utils/glsl/vertex.vert?raw';
import roundRing from '@/utils/glsl/roundRing.frag?raw';

const ShaderPage: React.FC = () => {
  const $shader = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!$shader || $shader === null) return;

    new Shader({
      $target: $shader.current!,
      material: {
        uniforms: {
          time: {
            value: 0,
          },
          resolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
        },
      },
      vertexShader: vertex,
      fragmentShader: roundRing,
    });
  }, []);

  return <div id="shader" ref={$shader}></div>;
};

export default ShaderPage;
