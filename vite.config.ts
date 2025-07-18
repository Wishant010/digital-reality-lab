/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/wishantbhajan/', // ✅ Correct voor GitHub Pages repo-project
  plugins: [
    react({
      babel: {
        plugins: [
          process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-console'
        ].filter(Boolean) as string[]
      },
      jsxRuntime: 'automatic'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/Pages'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/assets': resolve(__dirname, 'src/assets')
    }
  },
  server: {
    port: 4173,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
      port: 24678
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    target: ['es2020', 'chrome80', 'firefox78', 'safari14'],
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom', 'react-error-boundary'],
          'vendor-animation': ['framer-motion'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei']
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.\w+$/, '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name || '')) {
            return 'images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'fonts/[name]-[hash][extname]';
          }
          return `assets/[name]-[hash].${ext}`;
        }
      },
      external: (id) => {
        return id.includes('MetaMask') ||
               id.includes('phantom') ||
               id.includes('keplr') ||
               id.includes('wallet');
      }
    }
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-error-boundary'
    ],
    exclude: [
      'web3',
      'ethers',
      '@solana/web3.js',
      'metamask',
      'phantom',
      'keplr'
    ],
    force: true
  },
  preview: {
    port: 4173,
    open: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    global: 'globalThis'
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
    treeShaking: true
  },
  ssr: {
    noExternal: ['framer-motion']
  },
  worker: {
    format: 'es'
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 4,
        minThreads: 1
      }
    }
  }
});
