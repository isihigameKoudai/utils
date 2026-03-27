import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

import { apiMap } from './utils/apis/config';

/**
 * @mediapipe packages are IIFE format (Google Closure Compiler output) that
 * register exports as global properties via helper functions (za/K/G).
 * Rolldown (Vite 8) cannot resolve named imports from IIFE modules.
 * This plugin wraps the IIFE so its globals are captured and re-exported as ESM.
 */
function mediapipeEsmPlugin(): Plugin {
  const mediapipePackages: Record<string, string[]> = {
    '@mediapipe/hands': ['Hands', 'HAND_CONNECTIONS', 'VERSION'],
    '@mediapipe/face_detection': [
      'FaceDetection',
      'FACE_GEOMETRY_CONNECTIONS',
      'VERSION',
    ],
    '@mediapipe/face_mesh': [
      'FaceMesh',
      'FACEMESH_CONTOURS',
      'FACEMESH_FACE_OVAL',
      'FACEMESH_LEFT_EYE',
      'FACEMESH_LEFT_EYEBROW',
      'FACEMESH_LEFT_IRIS',
      'FACEMESH_LIPS',
      'FACEMESH_RIGHT_EYE',
      'FACEMESH_RIGHT_EYEBROW',
      'FACEMESH_RIGHT_IRIS',
      'FACEMESH_TESSELATION',
      'VERSION',
    ],
    '@mediapipe/pose': [
      'Pose',
      'POSE_CONNECTIONS',
      'POSE_LANDMARKS',
      'POSE_LANDMARKS_LEFT',
      'POSE_LANDMARKS_RIGHT',
      'POSE_LANDMARKS_NEUTRAL',
      'VERSION',
    ],
  };

  return {
    name: 'mediapipe-esm-wrapper',
    enforce: 'pre',
    resolveId(source) {
      if (source in mediapipePackages) {
        return `\0mediapipe:${source}`;
      }
    },
    load(id) {
      if (!id.startsWith('\0mediapipe:')) return;
      const pkg = id.slice('\0mediapipe:'.length);
      const exports = mediapipePackages[pkg];
      if (!exports) return;

      const entryFile = require.resolve(pkg);
      const code = fs.readFileSync(entryFile, 'utf-8');

      const wrappedCode = [
        'var __mediapipe_exports__ = {};',
        `(function() { ${code} }).call(__mediapipe_exports__);`,
        ...exports.map(
          (name) => `export var ${name} = __mediapipe_exports__["${name}"];`,
        ),
      ].join('\n');

      return wrappedCode;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mediapipeEsmPlugin(),
    react(),
    TanStackRouterVite({
      generatedRouteTree: './src/generated/routeTree.gen.ts',
      routesDirectory: './src/routes',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  optimizeDeps: {
    exclude: [
      '@mediapipe/hands',
      '@mediapipe/face_detection',
      '@mediapipe/face_mesh',
      '@mediapipe/pose',
    ],
  },
  server: {
    proxy: {
      [apiMap.gmo.url]: {
        target: apiMap.gmo.originUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gmo/, ''),
      },
      [apiMap.binance.url]: {
        target: apiMap.binance.originUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/binance/, ''),
      },
    },
  },
});
