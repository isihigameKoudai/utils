type Props = {
  $canvas: HTMLCanvasElement;
  frequencyBinCount: number;
  times: Uint8Array | Float32Array;
};

export const basicParticle = ({ $canvas, frequencyBinCount, times }: Props) => {
  const $gl = $canvas.getContext("2d");
  const barWidth = window.innerWidth / frequencyBinCount;

  //  1フレームごとにリセット
  $gl!.fillStyle = "rgba(0, 0, 0, 1)";
  $gl!.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
  times.forEach((time, i) => {
    const percent = time / 255; // 255が最大値なので波形データの%が算出できる。
    const height = window.innerHeight * percent; // %に基づく高さを算出
    const offset = window.innerHeight - height; // y座標の描画開始位置を算出

    const r = time;
    // 対象のドットを描写
    $gl!.fillStyle = `rgb(${r}, ${r}, ${r})`;
    $gl!.fillRect(i * barWidth, offset, barWidth, 2);
  });
};

const renderLineVertex = `#version 300 es
precision highp float;
layout (location = 0) in float i_value;
uniform float u_length;
uniform float u_minValue;
uniform float u_maxValue;
#define linearstep(edge0, edge1, x) max(min((x - edge0) / (edge1 - edge0), 1.0), 0.0)
void main(void) {
  gl_Position = vec4(
    (float(gl_VertexID) / u_length) * 2.0 - 1.0,
    linearstep(u_minValue, u_maxValue, i_value) * 2.0 - 1.0,
    0.0,
    1.0
  );
}
`;

const renderLineFragment = `#version 300 es
precision highp float;
out vec4 o_color;
uniform vec3 u_color;
void main(void) {
  o_color = vec4(u_color, 1.0);
}
`;

type LineAudioProps = {
  $canvas: HTMLCanvasElement;
  analyzer: AnalyserNode;
  timeDomainArray: Float32Array;
  spectrumArray: Float32Array;
};

const createVbo = (
  gl: WebGL2RenderingContext,
  array: Float32Array,
  usage: number
) => {
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, array, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
};

// シェーダーのソースコードをWebGLに適用させる
const createShader = function (
  gl: WebGL2RenderingContext,
  source: string,
  type: number
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader!, source);
  gl.compileShader(shader!);

  if (!gl.getShaderParameter(shader!, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader!) + source);
  }

  return shader;
};

const createProgram = function (
  gl: WebGL2RenderingContext,
  vertShader: WebGLShader,
  fragShader: WebGLShader
) {
  const program = gl.createProgram()!;
  gl.attachShader(program!, vertShader);
  gl.attachShader(program!, fragShader);
  gl.linkProgram(program!);

  if (!gl.getProgramParameter(program!, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program!) || "");
  }

  return program;
};

const getUniformLocs = function (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: string[]
) {
  const map = new Map();
  names.forEach((name) => map.set(name, gl.getUniformLocation(program, name)));
  return map;
};

type UniformsForGl = {
  [key: string]: number;
};

const injectWaveArray = ({
  $gl,
  waveArray,
  color,
  uniforms,
}: {
  $gl: WebGL2RenderingContext;
  waveArray: Float32Array;
  color: { r: number; g: number; b: number };
  uniforms: UniformsForGl;
}) => {
  const vbo = createVbo($gl, waveArray, $gl.DYNAMIC_DRAW);
  $gl.bindBuffer($gl.ARRAY_BUFFER, vbo);
  $gl.bufferSubData($gl.ARRAY_BUFFER, 0, waveArray);
  const program = createProgram(
    $gl,
    createShader($gl, renderLineVertex, $gl.VERTEX_SHADER),
    createShader($gl, renderLineFragment, $gl.FRAGMENT_SHADER)
  );
  $gl?.useProgram(program);
  const uniformKeys = Object.keys(uniforms);
  const uniformLocs = getUniformLocs($gl, program, [...uniformKeys, "u_color"]);
  // TODO: vec2やvec3などのプリミティブではない値だった場合、自動で出し分けるようにする
  uniformKeys.forEach((uniformKey) => {
    $gl.uniform1f(uniformLocs.get(uniformKey), uniforms[uniformKey]);
  });
  $gl.uniform3f(uniformLocs.get("u_color"), color.r, color.g, color.b);

  $gl.enableVertexAttribArray(0);
  $gl.vertexAttribPointer(0, 1, $gl.FLOAT, false, 0, 0);
  $gl.drawArrays($gl.LINE_STRIP, 0, waveArray.length);
};

export const lineAudio = ({
  $canvas,
  analyzer,
  timeDomainArray,
  spectrumArray,
}: LineAudioProps) => {
  const $gl = $canvas.getContext("webgl2");
  if (!$gl) return;

  $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
  $gl.clearColor(0, 0, 0, 1);

  injectWaveArray({
    waveArray: timeDomainArray,
    $gl,
    color: {
      r: 1.0,
      g: 0.0,
      b: 1.0,
    },
    uniforms: {
      u_length: timeDomainArray.length,
      u_minValue: -1.0,
      u_maxValue: 1.0,
    },
  });

  injectWaveArray({
    waveArray: spectrumArray,
    $gl,
    color: {
      r: 1.0,
      g: 0.0,
      b: 0.3,
    },
    uniforms: {
      u_length: spectrumArray.length,
      u_minValue: analyzer.minDecibels,
      u_maxValue: analyzer.maxDecibels,
    },
  });
};
