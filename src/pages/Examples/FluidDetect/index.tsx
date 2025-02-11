import React, { useCallback, useEffect, useRef, useState } from "react";
import WebGL from "./modules/WebGL";
import { DetectedObject, VisualDetection } from "../../../../utils/tensorflow";
import Mouse from "./modules/Mouse";
import VisualDetectionView from "../../../components/VisualDetectionView";

export default function FluidDetect() {
  const $ref = useRef<HTMLDivElement>(null!);
  let isInit = true;
  const [gl, setGl] = useState<WebGL>();
  const [detectorInstance, setDetectorInstance] = useState<VisualDetection>()
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isShow, setIsShow] = useState(true);

  const handleDetect = useCallback(async () => {
    if(detectorInstance?.$video && detectorInstance._$video) {
      detectorInstance.$video.style.position = 'absolute';
      detectorInstance.$video.style.top = '0px';
      detectorInstance.$video.style.left = '0px';
      detectorInstance.$video.style.opacity = '0.1';
      $ref.current.appendChild(detectorInstance?.$video);
    }
    await detectorInstance?.start((objectList) => {
      const objects = objectList
        .filter(obj => obj.class === 'person');
      objects.forEach(obj => {
        Mouse.setCoords(obj.center.x,obj.center.y);
      })
      setObjects(objects);
    });
    setIsShow(false);
  },[$ref, detectorInstance, gl]);

  useEffect(() => {
    (async () => {
      if (isInit) {
        const gl = new WebGL({
          $wrapper: $ref.current
        });
        setGl(gl);
        isInit = false;
        const detector = await gl.initDetector({
          width: window.innerWidth,
          height: window.innerHeight,
        });

        setDetectorInstance(detector);
      }
    })();

    return () => {
      detectorInstance?.stop();
    }
  },[]);

  return (
    <div>
      { isShow && <button type="button" onClick={handleDetect}>start detect</button>}
      <VisualDetectionView
        ref={$ref}
        objects={objects.filter(obj => obj.class === 'person')}
        opacity={0.4}
      />
    </div>
  )
}
