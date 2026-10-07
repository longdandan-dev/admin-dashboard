<script setup lang="ts">
import { ref,onMounted,watch, onUnmounted, nextTick } from 'vue'
import { type User,type Role,type UserStatus } from '../data/users'
import { fetchUsers, createUser, updateUser, deleteUser   } from '../api/user'
import { reactive, computed } from 'vue'
import { type FormRules, type FormInstance, ElMessage, ElMessageBox } from 'element-plus'

let timer: ReturnType<typeof setTimeout> | undefined

const page = ref(1)
const users = ref<User[]>([])
const total = ref(0)
const pageSize = ref(10)
const loading = ref(false)
const err = ref('')
const dialogVisible = ref(false)
const keyword = ref('')
const statusFilter = ref('all')
interface UserForm {
    name:string
    email:string
    role:Role
    status:UserStatus
}
const form = reactive<UserForm>({
    name:'',
    email:'',
    role:'普通用户',
    status:'正常',
})
const rules:FormRules<UserForm> = {
    name:[
        { required:true, message:'请输入姓名', trigger:'blur' },
        { min: 2, max: 10, message: '姓名要 2~10 个字', trigger: 'blur' },
    ],
    email:[
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不对（例：user@example.com）', trigger: 'blur' },
    ]
}
const formRef = ref<FormInstance>()
const editingId = ref<number | null>(null)
const dialogTitle = computed(()=>(editingId.value === null ? '新增用户' : '编辑用户' ))
const selected= ref<User[]>([])

async function load(){
    loading.value = true
    err.value = ''
    try{
    const res = await fetchUsers(page.value,pageSize.value,{
        name:keyword.value,
        status: statusFilter.value === 'all' ? '' :statusFilter.value,
    })
    users.value = res.list
    total.value = res.total
    }catch{
        err.value = '出错了，请稍后重试。'
        users.value = []

    }finally{
        loading.value = false
    }
}
async function onSubmit(){
    if(!formRef.value) return 
    try{
        await formRef.value.validate()
        if(editingId.value === null){
            await createUser({ name:form.name, email:form.email, role:form.role, status:form.status})
        }else{
            await updateUser(editingId.value,{ name:form.name, email:form.email, role:form.role, status:form.status})
        }
        
        dialogVisible.value = false
        await load()
    }catch{

    }
}

function roleType(r: Role) {
  if (r === '管理员') return 'danger'
  if (r === '编辑') return 'warning'
  return 'info'
}
function statusType(s: UserStatus) {
  if (s === '正常') return 'success'
  if (s === '待审核') return 'warning'
  return 'danger'
}

function openCreate(){
    form.name = ''
    form.email = ''
    form.role = '普通用户'
    form.status = '正常'
    editingId.value = null
    dialogVisible.value = true
}
function openEdit(row:User){
    editingId.value = row.id
    form.name = row.name 
    form.email = row.email
    form.role = row.role
    form.status = row.status
    dialogVisible.value = true
}
async function onDelete(row:User){
    users.value = users.value.filter((u)=> u.id !== row.id)
    total.value -= 1
    try{
        await deleteUser(row.id)
        ElMessage.success('删除成功')
    }catch{
        ElMessage.error('删除失败，请刷新后重试。')
        await load()
    }
}
function onSelectionChange(rows: User[]){
    selected.value = rows
}
async function onBatchDelete(){
    if(selected.value.length === 0)return 
    try{
        await ElMessageBox.confirm(
            `要删掉${selected.value.length}条吗？删了就找不回来了`,
            '确定批量删除',
            {type:'warning'}
        )
    }catch{
        return
    }

    try{
        await Promise.all(selected.value.map((r)=> deleteUser(r.id)))
        ElMessage.success(`成功删除${selected.value.length} 条`)
        await load()
    }catch{
        ElMessage.error('批量删除失败，请重试')
        await load()
    }
}
function onSearch(){
    runQuery(true)
}
async function onRest(){
    keyword.value = ''
    statusFilter.value = 'all'
    await nextTick()
    runQuery(true)
}
function loadFromFirstPage(){
    if(page.value === 1)load()
    else page.value = 1
}
function runQuery(immediate = false){
    clearTimeout(timer)
    if(immediate){
        loadFromFirstPage()
    }else{
        timer = setTimeout(loadFromFirstPage,300)
    }
}
onMounted(load)
watch(page,load)
watch(keyword,()=>runQuery())
onUnmounted(()=>clearTimeout(timer))
</script>

