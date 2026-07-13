import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Removed @tailwindcss/vite — using pure CSS instead for Vercel compatibility
export default defineConfig({
  plugins: [react()],
})
