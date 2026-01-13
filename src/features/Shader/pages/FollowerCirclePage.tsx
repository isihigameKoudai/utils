import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import vertex from '@/utils/glsl/vertex.vert?raw';
import ShaderCanvas from '@/utils/ShaderCanvas';

import followerCircle from '../shaders/followerCircle.frag?raw';

const FollowerCirclePage: React.FC = () => {
  const uniforms = useMemo(
    () => ({
      time: {
        value: 0,
      },
      resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      x: {
        value: window.innerWidth / 2,
      },
      y: {
        value: -window.innerHeight / 2,
      },
    }),
    [],
  );

  /**
   * マウス操作から追従するフォロワーカーソルを計算する
   * TODO: あとでhooks化する
   */
  const followerRef = useRef({
    x: 0,
    y: 0,
  });
  const mouseRef = useRef({
    x: 0,
    y: 0,
  });
  const delay = 100;

  const init = () => {
    const follower = followerRef.current;
    const mouse = mouseRef.current;

    const mouseEvent = (e: MouseEvent) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      mouse.x = Math.floor(e.clientX - rect.left);
      mouse.y = Math.floor(e.screenY - rect.top);
    };
    document.addEventListener('mousemove', mouseEvent);

    const intervalTimer = setInterval(() => {
      // 汎用フォローカーソルの座標計算
      follower.x = (mouse.x + delay * follower.x) / (delay + 1);
      follower.y = (mouse.y + delay * follower.y) / (delay + 1);

      uniforms.x.value = follower.x;
      // y軸調整
      // uniforms.y.value = follower.y - window.innerHeight - 150;
      uniforms.y.value = follower.y;
    }, 10);

    return () => {
      document.removeEventListener('mousemove', mouseEvent);
      clearInterval(intervalTimer);
    };
  };
  useEffect(init, [uniforms]);

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
        fragmentShader={followerCircle}
      />
    </div>
  );
};

export default FollowerCirclePage;
