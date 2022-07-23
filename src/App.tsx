import { useState, useCallback, useEffect, useMemo } from 'react'
import './App.css'

import { fetchAudios, fetchAudio, fetchFiles, fetchImages, fetchMovies } from '../packages/fetchFiles'
import Audio from '../packages/Audio';

function App() {
  const [audioInstance, _] = useState<Audio>(new Audio())

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
    audioInstance.setAudio(buffer);
  },[]);
  
  const onPlayAudio = useCallback(() => {
    audioInstance.play();
  },[]);

  const onStopAudio = useCallback(() => {
    audioInstance.stop();
  },[]);

  const onToggleAudio = useCallback(() => {
    audioInstance.pause()
    console.log(audioInstance.isPlaying);
  },[]);

  const isPlaying = useMemo(() => audioInstance.isPlaying,[audioInstance.isPlaying]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
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
            audio file
          </button>
          <button type='button' onClick={onPlayAudio}>
            play
          </button>
          <button type='button' onClick={onStopAudio}>
            stop
          </button>
          <button type='button' onClick={onToggleAudio}>
            {
              isPlaying ? 'pause' : 'play'
            }
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
