import React, { useEffect, useState, useCallback, useRef } from 'react';

import {
  type DetectedObject,
  VisualDetection,
} from '../../../../utils/tensorflow';
import VisualDetectionView from '../../../components/VisualDetectionView';
import { DETECTOR_OPACITY } from '../const';

type DetectorViewProps = {
  opacity?: number;
  onDetect?: (objects: DetectedObject[]) => void;
};
const DetectorView: React.FC<DetectorViewProps> = ({
  opacity = 1.0,
  onDetect = () => {},
}) => {
  const isInitRef = useRef(true);
  const detectorRef = useRef(new VisualDetection());
  const $videoContainer = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isShow, setIsShow] = useState(false);

  const handleDetect = useCallback(async () => {
    const detector = detectorRef.current;
    if (detector.$video && detector._$video && detector.model) {
      const video = detector.$video;
      video.style.position = 'absolute';
      video.style.top = '0px';
      video.style.left = '0px';
      video.style.opacity = `${DETECTOR_OPACITY}`;
      $videoContainer.current?.appendChild(video);
    }
    await detector.start((objectList) => {
      const objects = objectList.filter((obj) => obj.class === 'person');
      setObjects(objects);
      onDetect(objects);
    });
    setIsShow(false);
  }, [onDetect]);

  useEffect(() => {
    const detector = detectorRef.current;
    const init = async () => {
      if (isInitRef.current) {
        isInitRef.current = false;
        await detector.load({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        setIsShow(true);
      }
    };

    init();

    return () => {
      detector.stop();
    };
  }, []);

  return (
    <>
      {isShow && (
        <button type="button" onClick={handleDetect}>
          start detect
        </button>
      )}
      <VisualDetectionView
        ref={$videoContainer}
        objects={objects}
        opacity={opacity}
        showCenter
      />
    </>
  );
};

export default DetectorView;
