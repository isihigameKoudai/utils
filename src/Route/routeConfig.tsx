import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
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
import HandPoseDetectionPage from "../pages/Examples/HandPoseDetection";
import PoseDetectionPage from "../pages/Examples/PoseDetection";
import IStatePage from "../pages/Examples/IState";
import CryptoCharts from "../pages/CryptoCharts";
import MultiChartPage from "../pages/CryptoCharts/multi";
import { NavigationHeader } from "./NavigationLayout";
// ルート定義（メニュー用）
export type IRoute = {
  title: string;
  path: string;
  element?: JSX.Element;
  menuPath?: string;
};

export const routeList: IRoute[] = [
  {
    title: "TOP",
    path: "/",
    element: <Index />,
  },
  {
    title: 'プレイグラウンド',
    path: '/playground',
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
    title: 'ML（手のポーズ検出）',
    path: '/samples/hand-pose-detection',
    element: <HandPoseDetectionPage />
  },
  {
    title: 'ML（ポーズ検出）',
    path: '/samples/pose-detection',
    element: <PoseDetectionPage />
  },
  {
    title: 'fluid-detect',
    path: '/samples/fluid-detect',
    element: <FluidDetect />
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
  {
    title: 'IState',
    path: '/samples/istate',
    element: <IStatePage />
  },
  {
    title: 'CryptoCharts',
    path: '/crypto-charts',
    element: <CryptoCharts />
  },{
    title: 'MultiChart',
    path: '/crypto-charts/multi/:token',
    menuPath: '/crypto-charts/multi/BTC',
    element: <MultiChartPage />
  }
];

// TanStack Router設定
export const rootRoute = createRootRoute({
  component: () => (<>
    <Outlet />
    <NavigationHeader />
    </>),
});

// ルート定義を作成
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

export const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: PlaygroundPage,
});

export const shaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shader',
  component: Shader,
});

export const audioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio',
  component: AudioPage,
});

export const audioMicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio/mic',
  component: MicPage,
});

export const audioSpeechRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio/speech',
  component: SpeechPage,
});

export const threeDimensionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension',
  component: ThreeDimension,
});

export const shadowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/shadows',
  component: Shadows,
});

export const shaderPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/shader',
  component: ShaderPage,
});

export const particlePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/particle',
  component: ParticlePage,
});

export const stableFluidsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stable-fluids',
  component: StableFluids,
});

export const fivePointCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/5star-particle',
  component: FivePointCirclePage,
});

export const normalCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/normal-circle',
  component: NormalCirclePage,
});

export const audioCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/audio-circle',
  component: AudioCirclePage,
});

export const followerCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/follower-circle',
  component: FollowerCircle,
});

export const squareSparkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/square-apark',
  component: SquareSparkPage,
});

export const detectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/detector',
  component: Detector,
});

export const faceLandmarkDetectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/face-landmark-detector',
  component: FaceLandmarkDetector,
});

export const handPoseDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/hand-pose-detection',
  component: HandPoseDetectionPage,
});

export const poseDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/pose-detection',
  component: PoseDetectionPage,
});

export const fluidDetectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/fluid-detect',
  component: FluidDetect,
});

export const fbmNoiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/noise/fbm',
  component: FbmNoisePage,
});

export const fractalNoiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/noise/fractal',
  component: FractalNoisePage,
});

export const cellularNoiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/noise/cellular',
  component: CellularNoisePage,
});

export const meltTheBorderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/melt-the-border',
  component: MeltTheBorder,
});

export const iStateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/istate',
  component: IStatePage,
});

export const cryptoChartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-charts',
  component: CryptoCharts,
});

export const multiChartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-charts/multi/$token',
  component: MultiChartPage,
});

// ルーターを作成
export const routeTree = rootRoute.addChildren([
  indexRoute,
  playgroundRoute,
  shaderRoute,
  audioRoute,
  audioMicRoute,
  audioSpeechRoute,
  threeDimensionRoute,
  shadowsRoute,
  shaderPageRoute,
  particlePageRoute,
  stableFluidsRoute,
  fivePointCircleRoute,
  normalCircleRoute,
  audioCircleRoute,
  followerCircleRoute,
  squareSparkRoute,
  detectorRoute,
  faceLandmarkDetectorRoute,
  handPoseDetectionRoute,
  poseDetectionRoute,
  fluidDetectRoute,
  fbmNoiseRoute,
  fractalNoiseRoute,
  cellularNoiseRoute,
  meltTheBorderRoute,
  iStateRoute,
  cryptoChartsRoute,
  multiChartRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 
