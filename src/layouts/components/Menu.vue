<template>
    <div class="menu">
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
import { useRouter,useRoute,onBeforeRouteUpdate } from 'vue-router';
const router = useRouter()
const route = useRoute()

const asideMenus = [
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


const handleSelect = (e) => {
    console.log(e)
    router.push(e)
}
</script>
<style>
.menu{
    width: 250px;
    top:64px;
    bottom: 0;
    left:0;
    overflow: auto;
    background-color:rgba(253, 253, 253, var(--tw-bg-opacity));
    @apply shadow-md fixed;
}
</style>