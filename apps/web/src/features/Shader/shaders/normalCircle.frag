precision mediump float;
uniform float time;
uniform vec2 resolution;

uniform float x;
uniform float y;

float times = 2.0;

/**
* x, yを中心とした座標計算をする
* TODO: module化する
*/
vec2 center_by(float x, float y) {
  return (gl_FragCoord.xy * times - vec2(x, y)) / min(resolution.x, resolution.y);
}

void main(void){
  // 中心（normal）
  // x,y指定
  vec2 p = center_by(x * times, y * -times);
  // 円の太さ
  float bold = 0.01;
  float f = bold / abs(length(p) - 0.5);
  gl_FragColor = vec4(vec3(f), 1.0);
}
