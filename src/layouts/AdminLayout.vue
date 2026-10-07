<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useUserStore } from '../stores/user';
import { changePwdApi } from '../api/auth';
import { reactive, ref} from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { clearToken } from '../utils/token';

const pwdVisible = ref(false)
const sideOpen = ref(false)          // M7-4c：窄屏抽屉菜单的开关（≤900px 才用得到）
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
        <aside class="side" :class="{ open: sideOpen }">
            <div class="brand">后台数据看板</div>
            <nav class="nav">
                <RouterLink class="item" to="/users" @click="sideOpen = false">用户管理</RouterLink>
                <RouterLink class="item" to="/dashboard" @click="sideOpen = false">数据概览</RouterLink>
            </nav>
        </aside>

        <div v-if="sideOpen" class="mask" @click="sideOpen = false"></div>

        <div class="content">
            <header class="topbar">
                <button class="hamburger" type="button" aria-label="打开菜单" @click="sideOpen = true">☰</button>
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
                <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="110px">
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
  font-size: var(--fs-md);
  transition: background-color var(--tr), color var(--tr);
}
.item:hover { 
    background-color: var(--side-hover); 
    color: #fff; 
}
.item.active,
.item.router-link-active { 
    background-color: var(--primary-d);    /* M7-4：白字压 #409eff 只有 2.78:1 → 换深一档蓝 */
    color: #fff; 
    font-weight: 700;                       /* 加粗进"大字"档：门槛从 4.5 降到 3（实测 4.20 达标） */
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
    font-size: var(--fs-md);
}
/* M7-4：头像默认底色是浅灰 #c0c4cc，白字压上去只有 1.75:1 → 换成侧栏深色（10.4:1） */
.user-chip :deep(.el-avatar){
    background: var(--side);
}

/* ── 三档适配（M7-4c）：≤900px 侧栏改抽屉 + 汉堡按钮 ── */
.hamburger{
    display: none;                        /* 桌面不显示 */
}
.mask{
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .35);
    z-index: 20;
}
@media (min-width: 901px){
    .mask{ display: none; }               /* 桌面永远不用遮罩 */
}

@media (max-width: 900px){
    .layout{ grid-template-columns: 1fr; }          /* 侧栏脱离文档流，内容占满 */
    .side{
        position: fixed;
        inset: 0 auto 0 0;                          /* 贴左、满高 */
        width: var(--side-w);
        z-index: 30;
        transform: translateX(-100%);               /* 默认藏起来 */
        transition: transform var(--tr);
    }
    .side.open{ transform: none; }                  /* 点汉堡 → 滑出来 */

    .hamburger{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-right: auto;                         /* 把它顶到顶栏左边 */
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: #fff;
        color: var(--text-1);
        font-size: var(--fs-md);
        line-height: 1;
        cursor: pointer;
        transition: border-color var(--tr), color var(--tr);
    }
    .hamburger:hover{ border-color: var(--primary); color: var(--primary); }
    .hamburger:focus-visible{ outline: 2px solid var(--primary); outline-offset: 2px; }

    .topbar{ padding: 0 var(--sp-3); }
    .main{ padding: var(--sp-3); }
}

</style>