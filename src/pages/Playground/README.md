# GLSL generally utils

## normalize

### xy-coordinate
'''
vec2 st = gl_FragCoord.xy/resolution;
'''

### circle-coordinate
```
vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
```