import * as THREE from "three";
import Common from "./Common";
// import Visualizer from "../../../../utils/Visualizer";

export class Mouse {
  mouseMoved: boolean;
  coords: THREE.Vector2;
  coords_old: THREE.Vector2;
  diff: THREE.Vector2;
  timer: NodeJS.Timeout | null;
  count: number;

  constructor() {
    this.mouseMoved = false;
    this.coords = new THREE.Vector2();
    this.coords_old = new THREE.Vector2();
    this.diff = new THREE.Vector2();
    this.timer = null;
    this.count = 0;
  }

  init() {
    document.body.addEventListener(
      "mousemove",
      this.onDocumentMouseMove.bind(this),
      false
    );
    document.body.addEventListener(
      "touchstart",
      this.onDocumentTouchStart.bind(this),
      false
    );
    document.body.addEventListener(
      "touchmove",
      this.onDocumentTouchMove.bind(this),
      false
    );
  }

  setCoords(x: number, y: number) {
    if (this.timer) clearTimeout(this.timer);
    this.coords.set((x / Common.width!) * 2 - 1, -(y / Common.height!) * 2 + 1);
    this.mouseMoved = true;
    this.timer = setTimeout(() => {
      this.mouseMoved = false;
    }, 100);
  }
  onDocumentMouseMove(event: MouseEvent) {
    this.setCoords(event.clientX, event.clientY);
  }
  onDocumentTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      // event.preventDefault();
      this.setCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  }
  onDocumentTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      // event.preventDefault();

      this.setCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  }

  update() {
    this.diff.subVectors(this.coords, this.coords_old);
    this.coords_old.copy(this.coords);

    if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
  }

  /**
   * custom move
   */
  // onMoveGhost() {
  //   let i = 0;
  //   setInterval(() => {
  //     i = i + 0.07;
  //     const radius = 300 + Math.sin(i) * 100; // 円の半径
  //     const centerX = window.innerWidth / 2; // 画面の中心X座標
  //     const centerY = window.innerHeight / 2; // 画面の中心Y座標
  //     const angle = Date.now() / 500; // 現在時刻を秒単位に変換した値を角度として使用

  //     const x = centerX + radius * Math.cos(angle);
  //     const y = centerY + radius * Math.sin(angle);
  //     this.setCoords(x, y);
  //   }, 16);
  // }

  /**
   * custom move by audio
   */

  // async onMoveByGhostAudio() {
  //   let r = 0;

  //   const visualizer = new Visualizer();
  //   await visualizer.setDeviceAudio({
  //     audio: true,
  //     video: false,
  //   });

  //   visualizer.start(
  //     ({ spectrumArray }) => {
  //       r =
  //         spectrumArray.reduce((a, i) => a + i) / (128 * spectrumArray.length);
  //     },
  //     { fftSize: 128 }
  //   );

  //   setInterval(() => {
  //     // i = i + 0.07;
  //     console.log(r);
  //     const radius = 100 + Math.sin(r) * 800; // 円の半径
  //     const centerX = window.innerWidth / 2; // 画面の中心X座標
  //     const centerY = window.innerHeight / 2; // 画面の中心Y座標
  //     const angle = Date.now() / 500; // 現在時刻を秒単位に変換した値を角度として使用
  //     const x = centerX + radius * Math.cos(angle);
  //     const y = centerY + radius * Math.sin(angle);
  //     this.setCoords(x, y);
  //   }, 16);
  // }
}

export default new Mouse();
