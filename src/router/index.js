import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import VolteList from '../components/function/VolteList.vue'
import CurrList from '../components/function/CurrList.vue'
import TempList from '../components/function/TempList.vue'
import RightsList from '../components/admin/RightsList.vue'
import ElecTotal from '../components/function/ElecTotal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path:"/login",
    component:Login
  },
  {
    path:"/home",
    component:Home,
    redirect:"/welcome",
    children:[
      {path:"/welcome",component: Welcome,},
      {path:"/user",component: UserList,},
      {path:"/rights",component: RightsList,},
      {path:"/Volt",component: VolteList,},
      {path:"/Elec",component: CurrList,},
      {path:"/Temp",component: TempList,},
      {path:"/Func",component: ElecTotal,},
    ]

  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
// to将要访问，from从哪访问，next接着干 next（url）重定向到next
  if(to.path=='/login') return next();//访问首页就不拦截
  // 获取用户信息
  const userFlag = window.sessionStorage.getItem("user");
  if (!userFlag) return next('login'); // 无值，就重定向回到login页面
  next();

})

export default router
