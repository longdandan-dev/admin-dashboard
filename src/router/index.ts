import { createRouter,createWebHistory } from "vue-router";
import UsersView from '../views/UsersView.vue'
import AdminLayout from "../layouts/AdminLayout.vue";
import DashboardView from '../views/DashboardView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from "../views/LoginView.vue";
import { getToken } from "../utils/token";

const router = createRouter({
    history: createWebHistory(),
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