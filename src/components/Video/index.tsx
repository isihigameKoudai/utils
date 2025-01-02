import { forwardRef } from 'react';

type VideoProps = {
  width?: number;
  height?: number;
};

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ width = 640, height = 480 }, ref) => {
    return (
      <video
        ref={ref}
        width={width}
        height={height}
        style={{
          transform: 'scaleX(-1)',
          WebkitTransform: 'scaleX(-1)',
          position: 'absolute',
        }}
      />
    );
  }
);

Video.displayName = 'Video'; 