import { WebGL as BaseWebGL } from '@/src/shared/modules/fluids';
import { VisualDetection } from '@/utils/tensorflow';

type Props = {
  $wrapper: HTMLElement;
};

export default class WebGL extends BaseWebGL {
  $video: HTMLVideoElement | null;

  constructor({ $wrapper }: Props) {
    super({ $wrapper });
    this.$video = null;
  }

  async initDetector({
    width = window.innerWidth,
    height = window.innerHeight,
  }: {
    width?: number;
    height?: number;
  }) {
    const detector = new VisualDetection();
    await detector.load({ width, height });
    return detector;
  }
}
