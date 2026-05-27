import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

import { apiMap } from './utils/apis/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      generatedRouteTree: './src/generated/routeTree.gen.ts',
      routesDirectory: './src/routes',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@chroma-core/default-embed': path.resolve(__dirname, './utils/db/chroma/dummy-embed.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
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
