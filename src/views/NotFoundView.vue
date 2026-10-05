<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="page">
    <h2>页面不存在</h2>
    <p class="tip">这个地址的页面还没做，或者你输错了一个字。</p>
    <p class="tip"><code>这个地址：{{ $route.fullPath }}</code></p>
    <RouterLink class="back" to="/users">← 回到用户管理</RouterLink>
  </section>
</template>

<style scoped>
.page { padding: 4px; }
.tip { color: #909399; font-size: 13px; margin-top: 8px; }
.back {
  display: inline-block;
  margin-top: 16px;
  color: var(--primary);
  font-size: 14px;
}
.back:hover { color: var(--primary-d); }
</style>
