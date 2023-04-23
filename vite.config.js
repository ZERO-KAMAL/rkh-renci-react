/* eslint-disable */
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3001,
  },
  define: {
    'process.env': process.env,
  },
  plugins: [react()],
  build: {
    outDir: './build',
  },
  resolve: {
    alias: [
      {
        find: 'app',
        replacement: resolve(__dirname, 'src/app'),
      },
      {
        find: '/app',
        replacement: resolve(__dirname, 'src/app'),
      },
    ],
  },
})
