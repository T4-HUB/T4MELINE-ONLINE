import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Utilisation du plugin React
  server: {
    host: true, // Permet d'accéder à l'application via une IP réseau
    port: 3000, // Définit le port pour le serveur
    open: true, // Ouvre automatiquement l'application dans le navigateur
    strictPort: true, // Évite de changer de port si 3000 est occupé
    allowedHosts: '*', // Permet à tous les hôtes de se connecter (utile en développement)
    https: false, // Désactiver HTTPS en local, sauf si un certificat est disponible
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Redirige les requêtes API vers le backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // Répertoire de sortie pour la construction
    sourcemap: true, // Génère des cartes des sources pour le débogage
    minify: 'esbuild', // Utilisation d'Esbuild pour minifier le code
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables.scss";`, // Ajout automatique de variables SCSS globales
      },
    },
  },
  resolve: {
    alias: {
      '@components': '/src/components', // Alias pour accéder facilement aux composants
      '@styles': '/src/styles', // Alias pour les styles
      '@utils': '/src/utils', // Alias pour les utilitaires
    },
  },
});
