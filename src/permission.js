import { router,addRoutes } from "~/router"
import { getToken } from "~/utils/auth"
import { 
    toast,
    showFullLoading,
    hideFullLoading
} from "~/utils/common"
import store from "~/store"

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
    if(token && !hasGetInfo){
        // let { menus } = await store.dispatch("getinfo")
        hasGetInfo = true

        let menus = [
            {
                "name":"后台面板",
                "icon":"help",
                "child":[{
                    "name":"主控台",
                    "icon":"home-filled",
                    "frontpath":"/"
                }]
            },
            {
                "name":"学生管理",
                "icon":"shopping-bag",
                "child":[{
                    "name":"学生列表",
                    "icon":"shopping-cart-full",
                    "frontpath":"/student/list"
                }]
            }
        ]
        // 动态添加路由
        hasNewRoutes = addRoutes(menus)
    }

    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : "") + " - 学生信息管理系统"
    document.title = title

    hasNewRoutes ? next(to.fullPath) : next()
})

// 全局后置守卫
router.afterEach((to, from) => hideFullLoading())