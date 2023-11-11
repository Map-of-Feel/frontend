import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
   server: {
        host: true,
        port: 8000,
// Thanks @sergiomoura for the window fix
// add the next lines if you're using windows and hot reload doesn't work
//        watch: {
//              usePolling: true
//                  }
    },
  plugins: [vue()],
})
