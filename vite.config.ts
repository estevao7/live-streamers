import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/live-streamers/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
