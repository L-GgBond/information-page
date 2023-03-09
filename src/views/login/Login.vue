<template>
    <div class="login_container">
       <div class="login_box">
           <div class="avatar_box">
               <img src="../assets/logo.svg" alt="">
            </div> 
            <el-form ref="loginformref" label-width="0px" class="login_form">
                <el-form-item>
                     <el-input v-model="form.username" :prefix-icon="User" ></el-input>
                </el-form-item> 

                <el-form-item>
                     <el-input v-model="form.password" :prefix-icon="Lock" type="password" show-password></el-input>
                </el-form-item> 
    
                <el-form-item class="btns">
                      <el-button type="primary" @click="doLogin" :loading="loading">提交</el-button>
                       <el-button type="info" @click="resetting">重置</el-button>
                </el-form-item> 
            </el-form>
       </div>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue'
import { toast } from '~/utils/common'
import { User,Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { setToken } from '~/utils/auth'

const router = useRouter()
const form = reactive({
    username: '',
    password: '',
})
const loading = ref(false)
const doLogin = function () {
    console.log("登陆")
    setToken('123')
    loading.value = true
    console.log(form.username)
    console.log(form.password)
    router.push('/')
    loading.value = false
}

const resetting = function () {
    console.log("重置")
    form.username = ''
    form.password = ''
}

</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height:100%
}
.login_box{
    width:450px;
    height:300px;
    background-color:#fff;
    border-radius:3px;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    .avatar_box{
        height:130px;
        width:130px;
        border:1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow:0 0 10px #ddd;
        position:absolute;
        left:50%;
        transform:translate(-50%,-50%);
        background-color:#fff;
       img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.btns{
    // display:flex;
    // justify-content: flex-end;
    float: right;
}
.login_form{
    position: absolute;
    bottom: 0;
    width:100%;
    padding:0 20px;
    box-sizing: border-box;
}

</style>