import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend()],
  base: './',
  build: {
    target: 'modules',
    outDir: 'es',  // 打包文件目录
    minify: true,
    rollupOptions: {
      external: ['vue'],
      input: ['index.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: resolve(__dirname, './ui/es')
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: 'named',
          //配置打包根目录
          dir: resolve(__dirname, './ui/lib'),
        }
      ]
    },
    lib: {
      entry: './index.ts',
      name: 'mayuxin',
      formats: ['es', 'cjs']
    }
  }
})
