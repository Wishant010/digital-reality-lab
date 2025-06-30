/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Optimize React for production
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-console'
        ].filter(Boolean) as string[]
      },
      jsxRuntime: 'automatic'
    })
  ] as any[], // Use 'any[]' to avoid PluginItem type error
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
      port: 24678 // Use different port to avoid conflicts
    },
    // Prevent wallet extension conflicts
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
    minify: 'esbuild', // Faster than terser
    rollupOptions: {
      // Optimize bundle splitting
      output: {
        manualChunks: {
          // Core React bundle
          'vendor-react': ['react', 'react-dom'],
          // Router bundle
          'vendor-router': ['react-router-dom', 'react-error-boundary'],
          // Animation bundle
          'vendor-animation': ['framer-motion'],
          // Three.js bundle (if used)
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei']
        },
        // Optimize chunk names for caching
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
      // Reduce bundle size
      external: (id) => {
        // Don't bundle wallet extensions
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
      // Exclude wallet-related dependencies to prevent conflicts
      'web3',
      'ethers',
      '@solana/web3.js',
      'metamask',
      'phantom',
      'keplr'
    ],
    // Force pre-bundling of problematic dependencies
    force: true
  },
  preview: {
    port: 4173,
    open: true,
    // Security headers for production preview
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    // Disable wallet-related globals in dev mode to prevent conflicts
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    global: 'globalThis'
  },
  // Enhanced esbuild configuration
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
    treeShaking: true
  },
  // Performance optimizations
  ssr: {
    noExternal: ['framer-motion'] // Pre-bundle for better performance
  },
  // Worker optimizations
  worker: {
    format: 'es'
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true,
    // Optimize test performance
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 4,
        minThreads: 1
      }
    }
  }
});