import { forwardRef, useEffect, useRef } from 'react';
import { drawHands } from './drawHands';
import { Video } from '../Video';
import { HandPoseDetectionViewProps } from './type';

export const HandPoseDetectionView = forwardRef<HTMLVideoElement, HandPoseDetectionViewProps>(
  ({ width = 640, height = 480, hands }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!canvasRef.current) return;
      drawHands(canvasRef.current, hands);
    }, [hands]);

    return (
      <div style={{ position: 'relative', width, height }}>
        <Video ref={ref} width={width} height={height} />
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
  }
);

HandPoseDetectionView.displayName = 'HandPoseDetectionView'; 