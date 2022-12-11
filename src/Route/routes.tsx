import Index from "../pages";
import Shader from '../pages/shader';
import ThreeDimension from "../pages/ThreeDimension";
import Shadows from '../pages/ThreeDimension/Shadows';
import ShaderPage from '../pages/ThreeDimension/Shader';
import ParticlePage from '../pages/ThreeDimension/Particle';
import AudioPage from "../pages/Audio";
import MicPage from "../pages/Audio/Mic";
import SpeechPage from "../pages/Audio/Speech";

export type IRoute = {
  title: string;
  path: string;
  element: JSX.Element;
};

export const routeList: IRoute[] = [
  {
    title: "TOP",
    path: "/",
    element: <Index />,
  },
  {
    title: "Shader",
    path: "/shader",
    element: <Shader />,
  },
  {
    title: "オーディオ",
    path: "/audio",
    element: <AudioPage />,
  },
  {
    title: "オーディオ（マイク）",
    path: "/audio/mic",
    element: <MicPage />,
  },
  {
    title: "オーディオ（音声認識）",
    path: "/audio/speech",
    element: <SpeechPage />,
  },
  {
    title: "3D",
    path: "/three-dimension",
    element: <ThreeDimension />,
  },
  {
    title: "3D（影）",
    path: "/three-dimension/shadows",
    element: <Shadows />,
  },
  {
    title: "3D（シェーダー）",
    path: "/three-dimension/shader",
    element: <ShaderPage />,
  },
  {
    title: "3D（パーティクル）",
    path: "/three-dimension/particle",
    element: <ParticlePage />,
  },
];
