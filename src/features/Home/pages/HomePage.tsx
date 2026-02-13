import React, { useCallback } from 'react';

import { fetchFiles } from '@/utils/file';

const HomePage: React.FC = () => {
  const onOpenFile = useCallback(async () => {
    const { files } = await fetchFiles();
    console.log('open files', files);
  }, []);

  const onOpenImages = useCallback(async () => {
    const { files } = await fetchFiles({ accept: 'image/*' });
    console.log('open images', files);
  }, []);

  const onOpenAudios = useCallback(async () => {
    const { files } = await fetchFiles({ accept: 'audio/*' });
    console.log('open audios', files);
  }, []);

  const onOpenMovies = useCallback(async () => {
    const { files } = await fetchFiles({ accept: 'video/*' });
    console.log('open movies', files);
  }, []);

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
  );
};

export default HomePage;
