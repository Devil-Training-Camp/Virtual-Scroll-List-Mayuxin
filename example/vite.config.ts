import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// import usePluginImport from 'vite-plugin-importer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    // usePluginImport({
    //   libraryName: '@devil-training-camp/yuxin-ui',
    //   libraryDirectory: 'ui/es',
    //   style: 'css',
    // }),
  ],
})
