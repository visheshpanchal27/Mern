import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  publicDir: 'public',
  server: {
    proxy: {
      "/api": {
        target: "https://mern-u0bv.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
