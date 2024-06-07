import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    emptyOutDir: false,

    rollupOptions: {
      input: "src/background.ts",
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: true,
      }
    }
  },
});
