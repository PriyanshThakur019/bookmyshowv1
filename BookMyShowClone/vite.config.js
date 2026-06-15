import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': {
        target: 'https://spring-boot-tutorial-8yy3.onrender.com',
        changeOrigin: true,
      },
      '/register': {
        target: 'https://spring-boot-tutorial-8yy3.onrender.com',
        changeOrigin: true,
      },
      '/getFutureEventsList': {
        target: 'https://spring-boot-tutorial-8yy3.onrender.com',
        changeOrigin: true,
      },
      '/registerUserForEvent': {
        target: 'https://spring-boot-tutorial-8yy3.onrender.com',
        changeOrigin: true,
      },
      '/getAllEventsPerUser': {
        target: 'https://spring-boot-tutorial-8yy3.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
