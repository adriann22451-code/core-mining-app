import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // biar bisa dites dari HP di jaringan yang sama
    port: 5173,
  },
});