<template>
    <section class="page">
        <h2>用户管理</h2>
        <p v-if="err" class="err">{{  err }}</p>
        <div class="filters">
            <span class="filter-label">姓名</span>
            <el-input v-model="keyword" placeholder="请输入姓名" clearable style="width: 160px;"></el-input>
            <span class="filter-label">状态</span>
            <el-select v-model="statusFilter" placeholder="全部" style="width: 130px;">
                <el-option label="全部" value="all"></el-option>
                <el-option label="正常" value="正常"></el-option>
                <el-option label="待审核" value="待审核"></el-option>
                <el-option label="已停用" value="已停用"></el-option>
            </el-select>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onRest">重置</el-button>
        </div>
        <div class="toolbar">
            <el-button type="primary" @click="openCreate" >  新增用户</el-button>
            <el-button type="danger" @click="onBatchDelete" :disabled="selected.length === 0">批量删除{{ selected.length }}</el-button>
        </div>
        <el-table v-loading="loading" :data="users" border style="width: 100%;" @selection-change="onSelectionChange">
            <template #empty>
                <p class="empty">没有符合条件的用户，换个条件试试。</p>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id"  label="ID" width="80"></el-table-column>
            <el-table-column prop="name"  label="姓名" width="120"></el-table-column>
            <el-table-column prop="email"  label="邮箱" min-width="200"></el-table-column>
            <el-table-column label="状态" width="100">
                <template #default="scope">
                    <el-tag :type="statusType(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="角色" width="100">
                <template #default="scope">
                    <el-tag :type="roleType(scope.row.role)" size="small">{{ scope.row.role }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="170"></el-table-column>
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button link type="primary" @click="openEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="你确定要删掉这一行吗？" @confirm="onDelete(scope.row)">
                        <template #reference>
                            <el-button link type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
            <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="角色" prop="role">
                <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%;">
                    <el-option label="管理员" value="管理员"></el-option>
                    <el-option label="编辑" value="编辑"></el-option>
                    <el-option label="普通用户" value="普通用户"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
                    <el-option label="正常" value="正常"></el-option>
                    <el-option label="待审核" value="待审核"></el-option>
                    <el-option label="已停用" value="已停用"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </template>
        </el-dialog>
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
        />
        <p class="tip">当前在第 {{ page }} 页（共 {{ Math.ceil(total / pageSize) }} 页）</p>
    </section>
</template>

<style scoped>
.page{
    padding: 4px;
}
.tip{
    color: var(--text-2);          
    font-size: var(--fs-sm);
}
.err{
  color: var(--danger);     
  font-size: var(--fs-sm);
  margin-bottom: var(--sp-2);
}
.toolbar {
  display: flex;
  justify-content: flex-end;   
  margin-bottom: var(--sp-3);  
}
.filters{
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
}
.filter-label{
    font-size: var(--fs-sm);
    color: var(--text-2);
    white-space: nowrap;          
}
.empty{
    color: var(--text-2);          
    font-size: var(--fs-sm);
    padding: var(--sp-4) 0;
}

@media (max-width: 900px) {
  .page { overflow-x: auto; }
  .filters { flex-wrap: wrap; }    
}

.page :deep(.el-table th.el-table__cell > .cell){
    color: var(--text-2);                 
}

.page :deep(.el-pager li.is-active){
    color: var(--primary-d);              
}
</style>
