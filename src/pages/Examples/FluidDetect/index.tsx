import React, { useCallback, useEffect, useRef, useState } from "react";
import WebGL from "./modules/WebGL";
import { DetectedObject, VisualDetector } from "../../../../packages/tensorflow";
import Mouse from "./modules/Mouse";

export default function FluidDetect() {
  const $ref = useRef<HTMLDivElement>(null!);
  let isInit = true;
  const [gl, setGl] = useState<WebGL>();
  const [detectorInstance, setDetectorInstance] = useState<VisualDetector>()
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
      console.log(objects)
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
      <div ref={$ref} style={{
        position: 'relative'
      }}>
        {
          objects.map((obj,i) => {
            return (
              <>
                <p
                  style={{
                  position: 'absolute',
                  marginInlineStart: obj.left,
                  marginBlockStart: obj.top - 20,
                  width: obj.width,
                  top: 0,
                  left: 0,
                  background: '#cc0000aa'
                }}>{ `${obj.class} - with ${Math.round(parseFloat(obj.score.toString()) * 100)} % confidence.` }</p>
                <div
                  style={{
                  position: 'absolute',
                  left: obj.left,
                  top: obj.top,
                  width: obj.width,
                  height: obj.height,
                  background: '#00cc0044'
                }}></div>
              </>
            )
          })
        }
      </div>
    </div>
  )
}
