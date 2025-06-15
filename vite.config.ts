import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});
