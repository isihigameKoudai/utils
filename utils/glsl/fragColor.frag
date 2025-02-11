precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  float w = gl_FragCoord.x / resolution.x;
	// float y = gl_FragCoord.y / resolution.y;
  // float w = resolution.x / 255.0;
	// float y = 1.0 / gl_FragCoord.y;
  gl_FragColor = vec4(vec3(w, 0, 0), 1.0);
}