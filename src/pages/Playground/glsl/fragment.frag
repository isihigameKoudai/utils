precision mediump float;
uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359


// float plot(vec2 st, float pct){
//   return  smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
// }
// draw strait line
float plotStraitLine(vec2 st) {    
  return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

// draw exponential line
float plotExponentialLine(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
    // vec2 st = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
//     vec3 bg = vec3(y);
//     float straitLine = plotStraitLine(st);
//     vec3 coloredStraitLine = straitLine*vec3(0.0,1.0,0.0);
// bg += coloredStraitLine;
//     bg += (1.0-bg)*bg;
    
    gl_FragColor = vec4(p.x, p.y, p.y, 1.0);
}


