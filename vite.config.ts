import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL ?? "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
