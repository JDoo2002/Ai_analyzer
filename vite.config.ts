import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Preserve existing rollup config for PDF worker
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf.worker': ['pdfjs-dist/build/pdf.worker.entry']
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    outDir: 'dist'
  },

  // Add server proxy for OpenAI API
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
        headers: {
          Authorization: `Bearer ${process.env.VITE_OPENAI_API_KEY}`
        }
      }
    }
  },

  // GitHub Pages deployment requires the correct base
  base: '/Ai_analyzer/', // Adjust to match your repo name
  
  define: {
    'process.env': {}
  }
});
