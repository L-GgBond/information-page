import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { router } from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import './assets/main.css'
import 'virtual:windi.css'

import "nprogress/nprogress.css"
import "./permission"

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


// import '../public/UE/ueditor.config.js'
// import "../public/UE/ueditor.all.min.js"
// import "../public/UE/lang/zh-cn/zh-cn.js"
// import "../public/resource/UEditor/ueditor.parse.min.js"
import VueUeditorWrap from 'vue-ueditor-wrap'
app.component('vue-ueditor-wrap', VueUeditorWrap)
// import * as echarts from "echarts"
// app.config.globalProperties.$echarts = echarts
import locale from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {locale})
app.use(store)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
