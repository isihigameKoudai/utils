import type * as THREE from 'three';

import face_vert from './glsl/sim/face.vert?raw';
import poisson_frag from './glsl/sim/poisson.frag?raw';
import ShaderPass from './ShaderPass';
import type { SimProps } from './types/Sim';

interface Props extends SimProps {
	boundarySpace: THREE.Vector2;
	dst_: THREE.WebGLRenderTarget;
	dst: THREE.WebGLRenderTarget;
	src: THREE.WebGLRenderTarget;
}
export default class Poisson extends ShaderPass {
	constructor(simProps: Props) {
		super({
			material: {
				vertexShader: face_vert,
				fragmentShader: poisson_frag,
				uniforms: {
					boundarySpace: {
						value: simProps.boundarySpace,
					},
					pressure: {
						value: simProps.dst_.texture,
					},
					divergence: {
						value: simProps.src.texture,
					},
					px: {
						value: simProps.cellScale,
					},
				},
			},
			output: simProps.dst,
			output0: simProps.dst_,
			output1: simProps.dst,
		});

		this.init();
	}

	updatePoisson({ iterations }: { iterations: number }) {
		// biome-ignore lint/style/noNonNullAssertion: initialized in init
		let p_in: THREE.WebGLRenderTarget = this.props.output0!;
		// biome-ignore lint/style/noNonNullAssertion: initialized in init
		let p_out: THREE.WebGLRenderTarget = this.props.output1!;

		for (let i = 0; i < iterations; i++) {
			const isOdd = i % 2 === 0;

			// biome-ignore lint/style/noNonNullAssertion: intentional
			p_in = isOdd ? this.props.output0! : this.props.output1!;
			// biome-ignore lint/style/noNonNullAssertion: intentional
			p_out = isOdd ? this.props.output1! : this.props.output0!;

			if (this.uniforms) this.uniforms.pressure.value = p_in.texture;
			this.props.output = p_out;
			super.update();
		}

		return p_out;
	}
}
