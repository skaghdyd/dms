import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        ws: true,
        secure: false,
        target: `http://localhost:8080/api`,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
});
