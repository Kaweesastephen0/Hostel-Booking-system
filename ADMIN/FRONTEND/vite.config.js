import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'react': '/home/killan/Desktop/GITHUB/Hostel-Booking-system/ADMIN/FRONTEND/node_modules/react',
      'react-dom': '/home/killan/Desktop/GITHUB/Hostel-Booking-system/ADMIN/FRONTEND/node_modules/react-dom'
    }
  }
})
