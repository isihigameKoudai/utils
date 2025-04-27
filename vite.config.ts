import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

import { apiMap } from "./utils/apis/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    Pages()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  server: {
    proxy: {
      [apiMap.gmo.url]: {
        target: apiMap.gmo.originUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gmo/, '')
      },
      [apiMap.binance.url]: {
        target: apiMap.binance.originUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/binance/, '')
      }
    },
  }
});
