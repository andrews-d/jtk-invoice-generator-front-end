import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://jtk-invoice-generator-back-end.onrender.com",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000, // KB
  },
});
