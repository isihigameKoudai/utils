import React, { useCallback, useEffect, useRef, useState } from "react";
import { VisualDetector, DetectedObject } from "../../../../packages/tensorflow";

export default function Detector() {
  const detector = new VisualDetector();
  const $videoContainer = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleDetect = useCallback(() => {
    if(detector.$video && detector._$video) {
      $videoContainer.current?.appendChild(detector.$video);
    }
    detector.start((objects) => {
      setObjects(objects);
    });
  },[$videoContainer]);

  useEffect(() => {
    const init = async () => {
      await detector.load({ width: 640, height: 480 });
      setIsShow(true);
    }
    init();
  },[]);


  return (
    <div>
      { isShow && <button onClick={handleDetect}>start detect</button>}
      <div ref={$videoContainer} style={{
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
                  background: '#00cc0088'
                }}></div>
              </>
            )
          })
        }
      </div>
      {/* <video width={1280} height={960} muted autoPlay ref={$video}></video> */}
    </div>
  )
}
