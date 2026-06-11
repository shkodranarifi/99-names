import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "99 Names — Asma-ul-Husna",
        short_name: "99 Names",
        description:
          "Learn the 99 Names of Allah in a 20-day challenge. Arabic, transliteration, English & Albanian.",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#2fa56e",
        background_color: "#faf7f0",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
      },
    }),
  ],
  // relative base so the build works on any static host or subpath
  base: "./",
});
