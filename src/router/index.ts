import { createRouter,createWebHistory } from "vue-router";
import UsersView from '../views/UsersView.vue'
import DashboardView from '../views/DashboardView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/',redirect:'/users'},
        {path:'/users',component:UsersView},
        {path:'/dashboard',component:DashboardView},
        // 兜底：必须放最后（路由是从上往下找第一个命中的，它能匹配一切）
        {path:'/:pathMatch(.*)*',component:NotFoundView},
    ],

})

export default router