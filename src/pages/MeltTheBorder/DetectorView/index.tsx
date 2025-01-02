import React, { useEffect, useState, useCallback, useRef, ComponentType } from 'react';

import { DetectedObject, VisualDetection } from '../../../../packages/tensorflow';
import VisualDetectionView from '../../../components/VisualDetectionView';
import { DETECTOR_OPACITY } from '../const';

type DetectorViewProps = {
  opacity?: number;
  onDetect?: (objects: DetectedObject[]) => void
}
const DetectorView: React.FC<DetectorViewProps> = ({ opacity = 1.0, onDetect = () => {} }) => {
  let isInit = true;
  const detector = new VisualDetection();
  const $videoContainer = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isShow, setIsShow] = useState(false);

  const handleDetect = useCallback(async () => {
    if(detector.$video && detector._$video && detector.model) {
      detector.$video.style.position = 'absolute';
      detector.$video.style.top = '0px';
      detector.$video.style.left = '0px';
      detector.$video.style.opacity = `${DETECTOR_OPACITY}`;
      $videoContainer.current?.appendChild(detector?.$video);
    }
    await detector.start((objectList) => {
      const objects = objectList
        .filter(obj => obj.class === 'person');
      setObjects(objects);
      onDetect(objects);
    });
    setIsShow(false);
  },[$videoContainer]);

  useEffect(() => {
    const init = async () => {
      if(isInit) {
        isInit = false;
        await detector.load({
          width: window.innerWidth,
          height: window.innerHeight
        });
        setIsShow(true);
      };
    }

    init();
    
    return () => {
      detector.stop();
    }
  }, []);

  return (
    <>
    { isShow && <button type="button" onClick={handleDetect}>start detect</button>}
      <VisualDetectionView
        ref={$videoContainer}
        objects={objects}
        opacity={opacity}
        showCenter
      />
    </>
  )
}

export default DetectorView;
