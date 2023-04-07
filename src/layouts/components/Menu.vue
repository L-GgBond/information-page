<template>
    <div class="menu"  :style="{width:$store.state.asideWidth}">
        <el-menu :default-active="this.$store.state.editableTabsValue" class="border-0" unique-opened="true">
            <router-link to="/index">
                <!-- @click="selectMenu({name:'index',title:'首页'})" -->
                <el-menu-item index="index"  >
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
                        <!-- @click="selectMenu(item)" -->
                        <el-menu-item :index="item.name" >
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
const defaultActive = ref(route.path)

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


// function selectMenu(item){
//     console.log('item',item)
//     store.commit('addTab',item)
// }
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