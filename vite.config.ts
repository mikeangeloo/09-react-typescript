import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/09-react-typescript/',
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 usa APIs de SASS que quedaron deprecadas en Dart Sass 2.x
        // Silenciamos las advertencias para no saturar la consola de desarrollo
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
})
