
<template>
    <div class="header">
        <span class="logo">
            <el-icon class="mr-1"><Compass /></el-icon>
            考评管理系统
        </span>

        <el-icon class="icon-btn" content="折叠" @click="$store.commit('handleAsideWidth')">
            <fold v-if="$store.state.asideWidth == '250px'"/>
            <Expand v-else/>
        </el-icon>


        <el-tooltip effect="dark" content="刷新" placement="top-start">
            <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
        </el-tooltip>
        
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="top-start">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <div class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="logo" />
                     admin
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </div>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="Repassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useLogout } from '~/utils/UseManager'

const { isFullscreen, toggle } = useFullscreen()
const logo = ref("https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png")

const {
    handleLogout
} = useLogout()
const handleCommand = (e)=>{
    console.log(e)
    switch (e) {
        case "Repassword":
            console.log("修改密码")
            break;
    
        case "logout":
            console.log("退出登陆")
            handleLogout()
            break;
    }
}


const handleRefresh = ()=> location.reload() 
</script>
<style>


.header{
    @apply flex items-center text-light-50 fixed top-0 right-0 left-0;
    height: 64px;
    background-color: lightseagreen;
}
.logo{
    width: 250px;
    @apply flex justify-center items-center text-xl;
}
.icon-btn{
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}
.icon-btn:hover{
    /* @apply bg-indigo-600; */
}
.header .dropdown{
   
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}

</style>