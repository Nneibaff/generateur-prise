import { defineConfig } from 'vite'


export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // Redirige toutes les requêtes /api vers Flask
    }
  }
});