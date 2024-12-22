import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Pages()],
  resolve: {
    alias: [{ find: "@/", replacement: "./src/" }]

    // alias: {
    //   '@': './'
    // },
  },
});
