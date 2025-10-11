import React, { useCallback } from 'react';
import Speech from '../../../../utils/Speech';

const SpeechPage: React.FC = () => {
  const speech = new Speech();
  const onStartSpeech = useCallback(() => {
    speech.setOnResult((e) => {
      console.log(e, e.results[0][0]?.transcript);
    });
    speech.start();
  }, []);

  const onStopSpeech = useCallback(() => {
    speech.stop();
  }, []);

  return (
    <div className="audio-page">
      <p>
        <button type="button" onClick={onStartSpeech}>
          speech start
        </button>
        <button type="button" onClick={onStopSpeech}>
          speech end
        </button>
      </p>
    </div>
  );
};

export default SpeechPage;
