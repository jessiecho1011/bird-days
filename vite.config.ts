import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 本機開發與自訂網域為 '/'；部署至 GitHub Pages 子路徑時透過 VITE_BASE_PATH 自動注入
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
