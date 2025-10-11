import React, { forwardRef, useEffect, useRef } from 'react';

import type { Face } from './type';
import { drawMesh } from './drawMesh';

interface Props {
  objects: Face[];
}

const FaceMesh = forwardRef<HTMLVideoElement, Props>(({ objects }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !ref || !('current' in ref) || !ref.current)
      return;

    const video = ref.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // キャンバスのサイズをビデオに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 検出された顔それぞれに対してメッシュを描画
    objects.forEach((face) => {
      drawMesh(ctx, face);
    });
  }, [objects, ref]);

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={ref}
        width={640}
        height={480}
        style={{ position: 'absolute' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
});

FaceMesh.displayName = 'FaceMesh';

export default FaceMesh;
