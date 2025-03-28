import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/server": {
        target: "https://letter-link.onrender.com",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
