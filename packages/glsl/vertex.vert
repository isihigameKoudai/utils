// attribute vec3 position;
// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

void main(void){
  gl_Position = vec4(position, 1.0);
}
