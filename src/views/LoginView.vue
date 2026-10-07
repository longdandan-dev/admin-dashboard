<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { loginApi } from '../api/auth';
import { setToken } from '../utils/token';
import { useUserStore } from '../stores/user';

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

async function onLogin(){
    if(!username.value || !password.value) 
    return ElMessage.warning('请输入用户名和密码')
    try{
        const token = await loginApi(username.value, password.value)
        setToken(token)
        ElMessage.success('登录成功')
        userStore.setUser(username.value)
        router.push('/users')
    }catch{
        ElMessage.error('登录失败')
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <h1 class="title">后台数据看板</h1>
            <p class="sub">请登录后使用（账号：admin 密码：123456）</p>

            <el-input v-model="username" placeholder="请输入用户名" size="large" clearable></el-input>
            <el-input v-model="password" type="password" placeholder="请输入密码" size="large"  show-password></el-input>

            <el-button type="primary" size="large" class="btn" @click="onLogin">登录</el-button>
        </div>
    </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;   
  background: var(--bg);
}
.login-card {
  width: 360px;
  padding: var(--sp-6);
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .08);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.title { font-size: 20px; text-align: center; }
.sub { color: var(--text-3); text-align: center; font-size: 13px; margin-top: calc(var(--sp-2) * -1); }
.btn { width: 100%; }
</style>