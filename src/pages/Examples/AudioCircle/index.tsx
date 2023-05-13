import React, { useCallback, useRef } from 'react';
import * as THREE from 'three';

import ShaderCanvas from '../../../../packages/ShaderCanvas';
import vertex from '../../../../packages/glsl/vertex.vert?raw';
import AudioCircle from './AudioCircle.frag?raw';
import Visualizer from '../../../../packages/Visualizer';
import { average } from '../../../../packages/math';
import { splitMap } from '../../../../packages/array';

const flatSums = (arr:number[], lengthPerArr: number) => splitMap(arr,lengthPerArr).map(items => average(items));

const AudioCirclePage: React.FC = () => {
  const ringVisualizer = new Visualizer();

  const uniforms = {
    time: {
      value: 0
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    num: {
      value: 0.0
    }
  };

  const handleStart = useCallback(async () => {
    await ringVisualizer.setDeviceAudio({ audio: true });
    ringVisualizer.start(({ spectrumArray }) => {
      const av = flatSums([...spectrumArray], 100);
      console.log(av);
      const AUDIO_DRUMS = 512;
      const masteredNum = spectrumArray[AUDIO_DRUMS] / 512;
      // 512 ボーカル、ドラムなど
      uniforms.num.value = masteredNum;
    },{})
  },[]);
  const handleStop = useCallback(() => {
    ringVisualizer.stop();
  },[]);

  return <div>
    <button type='button' onClick={handleStart}>start</button>
    <button type='button' onClick={handleStop}>stop</button>
    <div style={{
    width: '100%',
    height: '100svh'
  }}>
    <ShaderCanvas
      uniforms={uniforms}
      vertexShader={vertex}
      fragmentShader={AudioCircle}
    />
  </div>
  </div>;
}

export default AudioCirclePage;
