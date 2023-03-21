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
    console.log(store.state.user.length)
    console.log(token)
    if(!token && to.path != "/login"){
        store.dispatch("logout")
        return next({ path:"/login" })
    }
    // else if(token && !store.state.user.length){
    //     console.log("登陆失效")
    //     store.dispatch("logout")
    //     return next({ path:"/login" })
    // }

    if(token && to.path == "/login"){
        toast("请勿重复登录","error")
        return next({ path:from.path ? from.path : "/" })
    }

  

    let hasNewRoutes = false
    if(token){
        console.log(1111)
        let user  = await store.dispatch("getUserInfo")
        // if(!user){
        //     store.dispatch("logout")
        // }
        // console.log("user",user)
        store.state.hasRoutes = 0
        // let { nav }  = await store.dispatch("getinfo")
        // hasNewRoutes = addRoutes(nav)
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
        console.log("路由已存在")
        next()
    }
    
    // console.log(to.fullPath)
    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : "") + "信息管理系统"
    document.title = title
   
})

// 全局后置守卫
router.afterEach((to, from) => hideFullLoading())