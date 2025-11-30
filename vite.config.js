import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MeliCheck Operaciones',
        short_name: 'MeliCheck',
        description: 'Gestión de repartidores y visitas',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Esto hace que parezca una app nativa
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/public/192.png', // Debes crear estas imágenes luego
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/public/512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Estrategias de caché:
        // Cachear API responses o imágenes si es necesario
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/tu-api-backend\.com\/.*$/,
                handler: 'NetworkFirst', // Intenta red, si falla, usa caché (útil para catálogos)
                options: {
                    cacheName: 'api-cache',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 60 * 60 * 24 // 1 día
                    }
                }
            }
        ]
      }
    })
  ],
})