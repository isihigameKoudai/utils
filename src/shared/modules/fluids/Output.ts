import * as THREE from 'three';

import Common from './Common';
import color_frag from './glsl/sim/color.frag?raw';
import face_vert from './glsl/sim/face.vert?raw';
import Simulation from './Simulation';

export default class Output {
  simulation: Simulation;
  scene: THREE.Scene;
  camera: THREE.Camera;
  output: THREE.Mesh;

  constructor() {
    this.simulation = new Simulation();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();

    this.output = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        vertexShader: face_vert,
        fragmentShader: color_frag,
        uniforms: {
          velocity: {
            value: this.simulation.fbos.vel_0.texture,
          },
          boundarySpace: {
            value: new THREE.Vector2(),
          },
        },
      }),
    );

    this.scene.add(this.output);
  }

  addScene(mesh: THREE.Mesh) {
    this.scene.add(mesh);
  }

  resize() {
    this.simulation.resize();
  }

  render() {
    Common.renderer!.setRenderTarget(null);
    Common.renderer!.render(this.scene, this.camera);
  }

  update() {
    this.simulation.update();
    this.render();
  }
}
