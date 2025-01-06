import { useEffect, useRef, useState } from 'react';
import { PoseDetection, Pose } from '../../../../packages/tensorflow';
import { PoseDetectionView } from '../../../components/PoseDetectionView';

const PoseDetectionPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [poses, setPose] = useState<Pose[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);  
  const [detector] = useState<PoseDetection>(() => new PoseDetection('BlazePose'));

  useEffect(() => {
    (async () => {
      await detector.load({
        $video: videoRef.current,
        width: 640,
        height: 480,
      });
      setIsLoaded(true);
    })();

    return () => {
      detector.stop();
    };
  }, [detector]);

  const handleStart = () => {
    setIsRunning(true);
    detector.start((detectedPoses: Pose[]) => {
      console.log(detectedPoses);
      setPose(detectedPoses);
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    detector.stop();
    setPose([]);
  };

  return (
    <div>
      <h1>Pose Detection</h1>
      <div style={{ marginBottom: '1rem' }}>
        {isLoaded && !isRunning && (
          <button onClick={handleStart}>Start Detection</button>
        )}
        {isRunning && (
          <button onClick={handleStop}>Stop Detection</button>
        )}
      </div>
      <PoseDetectionView 
        ref={videoRef}
        width={640} 
        height={480} 
        poses={poses}
      />
    </div>
  );
};

export default PoseDetectionPage;
