import { useCallback, useEffect, useRef, useState } from 'react';

import { FaceLandmarkDetection } from '@/utils/tensorflow';
import FaceMesh, { type Face } from '../components/FaceMesh';

export default function FaceLandmarkDetectorPage() {
  const [isShow, setIsShow] = useState<boolean>(true);
  const detectorRef = useRef(new FaceLandmarkDetection());
  const $video = useRef<HTMLVideoElement>(null!);
  const [faces, setFaces] = useState<Face[]>([]);

  const handleDetect = useCallback(async () => {
    await detectorRef.current.start((faces) => {
      setFaces(faces);
    });
  }, []);

  const handleStop = useCallback(() => {
    detectorRef.current.stop();
  }, []);

  useEffect(() => {
    // モデルのロード
    const detector = detectorRef.current;
    (async () => {
      await detector.load({
        $video: $video.current,
      });
      setIsShow(true);
    })();
  }, []);

  return (
    <div>
      {isShow && <button onClick={handleDetect}>start detect</button>}
      <button onClick={handleStop}>stop detect</button>
      <FaceMesh ref={$video} objects={faces} />
    </div>
  );
}
