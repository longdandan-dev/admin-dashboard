import { createRouter,createWebHistory } from "vue-router";
import UsersView from '../views/UsersView.vue'
import AdminLayout from "../layouts/AdminLayout.vue";
import DashboardView from '../views/DashboardView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from "../views/LoginView.vue";
import { getToken } from "../utils/token";

const router = createRouter({
    // ⚠️ 必须带 base（M7-5 上线时踩到的坑）：
    //    线上部署在 /admin-dashboard/ 子路径下，而 Vite 会把配置里的 base 注入成 import.meta.env.BASE_URL
    //    （dev → '/'，打包 → '/admin-dashboard/'）。
    //    不写它的话：F5 或用深链接进来时，路由会把 '/admin-dashboard/users' 当成未知路径 → 落到兜底 404 页（白板）。
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:'/login',
            component:LoginView
        },
        {
            path:'/',
            component:AdminLayout,
            children:[
                {path:'',redirect:'/users'},
                {path:'users',component:UsersView},
                {path:'dashboard',component:DashboardView},
                // 兜底：必须放最后（路由是从上往下找第一个命中的，它能匹配一切）
                {path:':pathMatch(.*)*',component:NotFoundView},
            ]
        },
        
    ],
    

})

router.beforeEach((to)=>{
        const logged = !!getToken()
        const isLoginPage = to.path === '/login'

        if(!logged && !isLoginPage ) return '/login'
        if(logged && isLoginPage ) return '/users'
    })
export default router