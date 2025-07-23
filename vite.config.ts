/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.CI === 'true';
  
  // Voor custom domain (wishantbhajan.nl) gebruik altijd root base
  const base = '/';

  return {
    base,
    plugins: [
      react({
        babel: {
          plugins: [
            isProduction && 'babel-plugin-transform-remove-console'
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
      sourcemap: !isProduction,
      target: ['es2020', 'chrome80', 'firefox78', 'safari14'],
      cssCodeSplit: true,
      chunkSizeWarningLimit: 800,
      minify: 'esbuild',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // Gebruik cache-busting hashes
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name || '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            return `assets/[name]-[hash].${ext}`;
          },
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom', 'react-error-boundary'],
            'vendor-animation': ['framer-motion'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei']
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
        'X-XSS-Protection': '1; mode=block',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    define: {
      __DEV__: JSON.stringify(!isProduction),
      __PROD__: JSON.stringify(isProduction),
      'process.env.NODE_ENV': JSON.stringify(mode),
      global: 'globalThis'
    },
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
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
  };
});