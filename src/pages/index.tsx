import React, { useCallback } from 'react';

import { fetchAudios, fetchFiles, fetchImages, fetchMovies } from '../../utils/fetchFiles'

const Index: React.FC = () => {
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
    </div>
  )
};

export default Index;
