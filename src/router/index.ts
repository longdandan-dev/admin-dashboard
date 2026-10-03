import { createRouter,createWebHistory } from "vue-router";
import UsersView from '../views/UsersView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/',redirect:'/users'},
        {path:'/users',component:UsersView},
        {path:'/dashboard',component:DashboardView},
    ],

})

export default router