import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/404.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../layouts/admin.vue'),
      children:[
        {
          path: '/',
          component: () => import('../views/HomeView.vue'),
          meta:{
            title:"后台首页"
          }
        },
        {
          path: '/student/list',
          component: () => import('../views/student/list.vue'),
          meta:{
            title:"后台首页"
          }
        }
      ]
    }
  ]
})

export default router
