import { createRouter, createWebHistory,createWebHashHistory} from 'vue-router'
let modules = import.meta.glob("../views/**/*.vue");
console.log(modules);
import Index from '../views/index.vue'
import Test from '../views/test.vue'

// 默认路由，所有用户共享
const routes = [
  {
      path: "/",
      name:"admin",
      component: import('../layouts/admin.vue'),
      children:[
        {
            path: '/index',
            name: 'Index',
            meta: {
                title: "首页"
            },
            component: Index
        },
        {
            path: '/test',
            name: 'Test',
            meta: {
                title: "1"
            },
            component: Test
        }
    ]
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

export  const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 动态添加路由的方法
export function addRoutes(nav) {
  nav.forEach(item => {
      if (item.component) {
          router.addRoute('admin',{
              path: item.path,
              name: item.name,
              icon: item.icon,
              component: modules[`../views/${item.component}.vue`],
          });
      }
      if (item.children && item.children.length) {
          addRoutes(item.children);
      }
  })
}