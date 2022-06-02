import * as THREE from "three";

type Props = {
  $target: HTMLElement;
  material: THREE.ShaderMaterialParameters;
  vertexShader: string;
  fragmentShader: string;
};

/**
 * How to use
 *
 * *****************************************************************************
 * npm i three
 * npm i -D @types/three
 * *****************************************************************************
 *
 * import Shader from "...";
 * import fragment from './glsl/fragment.frag?raw';
 * import vertex from './glsl/vertex.vert?raw';
 *
 * new Shader({
 *  uniforms: {
 *   time: { value: 0.0 },
 *    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
 *    vertexShader: vertex,
 *    fragmentShader: fragment,
 * });
 */
class Shader {
  scene: THREE.Scene;
  material: THREE.ShaderMaterial;
  renderer: THREE.WebGLRenderer;
  geometry: THREE.PlaneBufferGeometry;
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh;
  clock: THREE.Clock;
  constructor(props: Props) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.material = new THREE.ShaderMaterial({
      uniforms: props.material.uniforms,
      vertexShader: props.vertexShader,
      fragmentShader: props.fragmentShader,
    });
    props.$target.appendChild(this.renderer.domElement);
    this.geometry = new THREE.PlaneBufferGeometry(2.0, 2.0);
    this.camera = new THREE.PerspectiveCamera(
      0,
      window.innerWidth / window.innerHeight,
      0.1,
      0
    );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.clock = new THREE.Clock();

    this.init();
    this.loop();
  }

  init() {
    this.scene.add(this.mesh);
    this.clock.start();

    window.addEventListener("resize", this.resize.bind(this));
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    this.mesh.material.uniforms!.time.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mesh.material.uniforms!.resolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
  }
}

export default Shader;
