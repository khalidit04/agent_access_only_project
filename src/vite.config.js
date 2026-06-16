import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    
    // Root directory for source files (eliminates nested src/src pattern)
    root: process.cwd(),
    
    // Development server configuration
    server: {
      port: 3000,
      open: true,
      // Proxy API requests to backend during development
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    
    // Build output configuration
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
    
    // Path aliases for clean imports
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@theme': path.resolve(__dirname, './src/theme'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    
    // CSS configuration (supports MUI's styled-components or emotion)
    css: {
      devSourcemap: true,
    },
  };
});