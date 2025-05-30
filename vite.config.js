// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': 'http://localhost:4000',
//     },
//   },
// });
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:4000',
        ws: true,
      },
    },
  },
});
