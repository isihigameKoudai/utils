import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { RootLayout } from '../components/RootLayout'
import Index from "../pages"
import Shader from "../pages/shader"
import ThreeDimension from "../pages/ThreeDimension"
import Shadows from '../pages/ThreeDimension/Shadows'
import ShaderPage from '../pages/ThreeDimension/Shader'
import ParticlePage from '../pages/ThreeDimension/Particle'
import AudioPage from "../pages/Audio"
import MicPage from "../pages/Audio/Mic"
import SpeechPage from "../pages/Audio/Speech"
import FivePointCirclePage from "../pages/Examples/FivePointCircle"
import NormalCirclePage from "../pages/Examples/NormalCircle"
import SquareSparkPage from "../pages/Examples/SquareSpark"
import AudioCirclePage from "../pages/Examples/AudioCircle"
import StableFluids from "../pages/StableFluids"
import PlaygroundPage from "../pages/Playground"
import Detector from "../pages/Examples/Detector"
import FluidDetect from "../pages/Examples/FluidDetect"
import FollowerCircle from '../pages/Examples/FollowerCircle'
import FbmNoisePage from "../pages/Noise/Fbm"
import FractalNoisePage from "../pages/Noise/Fractal"
import CellularNoisePage from "../pages/Noise/CellularNoise"
import MeltTheBorder from "../pages/MeltTheBorder"
import FaceLandmarkDetector from "../pages/Examples/FaceLandmarkDetector"
import HandPoseDetectionPage from "../pages/Examples/HandPoseDetection"
import PoseDetectionPage from "../pages/Examples/PoseDetection"
import IStatePage from "../pages/Examples/IState"
import CryptoCharts from "../pages/CryptoCharts"
import MultiChartPage from "../pages/CryptoCharts/multi"

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})

const shaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shader',
  component: Shader,
})

const threeDimensionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension',
  component: ThreeDimension,
})

const shadowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/shadows',
  component: Shadows,
})

const threeDimensionShaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/shader',
  component: ShaderPage,
})

const particleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/particle',
  component: ParticlePage,
})

const audioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio',
  component: AudioPage,
})

const micRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio/mic',
  component: MicPage,
})

const speechRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio/speech',
  component: SpeechPage,
})

const fivePointCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/5star-particle',
  component: FivePointCirclePage,
})

const normalCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/normal-circle',
  component: NormalCirclePage,
})

const squareSparkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/square-apark',
  component: SquareSparkPage,
})

const audioCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/audio-circle',
  component: AudioCirclePage,
})

const stableFluidsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stable-fluids',
  component: StableFluids,
})

const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: PlaygroundPage,
})

const detectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/detector',
  component: Detector,
})

const fluidDetectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/fluid-detect',
  component: FluidDetect,
})

const followerCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/follower-circle',
  component: FollowerCircle,
})

const fbmNoiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/noise/fbm',
  component: FbmNoisePage,
})

const fractalNoiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/noise/fractal',
  component: FractalNoisePage,
})

const cellularNoiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/noise/cellular',
  component: CellularNoisePage,
})

const meltTheBorderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/melt-the-border',
  component: MeltTheBorder,
})

const faceLandmarkDetectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/face-landmark-detector',
  component: FaceLandmarkDetector,
})

const handPoseDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/hand-pose-detection',
  component: HandPoseDetectionPage,
})

const poseDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/pose-detection',
  component: PoseDetectionPage,
})

const iStateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/istate',
  component: IStatePage,
})

const cryptoChartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-charts',
  component: CryptoCharts,
})

const multiChartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-charts/multi/$token',
  component: MultiChartPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  shaderRoute,
  threeDimensionRoute,
  shadowsRoute,
  threeDimensionShaderRoute,
  particleRoute,
  audioRoute,
  micRoute,
  speechRoute,
  fivePointCircleRoute,
  normalCircleRoute,
  squareSparkRoute,
  audioCircleRoute,
  stableFluidsRoute,
  playgroundRoute,
  detectorRoute,
  fluidDetectRoute,
  followerCircleRoute,
  fbmNoiseRoute,
  fractalNoiseRoute,
  cellularNoiseRoute,
  meltTheBorderRoute,
  faceLandmarkDetectorRoute,
  handPoseDetectionRoute,
  poseDetectionRoute,
  iStateRoute,
  cryptoChartsRoute,
  multiChartRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 
