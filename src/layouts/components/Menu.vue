<template>
    <div class="menu"  :style="{width:$store.state.asideWidth}">
        <el-menu default-active="1" class="border-0" unique-opened="true">
            <router-link to="/index">
                <el-menu-item index="1">
                    <el-icon><House /></el-icon>
                    <span>首页</span>
                </el-menu-item>
            </router-link>
        
        <template v-for="menu in asideMenus" :key="menu.id">
            <el-sub-menu  :default-active="menu.id" :index="menu.name" >
                <template #title>
                    <el-icon>
                        <component :is="menu.icon"></component>
                    </el-icon>
                    <span>{{menu.title}}</span>
                </template>
                <router-link :to="item.path" v-for="item in menu.children">
                    <el-menu-item :index="item.name">
                        <template #title>
                            <el-icon> <component :is="item.icon"></component></el-icon>
                            <span>{{item.title}}</span>
                        </template>
                    </el-menu-item>
                </router-link>
            </el-sub-menu>
        </template>    
      </el-menu>
    </div>
</template>
<script setup>
import { computed,ref } from 'vue';
import { useRouter,useRoute,onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter()
const route = useRoute()
const store = useStore()
console.log(store.state.asideWidth)

// 默认选中
const defaultActive = ref(route.path)

// 监听路由变化
onBeforeRouteUpdate((to,from)=>{
    defaultActive.value = to.path
})

// 是否折叠
const isCollapse = computed(()=> !(store.state.asideWidth == '250px'))

const asideMenus = computed(()=> store.state.menus)


const handleSelect = (e) => {
    console.log(e)
    router.push(e)
}
</script>
<style>
.menu{
    /* width: 250px; */
    top:64px;
    bottom: 0;
    left:0;
    overflow: auto;
    background-color:#fff;
    @apply shadow-md fixed;
}
.f-menu::-webkit-scrollbar{
    width: 0px;
}

</style>