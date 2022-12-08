interface ISpeechRecognitionEvent {
  isTrusted?: boolean;
  results: {
    isFinal: boolean;
    [key: number]:
      | undefined
      | {
          transcript: string;
        };
  }[];
}

interface ISpeechRecognition extends EventTarget {
  // properties
  grammars: string;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  // event handlers
  onaudiostart: () => void;
  onaudioend: () => void;
  onend: () => void;
  onerror: () => void;
  onnomatch: () => void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onsoundstart: () => void;
  onsoundend: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
  onstart: () => void;

  // methods
  abort(): void;
  start(): void;
  stop(): void;
}

interface ISpeechRecognition {
  new (): ISpeechRecognition;
}

//windowにISpeechRecognitionConstructorを定義にもつSpeechRecognitionとwebkitSpeechRecognitionを追加
interface IWindow extends Window {
  SpeechRecognition: ISpeechRecognition;
  webkitSpeechRecognition: ISpeechRecognition;
}

declare const window: IWindow;

const SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;

/**
 * Web上で音声認識・音声合成などをを司るクラス
 * https://developer.mozilla.org/ja/docs/Web/API/Web_Speech_API
 */
export default class Speech {
  recognition: ISpeechRecognition;
  constructor() {
    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    this.recognition = recognition;
  }

  setOnResult(onResult: (e: ISpeechRecognitionEvent) => void | Promise<void>) {
    this.recognition.onresult = onResult;
  }

  start() {
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }
}
