<template>
    <div class="menu"  :style="{width:$store.state.asideWidth}">
        <el-menu :default-active="defaultActive" unique-opened :collapse="isCollapse" default-active="2" class="border-0" @select="handleSelect" :collapse-transition="false">
            <template v-for="(item,index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2,index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                         <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
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

// const asideMenus = computed(()=>store.state.menus)
const asideMenus = [
    {
        "name":"主控台",
        "icon":"help",
        "icon":"home-filled",
        "frontpath":"/"
      
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
    background-color:rgba(253, 253, 253, var(--tw-bg-opacity));
    @apply shadow-md fixed;
}
.f-menu::-webkit-scrollbar{
    width: 0px;
}

</style>