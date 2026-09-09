import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ReMind — Vite config
// Handles the React app build plus the PWA layer (manifest + service worker)
// described in the CogniCare/ReMind blueprint, Chapter 03.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'ReMind',
        short_name: 'ReMind',
        description: 'A gentle companion for memory and mind — cognitive games, reminders, and reminiscence for dementia care.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF8F3',
        theme_color: '#0F5257',
        icons: [
          { src: 'icons/logo.jpeg', sizes: '1280x1280', type: 'image/jpeg' }
        ]
      },
      workbox: {
        // Cache-first for the built app shell (JS/CSS/fonts/icons)
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Network-first for API calls, falling back to cache when offline
            urlPattern: ({ url }) => url.pathname.startsWith('/api') || url.pathname.startsWith('/ai'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'remind-api-cache',
              networkTimeoutSeconds: 6,
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
})
