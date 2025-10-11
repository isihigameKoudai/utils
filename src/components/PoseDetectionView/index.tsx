import { forwardRef, useEffect, useRef } from 'react';

import { Video } from '../../components/Video';
import { drawPose } from './drawPose';

import { PoseDetectionViewProps } from './type';

export const PoseDetectionView = forwardRef<
  HTMLVideoElement,
  PoseDetectionViewProps
>(({ width = 640, height = 480, poses }, videoRef) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (() => {
      if (
        !videoRef ||
        !('current' in videoRef) ||
        !videoRef.current ||
        !canvasRef.current
      )
        return;

      drawPose(canvasRef.current, poses);
    })();
  }, [poses]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Video ref={videoRef} width={width} height={height} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          transform: 'scaleX(-1)',
          WebkitTransform: 'scaleX(-1)',
          position: 'absolute',
        }}
      />
    </div>
  );
});

PoseDetectionView.displayName = 'PoseDetectionView';
