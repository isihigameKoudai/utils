import Index from "../pages";
import Shader from '../pages/shader';
import ThreeDimension from "../pages/ThreeDimension";
import Shadows from '../pages/ThreeDimension/Shadows';
import ShaderPage from '../pages/ThreeDimension/Shader';
import ParticlePage from '../pages/ThreeDimension/Particle';
import AudioPage from "../pages/Audio";
import MicPage from "../pages/Audio/Mic";
import SpeechPage from "../pages/Audio/Speech";
import FivePointCirclePage from "../pages/Examples/FivePointCircle";
import NormalCirclePage from "../pages/Examples/NormalCircle";
import SquareSparkPage from "../pages/Examples/SquareSpark";
import AudioCirclePage from "../pages/Examples/AudioCircle";
import StableFluids from "../pages/StableFluids";
import PlaygroundPage from "../pages/Playground";
import Detector from "../pages/Examples/Detector";
import FluidDetect from "../pages/Examples/FluidDetect";
import FollowerCircle from '../pages/Examples/FollowerCircle';
import FbmNoisePage from "../pages/Noise/Fbm";
import FractalNoisePage from "../pages/Noise/Fractal";
import CellularNoisePage from "../pages/Noise/CellularNoise";
import MeltTheBorder from "../pages/MeltTheBorder";
import FaceLandmarkDetector from "../pages/Examples/FaceLandmarkDetector";
import ThemeDemo from "../pages/Examples/Theme";

export type IRoute = {
  title: string;
  path: string;
  element?: JSX.Element;
};

export const routeList: IRoute[] = [
  {
    title: "TOP",
    path: "/",
    element: <Index />,
  },
  {
    title: 'プレイグラウンド',
    path: 'playground',
    element: <PlaygroundPage />
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
  {
    title: 'stable fluids',
    path: '/stable-fluids',
    element: <StableFluids />
  },
  {
    title: 'サンプル',
    path: '/'
  },
  {
    title: '5スター',
    path: '/samples/5star-particle',
    element: <FivePointCirclePage />
  },
  {
    title: '円',
    path: '/samples/normal-circle',
    element: <NormalCirclePage />
  },
  {
    title: '円(オーディオ)',
    path: '/samples/audio-circle',
    element: <AudioCirclePage />
  },
  {
    title: '円（追尾）',
    path: '/samples/follower-circle',
    element: <FollowerCircle />
  },
  {
    title: 'キラキラ',
    path: '/samples/square-apark',
    element: <SquareSparkPage />
  },
  {
    title: 'ML',
    path: '/samples/detector',
    element: <Detector />
  },
  {
    title: 'ML（顔ランドマーク検出）',
    path: '/samples/face-landmark-detector',
    element: <FaceLandmarkDetector />
  },
  {
    title: 'fluid-detect',
    path: '/samples/fluid-detect',
    element: <FluidDetect />
  },
  {
    title: 'theme',
    path: '/samples/theme',
    element: <ThemeDemo />
  },
  {
    title: 'ノイズ',
    path: '/noise',
  },
  {
    title: 'fBMノイズ',
    path: '/noise/fbm',
    element: <FbmNoisePage />
  },
  {
    title: 'フラクタルノイズ',
    path: '/noise/fractal',
    element: <FractalNoisePage />
  },
  {
    title: 'セルラーノイズ',
    path: '/noise/cellular',
    element: <CellularNoisePage />
  },
  {
    title: 'Melt the border',
    path: '/melt-the-border',
    element: <MeltTheBorder />
  },
];
