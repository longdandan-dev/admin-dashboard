import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 按需引入 Element Plus 的两个插件（只在构建时工作，不进产物）
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages 部署在子路径 /admin-dashboard/ 下 → **打包**时必须带 base，否则静态资源全 404。
  // 用 mode 判断而不是 command：`vite preview` 的 command 也是 'serve'，用 command 会让本地预览拿不到 base。
  //  - dev（mode=development）→ '/'：开发地址 http://localhost:5173/users 和 _verify/ 里的验收脚本都不用改
  //  - build / preview（mode=production）→ '/admin-dashboard/'：本地预览就能忠实复现线上的子路径
  base: mode === 'production' ? '/admin-dashboard/' : '/',
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
  build: {
    outDir: 'docs',   // 产物直接进 docs/（Pages 源选 main / docs，和你别的项目一致）
  },
}))
