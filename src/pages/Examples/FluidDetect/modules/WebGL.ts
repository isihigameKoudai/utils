import Common from "./Common";
import Output from "./Output";
import Mouse from "./Mouse";

import { VisualDetection } from "../../../../../utils/tensorflow";

type Props = {
  $wrapper: HTMLElement;
};
export default class WebGL {
  $wrapper: HTMLElement;
  output: Output;
  $video: HTMLVideoElement | null;

  constructor({ $wrapper }: Props) {
    this.$wrapper = $wrapper;
    Common.init();
    Mouse.init();
    // Mouse.onMoveByGhostAudio();
    this.$video = null;

    this.$wrapper.prepend(Common.renderer!.domElement);
    this.output = new Output();
    this.loop();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    Common.resize();
    this.output.resize();
  }

  render() {
    Mouse.update();
    Common.update();
    this.output.update();
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
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
