precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(void){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float cs;
  for(float i = 0.0; i < 3.0; i++) {
      float f = 0.01 / abs(length(p) - (0.5 * abs(sin(time + 0.5 * i))));
    cs = cs + f;
  }
  
  gl_FragColor = vec4(vec3(cs), 1.0);
}