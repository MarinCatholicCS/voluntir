import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to a GitHub Pages project site (username.github.io/repo-name),
// set base to '/repo-name/'. For a custom domain or user site, use '/'.
export default defineConfig({
  plugins: [react()],
  base: '/voluntir/',
})
