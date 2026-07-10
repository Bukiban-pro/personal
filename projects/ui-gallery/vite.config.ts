import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const ROOT_MODULES = path.resolve(__dirname, 'node_modules')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __UI_LAB_ROOT__: JSON.stringify(path.resolve(__dirname, '../ui-patterns')),
  },
  resolve: {
    // Force ALL bare-module imports (even from outside the project) to resolve here
    modules: [ROOT_MODULES, 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, '../ui-patterns'),
      'next/image': path.resolve(__dirname, 'src/mocks/next-image.tsx'),
      'next/link': path.resolve(__dirname, 'src/mocks/next-link.tsx'),
    },
  },
  server: {
    fs: {
      // Allow serving files from the whole repo (including ../ui-patterns)
      allow: [path.resolve(__dirname, '..'), ROOT_MODULES],
    },
  },
})
