
<template>
    <div class="header">
        <span class="logo">
            <!-- <el-icon class="mr-1"><Compass /></el-icon> -->
            考评管理系统
        </span>
        <el-icon class="icon-btn" content="折叠" @click="$store.commit('handleAsideWidth')" style="margin-left:60px">
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
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    <!-- <el-avatar class="mr-2" :size="25" src="/src/assets/login/user.jpeg" /> -->
                     {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </div>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="individual">个人信息</el-dropdown-item>
                    <el-dropdown-item command="Repassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    
    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px"  class="formDrawer">
            <el-form-item prop="currentPass" label="旧密码">
                <el-input v-model="form.currentPass" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="checkPass" label="确认密码">
                <el-input type="password" v-model="form.checkPass" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
import { useFullscreen } from '@vueuse/core'
import { useLogout } from '~/utils/UseManager'
import { updatePassword,logout } from '~/api/manager'
import { toast } from '~/utils/common'
import store  from '~/store/index.js'
import { useRouter } from 'vue-router' 

const router = useRouter()
const { isFullscreen, toggle } = useFullscreen()
const logo = ref("https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png")

const formDrawerRef = ref(null)
const form = reactive({
    currentPass:"",
    password:"",
    checkPass:"",
})
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== form.password) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
};
const rules = {
    currentPass :[
        { 
            required: true, 
            message: '旧密码不能为空', 
            trigger: 'blur' 
        },
    ],
    password:[
        { 
            required: true, 
            message: '新密码不能为空', 
            trigger: 'blur' 
        },
    ],
    checkPass:[
        { 
            required: true, 
            validator: validatePass,
            trigger: 'blur' 
        },
    ]
}
const formRef = ref(null)
const loading = ref(false)
const onSubmit = function () {
console.log("修改密码")
formRef.value.validate((valid)=>{
        console.log(valid)
        if(!valid){
            return false
        }
        loading.value = true
        updatePassword(form).then(res =>{
            console.log(res)
            if(res.code == 200){
                toast("修改密码成功")
                store.dispatch("logout")
                router.push('/login')
            }
           
        }).finally(()=>{
            loading.value = false
        })
       

    })
}
 
const {
    handleLogout
} = useLogout()
const showDrawer = ref(false)
const handleCommand = (e)=>{
    console.log(e)
    switch (e) {
        case "Repassword":
            formDrawerRef.value.open()
            console.log("修改密码")
            break;
    
        case "logout":
            console.log("退出登陆")
            logout()
            handleLogout()
            break;
            
        case "individual":
            console.log("个人信息")
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
    width: 170px;
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