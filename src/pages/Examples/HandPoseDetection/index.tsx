import { useEffect, useRef, useState } from 'react';
import { Hand } from '../../../components/HandPoseDetectionView/type';
import { HandPoseDetection } from '../../../../utils/tensorflow/HandPoseDetection';
import { HandPoseDetectionView } from '../../../components/HandPoseDetectionView';

const HandPoseDetectionPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [hands, setHands] = useState<Hand[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [detector] = useState<HandPoseDetection>(() => new HandPoseDetection());

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
    detector.start((detectedHands: Hand[]) => {
      setHands(detectedHands);
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    detector.stop();
    setHands([]);
  };

  return (
    <div>
      <h1>Hand Pose Detection</h1>
      <div style={{ marginBottom: '1rem' }}>
        {isLoaded && !isRunning && (
          <button onClick={handleStart}>Start Detection</button>
        )}
        {isRunning && <button onClick={handleStop}>Stop Detection</button>}
      </div>
      <HandPoseDetectionView
        ref={videoRef}
        width={640}
        height={480}
        hands={hands}
      />
    </div>
  );
};

export default HandPoseDetectionPage;
