import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: '0.0.0.0', // Autorise les connexions externes
   port: process.env.PORT || 3000,      // Définissez explicitement le port
    open: true,       // Ouvre automatiquement le navigateur
  },
})
