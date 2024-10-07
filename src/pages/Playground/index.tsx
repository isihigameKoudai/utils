import React, { useEffect, useRef, useState } from 'react';
import { FaceDetector } from '../../../packages/tensorflow/FaceDetector';

const PlaygroundPage: React.FC = () => {
  const detector = new FaceDetector();
  
  const $video = useRef<HTMLVideoElement>(null);
  const $face = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number; name: string}[]>([]);

  // 受け取った認識情報を元に顔にインジケーターを当てる
  const setFace = (face: FaceDetector['_detectedFaces'][number]) => {
    if (!$face.current) {
      return;
    }
    console.log('width', face.box.width, 'height', face.box.height);
    const { yMin, xMin, width, height} = face.box;
    const faceElement = $face.current;
    faceElement.style.top = `${yMin}px`;
    faceElement.style.left = `${xMin}px`;
    faceElement.style.width = `${width}px`;
    faceElement.style.height = `${height}px`;
    const { keypoints } = face;
    setPoints(keypoints.map(point => ({
      x: point.x,
      y: point.y,
      name: point.name || ''
    })));
  } 

  const activate = async () => {
    if (!$video.current) {
      return;
    }
    await detector.load({
      $video: $video.current,
    });
  }

  const handleActive = async () => {
    activate();
  }

  const handleStart = async () => {
    detector.start((faces) => {
      // 今回は1人だけ対象
      if (faces.length > 0) {
        setFace(faces[0]);
      }
    });
  }

  return (
    <div>
      <button onClick={handleActive}>load</button>
      <button onClick={handleStart}>start</button>
      <div style={{
        width: '640px',
        height: '480px',
        position: 'relative',
      }}>
        <video
          ref={$video}
          id="video"
          width="640"
          height="480"
          muted
        ></video>
        <div className='face-area' ref={$face} style={{
          position: 'absolute',
          background: 'transparent',
          border: 'solid 2px #ff2b2b',
          pointerEvents: 'none'
        }}></div>
        {
          points.map(point => {
            console.log(point)
            return <div className={point.name} style={{
              position: 'absolute',
              width: 4,
              height: 4,
              top: point.y - 2,
              left: point.x - 2,
              background: '#ccc'
            }} />
          })
        }
      </div>
    </div>
  );
}

export default PlaygroundPage;
