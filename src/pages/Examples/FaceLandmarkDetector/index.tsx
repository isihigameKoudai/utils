import React, { useCallback, useEffect, useRef, useState } from "react";

import { FaceLandmarkDetector } from "../../../../packages/tensorflow/FaceLandmarkDetector/FaceLandmarkDetector";
import FaceMesh, { Face } from "../../../components/FaceMesh";

export default function Detector() {
  const [isShow, setIsShow] = useState<boolean>(true);
  const detector = new FaceLandmarkDetector();
  const $video = useRef<HTMLVideoElement>(null!);
  const [faces, setFaces] = useState<Face[]>([]);
  const handleDetect = useCallback(async () => {
    await detector.start((faces) => {
      console.log(faces);
      setFaces(faces);
    });
  },[]);

  const handleStop = useCallback(() => {
    detector.stop();
  },[]);
  

  useEffect(() => {
    // モデルのロード
    (async () => {
      await detector.load({
        $video: $video.current
      });
      setIsShow(true);
    })();
  },[]);


  return (
    <div>
      { isShow && <button onClick={handleDetect}>start detect</button>}
      <button onClick={handleStop}>stop detect</button>
      <FaceMesh ref={$video} objects={faces} />
    </div>
  )
}
