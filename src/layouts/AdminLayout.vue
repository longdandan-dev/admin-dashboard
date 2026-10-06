<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useUserStore } from '../stores/user';
import { changePwdApi } from '../api/auth';
import { reactive, ref} from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { clearToken } from '../utils/token';

const pwdVisible = ref(false)
const pwdFormRef = ref()
const pwdForm = reactive({oldPwd:'', newPwd:'', confirmPwd:''})
const userStore = useUserStore()
const router = useRouter()

const pwdRules = {
    oldPwd:[{ required:true, message:'请输入原密码', trigger:'blur'}],
    newPwd:[
        {required:true, message:'请输入新密码', trigger:'blur'},
        {min:6, message:'新密码最少6位数', trigger:'blur'}
    ],
    confirmPwd:[
        {required:true, message:'请再输入一次新密码', trigger:'blur'},
        {
            validator:(_rule:any, value:string, callback:any)=>{
                if(value !== pwdForm.newPwd )callback(new Error('两次输入的密码不一样'));
                else callback()
            },
            trigger:'blur',
        },
    ],
}

function onCommand(cmd:string) {
    if( cmd === 'pwd')pwdVisible.value = true
    else if( cmd === 'logout'){
        clearToken()
        userStore.clearUser()
        router.push('/login')
    }
}
async function onSubmitPwd(){
    try{
        await pwdFormRef.value.validate()
    }catch{
        return
    }
    
    try{
        await changePwdApi(pwdForm.oldPwd, pwdForm.newPwd)
        ElMessage.success('修改密码成功')
        pwdVisible.value = false
        pwdForm.oldPwd = ''
        pwdForm.newPwd = ''
        pwdForm.confirmPwd = ''
    }catch(error){
        ElMessage.error((error as Error).message)
    }
}
</script>

<template>
    <div class="layout">
        <aside class="side">
            <div class="brand">后台数据看板</div>
            <nav class="nav">
                <RouterLink class="item" to="/users">用户管理</RouterLink>
                <RouterLink class="item" to="/dashboard">数据概览</RouterLink>
            </nav>
        </aside>

        <div class="content">
            <header class="topbar">
                <el-dropdown @command="onCommand">
                    <span class="user-chip">
                        <el-avatar :size="28">管</el-avatar>
                        <span class="user-name">{{ userStore.username }}</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>当前用户</el-dropdown-item>
                            <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </header>
        
            <el-dialog v-model="pwdVisible" title="修改密码" width="420px">
                <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="90px"> 
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input v-model="pwdForm.oldPwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input v-model="pwdForm.newPwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="confirmPwd">
                        <el-input v-model="pwdForm.confirmPwd" type="password" show-password></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="pwdVisible=false">取消</el-button>
                    <el-button type="primary" @click="onSubmitPwd">确定</el-button>
                </template>
            </el-dialog>

            <main class="main">
                <RouterView/>
            </main>
        </div>
    </div>
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
    flex: 1;
}
.nav { 
    display: flex; 
    flex-direction: column; }
.item {
  display: flex; 
  align-items: center;
  height: 46px; 
  padding-left: 20px; 
  font-size: 14px;
}
.item:hover { 
    background-color: var(--side-hover); 
    color: #fff; 
}
.item.router-link-active { 
    background-color: var(--primary); 
    color: #fff; 
    }
.content{
    display: flex;
    flex-direction: column;
    min-width: 0;
}
.topbar{
    height: 52px;
    background: #fff;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 var(--sp-5);
}
.user-chip{
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    cursor: pointer;
}
.user-name{
    font-size: 14px;
}

</style>