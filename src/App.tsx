import { useState, useCallback } from 'react'
import './App.css'

import { fetchAudios, fetchFiles, fetchImages, fetchMovies } from '../packages/fetchFiles'

function App() {
  const [count, setCount] = useState(0)

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
