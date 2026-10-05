<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div class="layout">
      <aside class="side">
        <div class="brand">后台数据看板</div>
        <nav class="nav"> 
          <RouterLink class="item" to="/users">用户管理</RouterLink>
          <RouterLink class="item" to="/dashboard">数据概览</RouterLink>
        </nav>
      </aside>

      <main class="main">
        <RouterView/>
      </main>
    </div>
  </el-config-provider>
</template>

<style scoped>
.layout { 
  display: grid; 
  grid-template-columns: var(--side-w) 1fr; 
  min-height: 100vh; 
}
.side { 
  background: var(--side); 
  color: var(--side-text); 
}
.brand {
  height: 52px; 
  display: flex; 
  align-items: center;
  padding: 0 var(--sp-5);
  background: var(--side-brand); 
  color: #fff; 
  font-weight: 600;
}
.main { 
  background: var(--bg); 
  padding: var(--sp-5); 
  min-width: 0;
}
.nav{
  display: flex;
  flex-direction: column;
}
.item{
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 20px;
  font-size: 14px;
}
.item:hover{
  background-color: var(--side-hover);
  color: #fff;
}
.item.router-link-active{
  background-color: var(--primary);
  color: #fff;
}
</style>
