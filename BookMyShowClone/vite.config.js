import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/getFutureEventsList': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/registerUserForEvent': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/getAllEventsPerUser': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
