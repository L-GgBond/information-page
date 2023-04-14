import { router,addRoutes } from "~/router"
import { getToken } from "~/utils/auth"
import { 
    toast,
    showFullLoading,
    hideFullLoading
} from "~/utils/common"
import store from "~/store"
import axios from '~/utils/request'
import { getinfo } from '~/api/manager.js'
import { ref,reactive } from 'vue'

let hasRoutes = store.state.hasRoutes
// 全局前置守卫
let hasGetInfo = false
router.beforeEach(async (to,from,next)=>{
    console.log("to",to)
    // 显示loading
    showFullLoading()
    const token = getToken()
    if(!token && to.path != "/login"){
        store.dispatch("logout")
        return next({ path:"/login" })
    }


    if(token && to.path == "/login"){
        toast("请勿重复登录","error")
        return next({ path:from.path ? from.path : "/" })
    }

    let hasNewRoutes = false
    if(token){
        let user = await store.dispatch("getUserInfo")
        if(user.statu == 0){
            toast("已被禁用登陆!","error")
            store.dispatch("logout")
            return next({ path:"/login" })
        }
        console.log("user",user)
        store.state.hasRoutes = 0
    }
    const navData  = ref([]);
    if(token && !hasGetInfo){
        if(hasRoutes.length != 0){
            next()
        }else{
            let { nav }  = await store.dispatch("getinfo")
            console.log(nav)
            hasGetInfo = true
            store.state.hasRoutes = 2
            // 动态添加路由
            hasNewRoutes = addRoutes(nav)
            next(to.fullPath)
        }
   
    }else{
        console.log("路由已存在")
        console.log(to.fullPath)
        next()
    }
    
    if(to.fullPath == "/login"){
        hasGetInfo = false
    }
    // console.log(to.fullPath)
    // 设置页面标题
    // let title = (to.meta.title ? to.meta.title : "") + "信息管理系统"
    let title =  "信息管理系统"
    document.title = title
   
})

// 全局后置守卫
router.afterEach((to, from) => hideFullLoading())