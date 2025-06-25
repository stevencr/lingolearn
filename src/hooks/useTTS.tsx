import {useEffect, useState} from 'react';
import TTS from 'react-native-tts';

type TTSStatus = 'playing' | 'stopped';

interface UseTTSOptions {
  defaultLanguage: string;
}

const useTTS = ({
  defaultLanguage,
}: UseTTSOptions): {
  isPlaying: boolean;
  ttsStatus: TTSStatus;
  onStart: (text: string) => void;
  onStop: () => void;
} => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsStatus, setTTSStatus] = useState<TTSStatus>('stopped');

  useEffect(() => {
    TTS.setDefaultLanguage(defaultLanguage);

    const onStart = () => {
      setIsPlaying(true);
      setTTSStatus('playing');
    };

    const onStop = () => {
      setIsPlaying(false);
      setTTSStatus('stopped');
    };

    TTS.addEventListener('tts-start', onStart);
    TTS.addEventListener('tts-finish', onStop);
    TTS.addEventListener('tts-cancel', onStop);

    return () => {
      TTS.removeAllListeners('tts-start');
      TTS.removeAllListeners('tts-finish');
      TTS.removeAllListeners('tts-cancel');
    };
  }, [defaultLanguage]);

  const speak = (phrase: string) => {
    TTS.getInitStatus().then(() => {
      TTS.speak(phrase);
    });
  };

  return {isPlaying, ttsStatus, onStart: speak, onStop: () => TTS.stop()};
};

export default useTTS;
