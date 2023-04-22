import { createRouter, createWebHistory,createWebHashHistory} from 'vue-router'
let modules = import.meta.glob("../views/**/*.vue");
console.log(modules);
import Index from '../views/index.vue'
import KM from '../views/tea/Km.vue'
import Assignment from '../views/tea/Assignment.vue'
import TaskList from '../views/task/List.vue'
import SubmitList from '../views/tea/SubmitList.vue'

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
            path: '/tea/teakm',
            name: 'TeaKm',
            meta: {
                title: "科目列"
            },
            component: KM
        },
        {
            path: '/tea/assignment',
            name: 'Assignment',
            meta: {
                title: "作业目列"
            },
            component: Assignment
        },
        {
            path: '/tea/tasklist',
            name: 'Tasklist',
            meta: {
                title: "作业信息"
            },
            component: TaskList
        },
        {
            path: '/tea/submitlist',
            name: 'SubmitList',
            meta: {
                title: "用户提交列表"
            },
            component: SubmitList
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