import { useState, useCallback } from 'react'
import './App.css'

import { fetchImage } from '../packages/fetchFiles'

function App() {
  const [count, setCount] = useState(0)
  const onOpenFile = useCallback(async () => {
    // const { files } = await fetchImage()
    // console.log(files);
    try {
      const res = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${import.meta.env.VITE_GOOGLE_API_KEY}`)
    console.log(res);
    } catch(e) {
      console.error(e);
    }
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={onOpenFile}>
            open files
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
