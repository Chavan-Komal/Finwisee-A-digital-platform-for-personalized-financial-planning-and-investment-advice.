import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      // Forward API calls to the Spring Boot backend, so the browser never hits CORS.
      // Override the target with BACKEND_URL=http://localhost:8081 if 8080 is taken.
      proxy: {
        '/api': {
          target: env.BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          // Proxied calls are same-origin for the browser; drop Origin so the
          // backend's CORS check doesn't reject dev servers on other ports.
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
          },
        },
      },
    },
  }
})
