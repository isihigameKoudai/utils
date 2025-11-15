import { useCallback, useEffect, useRef, useState } from 'react';
import WebGL from './modules/WebGL';
import {
  type DetectedObject,
  VisualDetection,
} from '../../../../utils/tensorflow';
import Mouse from './modules/Mouse';
import VisualDetectionView from '../../../components/VisualDetectionView';

export default function FluidDetect() {
  const $ref = useRef<HTMLDivElement>(null!);
  const isInitRef = useRef(true);
  const glRef = useRef<WebGL>(null!);
  const [detectorInstance, setDetectorInstance] = useState<VisualDetection>();
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isShow, setIsShow] = useState(true);

  const handleDetect = useCallback(async () => {
    if (!detectorInstance) return;

    // ビデオ要素の設定をuseEffectまたは別の場所で行う
    await detectorInstance.start((objectList) => {
      const objects = objectList.filter((obj) => obj.class === 'person');
      objects.forEach((obj) => {
        Mouse.setCoords(obj.center.x, obj.center.y);
      });
      setObjects(objects);
    });
    setIsShow(false);
  }, [detectorInstance]);

  // ビデオ要素のスタイル設定
  useEffect(() => {
    if (detectorInstance?.$video && detectorInstance._$video) {
      // DOM操作なので、stateの変更ではない
      /* eslint-disable react-hooks/immutability */
      const video = detectorInstance.$video;
      video.style.position = 'absolute';
      video.style.top = '0px';
      video.style.left = '0px';
      video.style.opacity = '0.1';
      /* eslint-enable react-hooks/immutability */
      if ($ref.current && !$ref.current.contains(video)) {
        $ref.current.appendChild(video);
      }
    }
  }, [detectorInstance]);

  useEffect(() => {
    let detector: VisualDetection | undefined;

    (async () => {
      if (isInitRef.current) {
        const gl = new WebGL({
          $wrapper: $ref.current,
        });
        glRef.current = gl;
        isInitRef.current = false;
        detector = await gl.initDetector({
          width: window.innerWidth,
          height: window.innerHeight,
        });

        setDetectorInstance(detector);
      }
    })();

    return () => {
      detector?.stop();
    };
  }, []);

  return (
    <div>
      {isShow && (
        <button type="button" onClick={handleDetect}>
          start detect
        </button>
      )}
      <VisualDetectionView
        ref={$ref}
        objects={objects.filter((obj) => obj.class === 'person')}
        opacity={0.4}
      />
    </div>
  );
}
