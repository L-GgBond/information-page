import { createRouter, createWebHistory,createWebHashHistory} from 'vue-router'


// 默认路由，所有用户共享
const routes = [
  {
      path: "/",
      name:"admin",
      component: import('../layouts/admin.vue'),
  },
  {
      path: "/login",
      component: import('../views/login/Login.vue'),
      meta: {
          title: "登录页"
      }
  }, 
  {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: import('../views/404.vue')
  }
]


// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path:"/",
    name:"/",
    component:import('../views/index.vue'),
    meta: {
        title: "主控台"
    }
  },
  {
    path: '/student/list',
    component: () => import('../views/student/list.vue'),
    meta: {
        title: "学生列表"
    }
  }
]


export  const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 动态添加路由的方法
export  function addRoutes(menus){
  console.log(menus)
  // 是否有新的路由
  let hasNewRoutes = false
  const findAndAddRoutesByMenus = (arr) =>{
      arr.forEach(e=>{
          let item = asyncRoutes.find(o=>o.path == e.frontpath)
          if(item && !router.hasRoute(item.path)){
              router.addRoute("admin",item)
              hasNewRoutes = true
          }
          if(e.child && e.child.length > 0){
              findAndAddRoutesByMenus(e.child)
          }
      })
  }

  findAndAddRoutesByMenus(menus)

  return hasNewRoutes
}