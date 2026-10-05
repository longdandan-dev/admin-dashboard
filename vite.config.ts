import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 按需引入 Element Plus 的两个插件（只在构建时工作，不进产物）
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动引入"函数式 API"：ElMessage / ElMessageBox 这类，不用手写 import
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 自动引入"模板里的组件"：<el-table> 这类，连同它对应的样式一起按需引入
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
