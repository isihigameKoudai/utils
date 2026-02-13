import React, { useCallback } from 'react';
import * as THREE from 'three';

import vertex from '@/utils/glsl/vertex.vert?raw';
import ShaderCanvas from '@/utils/ShaderCanvas';
import { Visualizer } from '@/utils/Visualizer';

import AudioCircle from '../shaders/audioCircle.frag?raw';

const AudioCirclePage: React.FC = () => {
  const ringVisualizer = new Visualizer();

  const uniforms = {
    time: {
      value: 0,
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    num: {
      value: 0.0,
    },
  };

  const handleStart = useCallback(async () => {
    await ringVisualizer.getAudioStream({ audio: true });
    ringVisualizer.start(({ spectrumArray }) => {
      const AUDIO_DRUMS = 512;
      const masteredNum = spectrumArray[AUDIO_DRUMS] / 512;
      // 512 ボーカル、ドラムなど
      uniforms.num.value = masteredNum;
    }, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleStop = useCallback(() => {
    ringVisualizer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button type="button" onClick={handleStart}>
        start
      </button>
      <button type="button" onClick={handleStop}>
        stop
      </button>
      <div
        style={{
          width: '100%',
          height: '100svh',
        }}
      >
        <ShaderCanvas
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={AudioCircle}
        />
      </div>
    </div>
  );
};

export default AudioCirclePage;
