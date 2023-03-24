<template>
    <div class="login_container">
       <div class="login_box">
           <div class="avatar_box">
               <img src="/src/assets/login/login.gif" alt="">
            </div> 
            <el-form ref="formRef" :rules="rules" :model="form" label-width="0px" class="login_form">
                <el-form-item  prop="username">
                     <el-input v-model="form.username" :prefix-icon="User" ></el-input>
                </el-form-item> 
                <el-form-item prop="password">
                     <el-input v-model="form.password" :prefix-icon="Lock" type="password" show-password></el-input>
                </el-form-item> 
                <el-form-item prop="type">
                    <el-select  v-model="form.type" placeholder="请选择角色" size="default">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
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
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const form = reactive({
  username:"admin",
  password:"123456"
})
const rules = {
    username:[
        { 
            required: true, 
            message: '用户名不能为空', 
            trigger: 'blur' 
        },
    ],
    password:[
        { 
            required: true, 
            message: '密码不能为空', 
            trigger: 'blur' 
        },
    ],
    type:[
        { 
            required: true, 
            message: '请选择类型', 
            trigger: 'blur' 
        },
    ]
}

const formRef = ref(null)
const loading = ref(false)
const doLogin = function () {
    console.log("登陆")
    formRef.value.validate((valid)=>{
        console.log(valid)
        if(!valid){
            return false
        }
        loading.value = true
        store.dispatch("login",form).then(res=>{
            if(res.code == 200){
                toast("登录成功")
                store.dispatch('getinfo')
                router.push("/index")
            }
        }).finally(()=>{
            loading.value = false
        })
    })
}

const resetting = function () {
    console.log("重置")
    form.username = ''
    form.password = ''
    form.type = ''
}

const type = ref('')
const options = [
  {
    value: 'teacher',
    label: '工作人员',
  },
  {
    value: 'student',
    label: '学生',
  },
]

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