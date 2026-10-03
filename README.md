# admin-dashboard · 后台数据看板

个人学习项目（第 4 个作品），目标是做一个后台管理系统风格的看板。
做完会部署到 GitHub Pages，并挂进个人作品集官网。

> 这是一个学习项目，功能还在逐个里程碑（M）实现中，当前只完成到 M1。

## 当前进度

### 已完成：M1 路由骨架

- 左侧 210px 深色侧边栏：品牌条「后台数据看板」+ 两条菜单（用户管理 / 数据概览）
- 右侧内容区用 `<RouterView>` 承载页面
- 路由表：`/` 重定向到 `/users`，另有 `/dashboard`
- 两个页面组件 `views/UsersView.vue`、`views/DashboardView.vue`：**目前只有占位标题和一行说明文字，没有任何业务功能**
- 设计令牌统一写在 `src/style.css` 的 `:root` 里，主色对齐 Element Plus 官方蓝 `#409eff`
- 1440 / 820 / 375 三档宽度无横向溢出，控制台 0 报错

### 计划中（尚未开工）

| 里程碑 | 内容 |
| --- | --- |
| M2 | 表格 + 分页 + 接口对接 |
| M3 | 新增 / 编辑弹窗 + 表单校验 |
| M4 | 删除 / 批量操作 + 交互反馈 |
| M5 | 假登录 + 路由守卫 |
| M6 | 数据概览 + 设计打磨 + 上线 |

## 技术栈

当前实际使用：

- Vue 3.5（`<script setup>` 语法）
- TypeScript
- Vite 8
- Vue Router 5（history 模式）
- Pinia 4（已安装，尚未使用）

计划引入：

- Element Plus 组件库
- axios（对接 JSONPlaceholder 公开接口）

开发环境：Node v24.21.0、npm 11.19.0、Windows

## 本地运行

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器，默认 http://localhost:5173
npm run build   # 完整类型检查并构建到 dist/
npm run preview # 预览构建产物
```

## 目录结构

```text
admin-dashboard/
├─ src/
│  ├─ main.ts            # 入口：创建应用、挂载路由
│  ├─ App.vue            # 布局外壳：左侧边栏 + 右侧内容区
│  ├─ style.css          # 全局样式与 :root 设计令牌
│  ├─ router/index.ts    # 路由表
│  ├─ views/             # 页面组件（对应地址）
│  ├─ components/        # 可复用组件（暂无）
│  └─ assets/            # 静态资源（暂无）
├─ public/
├─ index.html
└─ vite.config.ts
```

三者的分工：

- `src/router/`：只管「哪个地址显示哪个页面」。地址和页面的对应关系集中写在这里，页面里不做地址判断。
- `src/views/`：**页面组件，对应某个地址**。例如 `/users` → `UsersView.vue`。页面负责从接口拿数据、把零件拼成完整界面。
- `src/components/`：**可复用零件，不对应地址**。谁需要谁引入，一个零件可以出现在多个页面里。判断要不要拆出来看三点：会重复画好几遍吗、自己有一摊独立的事吗、会经常单独改吗。

注：`_verify/` 是无头浏览器验收脚本（Edge headless + CDP），已在 `.gitignore` 里排除，不属于项目源码。

## 开发约定

- 一个里程碑（M）一个能演示的产出，做完再进下一个。
- 每个 M 的完成门槛只有两条：**能跑**（控制台 0 报错）、**能讲**（用自己的话把这个 M 讲一遍）。
- 样式优先复用 `src/style.css` 里已有的设计令牌，不临时写死颜色和间距。
- 组件按「先能跑，再拆」的原则拆，不提前过度设计。
- 每个 M 至少一个 git 提交，提交信息写清这个 M 做了什么。
