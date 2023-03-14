import { router,addRoutes } from "~/router"
import { getToken } from "~/utils/auth"
import { 
    toast,
    showFullLoading,
    hideFullLoading
} from "~/utils/common"
import store from "~/store"
import axios from '~/utils/request'


let hasRoutes = store.state.hasRoutes
// 全局前置守卫
let hasGetInfo = false
router.beforeEach(async (to,from,next)=>{
    console.log(1)
    // 显示loading
    showFullLoading()
    
    const token = getToken()

    // 没有登录，强制跳转回登录页
    if(!token && to.path != "/login"){
        toast("请先登录","error")
        return next({ path:"/login" })
    }

    // 防止重复登录
    if(token && to.path == "/login"){
        toast("请勿重复登录","error")
        return next({ path:from.path ? from.path : "/" })
    }

    // 如果用户登录了，自动获取用户信息，并存储在vuex当中
    let hasNewRoutes = false
    if(token){
        await store.dispatch("getUserInfo")
    }
    if(token && !hasGetInfo){
        if(hasRoutes.length != 0){
            next()
        }else{
            let { nav }  = await store.dispatch("getinfo")
            hasGetInfo = true
            store.state.hasRoutes = 2
            // 动态添加路由
            hasNewRoutes = addRoutes(nav)
            next(to.fullPath)
        }
   
    }else{
        console.log("已经有路由了------------")
        next()
    }
    // console.log(to.fullPath)
    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : "") + "信息管理系统"
    // document.title = title
   
})



// 全局后置守卫
router.afterEach((to, from) => hideFullLoading())