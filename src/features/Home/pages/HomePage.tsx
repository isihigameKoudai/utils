import { Link } from '@tanstack/react-router';
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
      <h1>Utils Playground</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>AI Features</h2>
        <p>
          <Link to="/gemini-embedding">
            <button type="button">Gemini Embedding 2 Playground</button>
          </Link>
        </p>
      </section>

      <section>
        <h2>File Utils</h2>
        <p>
          <button type="button" onClick={() => void onOpenFile()}>
            open files
          </button>
          <button type="button" onClick={() => void onOpenImages()}>
            image files
          </button>
          <button type="button" onClick={() => void onOpenMovies()}>
            video files
          </button>
          <button type="button" onClick={() => void onOpenAudios()}>
            audio files
          </button>
        </p>
      </section>
    </div>
  );
};

export default HomePage;
