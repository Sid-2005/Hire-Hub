import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (mode === 'production' && !env.VITE_API_BASE_URL) {
    throw new Error(
      '[HireHub] Build aborted: VITE_API_BASE_URL is not set.\n' +
      'Set it in your CI/CD environment or hosting platform before building.'
    )
  }

  const devPort    = Number(env.PORT) || 5173
  const proxyTarget = env.VITE_BACKEND_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      port: devPort,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
