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

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Cubic Hermine Curve.（3次エルミート曲線）  Same as SmoothStep()
  vec2 u = f * f * (3.0 - 2.0 * f);
  // u = smoothstep(0.,1.,f);

  return mix(a, b, u.x) +
          (c - a)* u.y * (1.0 - u.x) +
          (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

// 非整数ブラウン運動（fBM） or フラクタルノイズ
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main(void){
  vec2 st = gl_FragCoord.xy/resolution.xy*5.;
  vec3 color = vec3(0.0);

  vec2 q = vec2(0.0);
  q.x = fbm( st + 0.01*time);
  q.y = fbm( st + vec2(1.0));
  vec2 r = vec2(0.0);
  r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time);
  r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

  float f = fbm(st+r);
  color = mix(
    vec3(0.0, 0.7137, 0.7804),
    vec3(1.0, 0.8941, 0.3647),
    clamp((f*f)*4.0,0.0,1.0)
  );

  color = mix(
    color,
    vec3(1.0, 1.0, 1.0),
    clamp(length(q),0.0,1.0)
  );

  color = mix(
    color,
    vec3(0.9804, 0.3843, 0.9804),
    clamp(length(r.x),0.0,1.0)
  );


  // 半径
  vec2 radius = center_by(x * times, y * -times);
  // 円の太さ
  float bold = abs(sin(time)) * 0.1;
  float circle = bold / abs(length(radius) - 0.5);
  // color = mix(color, vec3(circle), abs(sin(time)) * 0.5);
  color += vec3(circle);
  gl_FragColor = vec4(color, 1.0);
}
