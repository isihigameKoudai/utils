import * as THREE from 'three';
import Common from './Common';

export type Uniforms = THREE.ShaderMaterialParameters['uniforms'];

export type ShaderPassProps = {
  material?: THREE.ShaderMaterialParameters;
  output?: THREE.WebGLRenderTarget;
  output0?: THREE.WebGLRenderTarget;
  output1?: THREE.WebGLRenderTarget;
};

export default class ShaderPass {
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  material?: THREE.RawShaderMaterial;
  geometry?: THREE.BufferGeometry;
  plane?: THREE.Mesh;
  props: ShaderPassProps;
  uniforms: THREE.ShaderMaterialParameters['uniforms'];

  constructor(props: ShaderPassProps) {
    this.props = props;
    this.uniforms = this.props.material?.uniforms;
  }

  init() {
    this.scene = new THREE.Scene();
    // this.camera = new THREE.Camera();
    this.camera = new THREE.PerspectiveCamera();

    if (this.uniforms) {
      this.material = new THREE.RawShaderMaterial(this.props.material);
      // this.geometry = new THREE.PlaneBufferGeometry(2.0, 2.0);
      this.geometry = new THREE.PlaneGeometry(2.0, 2.0);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
    }
  }

  update() {
    Common.renderer?.setRenderTarget(this.props.output!);
    Common.renderer?.render(this.scene!, this.camera!);
    Common.renderer?.setRenderTarget(null);
  }
}
