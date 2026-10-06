import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import { createPinia } from 'pinia'

// 组件和样式由 vite.config.ts 里的 unplugin-vue-components 按需自动引入。
// 中文语言包不在这里配 —— 用 App.vue 里的 <el-config-provider> 配（官方推荐做法）。

createApp(App).use(router).use(createPinia()).mount('#app')
