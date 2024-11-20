import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Check if running in StackBlitz
const isStackBlitz = process.env.SHELL?.includes('webcontainer');

export default defineConfig({
  plugins: [
    react(),
    // Only enable PWA in production or non-StackBlitz environments
    !isStackBlitz && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Logday - Workout Tracker',
        short_name: 'Logday',
        description: 'Never skip log day - Track your workouts',
        theme_color: '#2463EB',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['fitness', 'health', 'lifestyle'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon'
          }
        ],
        screenshots: [
          {
            src: 'screenshot1.png',
            sizes: '1170x2532',
            type: 'image/png',
            platform: 'narrow',
            label: 'Homescreen of Logday App'
          },
          {
            src: 'screenshot2.png',
            sizes: '1170x2532',
            type: 'image/png',
            platform: 'narrow',
            label: 'Workout Session in Logday App'
          }
        ],
        shortcuts: [
          {
            name: 'Start Workout',
            url: '/',
            icons: [{ src: 'shortcut-workout.png', sizes: '96x96' }]
          },
          {
            name: 'View History',
            url: '/logs',
            icons: [{ src: 'shortcut-history.png', sizes: '96x96' }]
          }
        ],
        related_applications: [
          {
            platform: 'webapp',
            url: 'https://logday.app/manifest.json'
          }
        ],
        prefer_related_applications: false,
        launch_handler: {
          client_mode: ['navigate-existing', 'auto']
        }
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/nusvmmtwguxhgaaezgwy\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Disable in development
      }
    })
  ].filter(Boolean),
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});