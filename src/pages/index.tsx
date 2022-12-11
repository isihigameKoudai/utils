import React, { useCallback, useRef } from 'react';

import { fetchAudios, fetchAudio, fetchFiles, fetchImages, fetchMovies } from '../../packages/fetchFiles'
import Visualizer from '../../packages/Visualizer';
import Speech from '../../packages/Speech';

const Index: React.FC = () => {
  const visualizer = new Visualizer();
  const micVisualizer = new Visualizer();
  const $canvas = useRef<HTMLCanvasElement>(null);
  const speech = new Speech();

  const onOpenFile = useCallback(async () => {
    const files = await fetchFiles()
    console.log(files);
  },[])

  const onOpenImages = useCallback(async () => {
    const { files } = await fetchImages();
    console.log('orpn images',files);
  },[]);

  const onOpenAudios = useCallback(async () => {
    const { files } = await fetchAudios()
    console.log('open audios', files);
  },[]);

  const onOpenMovies = useCallback(async () => {
    const { files } = await fetchMovies()
    console.log('open movies', files);
  },[]);

  const onOpenAudio = useCallback(async () => {
    const { files } = await fetchAudio()
    const buffer = await files[0].arrayBuffer()
    visualizer.setAudio(buffer);
  },[]);
  
  const onPlayAudio = useCallback(() => {
    visualizer.start(({ $canvas, times, frequencyBinCount}) => {
      console.log(times.reduce((acc, cur) => acc + cur));
      const $gl = $canvas.getContext('2d')
      console.log($gl);
      
      const cw = window.innerWidth;
    const ch = window.innerHeight;
    const barWidth = cw / frequencyBinCount;

    $gl!.fillStyle = "rgba(0, 0, 0, 1)";
    $gl!.fillRect(0, 0, cw, ch);

    // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
    for (let i = 0; i < frequencyBinCount; ++i) {
      const value = times[i]; // 波形データ 0 ~ 255までの数値が格納されている。
      const percent = value / 255; // 255が最大値なので波形データの%が算出できる。
      const height = ch * percent; // %に基づく高さを算出
      const offset = ch - height; // y座標の描画開始位置を算出

      $gl!.fillStyle = "#fff";
      $gl!.fillRect(i * barWidth, offset, barWidth, 2);
    }
    },{
      $canvas: $canvas.current!
    });
  },[]);

  const onStopAudio = useCallback(() => {
    visualizer.stop();
  },[]);

  const onActivateMic = useCallback(async () => {
    await micVisualizer.setDeviceAudio({ audio: true });
    micVisualizer.start(({ $canvas, times, frequencyBinCount}) => {
      console.log(times.reduce((acc, cur) => acc + cur));
      const $gl = $canvas.getContext('2d')
      console.log($gl);
      
      const cw = window.innerWidth;
    const ch = window.innerHeight;
    const barWidth = cw / frequencyBinCount;

    $gl!.fillStyle = "rgba(0, 0, 0, 1)";
    $gl!.fillRect(0, 0, cw, ch);

    // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
    for (let i = 0; i < frequencyBinCount; ++i) {
      const value = times[i]; // 波形データ 0 ~ 255までの数値が格納されている。
      const percent = value / 255; // 255が最大値なので波形データの%が算出できる。
      const height = ch * percent; // %に基づく高さを算出
      const offset = ch - height; // y座標の描画開始位置を算出

      $gl!.fillStyle = "#fff";
      $gl!.fillRect(i * barWidth, offset, barWidth, 2);
    }
    },{
      $canvas: $canvas.current!
    })
  },[]);

  const onStopDeviceAudio = useCallback(() => {
    micVisualizer.stopDeviceAudio()
  },[]);

  const onStartSpeech = useCallback(() => {
    speech.setOnResult((e) => {
      console.log(e.results[0][0]?.transcript);
    });
    speech.start();
  },[]);

  const onStopSpeech = useCallback(() => {
    speech.stop();
  },[]);

  return (
    <div id="index-page">
      <p>
        <button type="button" onClick={onOpenFile}>
          open files
        </button>
        <button type="button" onClick={onOpenImages}>
          image files
        </button>
        <button type="button" onClick={onOpenMovies}>
          video files
        </button>
        <button type="button" onClick={onOpenAudios}>
          audio files
        </button>
      </p>
      <p>
        <button type='button' onClick={onOpenAudio}>
          audio file vis
        </button>
        <button type='button' onClick={onPlayAudio}>
          play vis
        </button>
        <button type='button' onClick={onStopAudio}>
          stop vis
        </button>
      </p>
      <p>
        <button type='button' onClick={onActivateMic}>
          activate mic
        </button>
        <button type='button' onClick={onStopDeviceAudio}>
          stop mic
        </button>
      </p>
      <p>
        <button type='button' onClick={onStartSpeech}>
          speech start
        </button>
        <button type='button' onClick={onStopSpeech}>
          speech end
        </button>
      </p>
      <canvas id="canvas" ref={$canvas}></canvas>
    </div>
  )
};

export default Index;
