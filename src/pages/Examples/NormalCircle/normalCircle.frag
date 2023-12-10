precision mediump float;
uniform float time;
uniform vec2 resolution;

uniform float x;
uniform float y;

float times = 2.0;

void main(void){
  // 中心（normal）
  // vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  // x,y指定
  vec2 p = (gl_FragCoord.xy * times - vec2(x * times, y * -times)) / min(resolution.x, resolution.y);
  // float f = length(p);
  float f = 0.01 / abs(length(p) - 0.5);
  gl_FragColor = vec4(vec3(f), 1.0);
}