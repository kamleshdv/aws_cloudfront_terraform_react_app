/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/aws_cloudfront_terraform_react_app/',  // REPO NAME - IMPORTANT!
  build: {
    outDir: 'dist',  // GitHub Pages expects 'dist' by default
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
