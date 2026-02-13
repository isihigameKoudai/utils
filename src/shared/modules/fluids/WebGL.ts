import Common from './Common';
import Mouse from './Mouse';
import Output from './Output';

type Props = {
  $wrapper: HTMLElement;
};

export default class WebGL {
  $wrapper: HTMLElement;
  output: Output;

  constructor({ $wrapper }: Props) {
    this.$wrapper = $wrapper;
    Common.init();
    Mouse.init();

    this.$wrapper.prepend(Common.renderer!.domElement);
    this.output = new Output();
    this.loop();

    window.addEventListener('resize', this.resize.bind(this));
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
}
