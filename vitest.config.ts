import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/web/src'),
      '@utils/core': path.resolve(__dirname, 'packages/core'),
      '@utils/modules': path.resolve(__dirname, 'packages/modules'),
      '@utils/domains': path.resolve(__dirname, 'packages/domains'),
      '@chroma-core/default-embed': path.resolve(
        __dirname,
        'packages/modules/db/chroma/dummy-embed.ts',
      ),
    },
  },
  test: {
    include: ['packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
  },
});
