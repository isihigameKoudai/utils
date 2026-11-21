import type React from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import roundRing from '@utils/modules/glsl/roundRing.frag?raw';
import vertex from '@utils/modules/glsl/vertex.vert?raw';
import Shader from '@utils/modules/Shader';

const ShaderPage: React.FC = () => {
	const $shader = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!$shader || $shader === null) return;

		if (!$shader.current) return;
		new Shader({
			$target: $shader.current,
			material: {
				uniforms: {
					time: {
						value: 0,
					},
					resolution: {
						value: new THREE.Vector2(window.innerWidth, window.innerHeight),
					},
				},
			},
			vertexShader: vertex,
			fragmentShader: roundRing,
		});
	}, []);

	return <div id="shader" ref={$shader}></div>;
};

export default ShaderPage;
