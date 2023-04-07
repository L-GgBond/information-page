<template>
    <el-card shadow="never" class="border-0" style="position: relative;">
        <ListHeader @create="handleCreate" @refresh="getData"/>
        <el-form ref="searchRef" :model="searchModel" :rules="searchRules" :inline="true"  class="demo-form-inline">
            <el-form-item label="姓名" prop="searchNickname">
                <el-input v-model="searchModel.searchNickname" placeholder="请输入姓名"  />
            </el-form-item>
            <el-form-item>
                <el-button type="success"  @click="onSearchSubmit">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData"  style="width: 1100px;top: 20px;" v-loading="loading" >
            <el-table-column prop="id"  label="#" />
            <el-table-column  prop="username" label="账号"  width="150px"/>
            <el-table-column label="头像"  width="120px">
                <template #default="scope">
                    <el-avatar :size="50" :src="scope.row.avatar" />
                    <!-- <el-image
                    style="width:50px;border-radius: 50%;"
                    :src="scope.row.avatar"
                    :zoom-rate="1.2"
                    :preview-src-list="[scope.row.avatar]"
                    :initial-index="4"
                    fit="cover"
                    /> -->
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="姓名"  width="120px"/>
            <el-table-column  label="性别"  width="120px">
                <template #default="scope">
                    <el-text v-if="scope.row.sex == 1">男</el-text>
                    <el-text v-else>女</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年纪"  width="120px" />

            <el-table-column v-if="$store.state.user.id == 1" prop="classname" label="班级"  width="120px" />
            <el-table-column prop="nation" label="民族"  width="120px"/>
            <el-table-column prop="city" label="住址"   width="150px"/>
            <el-table-column prop="email" label="联系方式" width="150px" />
            <el-table-column prop="rolename" label="角色"  width="120px">
                <template #default="scope">
                    <el-tag >{{ scope.row.rolename }}</el-tag>  
                </template>
            </el-table-column>
            <el-table-column prop="duration" label="学年时长"  width="120px"/>
            <el-table-column prop="politics" label="政治面貌"  width="120px"/>
            <el-table-column prop="statu" label="状态">
                <template #default="scope">
                    <el-tag class="ml-2" v-if="scope.row.statu == 1" type="success">正常</el-tag>
                    <el-tag class="ml-2" v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            
            <el-table-column fixed="right" label="操作" width="160">
                <template #default="scope">
                <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                <el-popconfirm title="是否要删除？" confirmButtonText="确认" cancelButtonText="取消"
                    @confirm="handleDelete(scope.row.id)">
                    <template #reference>
                        <el-button type="danger" size="small" text >删除</el-button>
                    </template>
                </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
       
        <div class="pages" style="">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 15, 20, 25, 30]"
                    :current-page="current"
                    :page-size="size"
                    :total="total">
            </el-pagination>
        </div>
    </el-card>

    <form-drawer ref="formDrawerRef" :title="drawerTitle" size="45%" destroyOnClose @submit="handleDrawerSubmit" >
        <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" 
        class="demo-ruleForm"   :size="formSize" status-icon>
        <el-form-item label="头像" prop="avatar">
            <el-upload :action="RequestUploads" list-type="picture-card" multiple="false" name="f" :limit=1 
            :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :class="{hide:hideUpload}" :on-progress="uploadOnChange"
            :before-remove="handeleAvatarDelete">
            <el-icon :class="{icons:Isicons}" ><Plus /></el-icon>
                <!-- <template> -->
                    <div>
                        <!-- <img class="el-upload-list__item-thumbnail" :src="avatar" alt="" /> -->
                        <img :class="['el-upload-list__item-thumbnail',{uploadImg:uploadImgs}]" :src="avatar" alt="" />
                    </div>
                <!-- </template> -->
            </el-upload>
         </el-form-item>


            <el-form-item label="学号" prop="username">
                <el-input v-model="formModel.username" />
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
                <el-input v-model="formModel.nickname" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <!-- <el-select v-model="formModel.sex" placeholder="请选择性别">
                        <el-option label="男" value="1" />
                        <el-option label="女" value="0" /> -->

                        <el-radio-group v-model="formModel.sex">
                            <el-radio  label="男">男</el-radio>
                            <el-radio  label="女">女</el-radio>
                         </el-radio-group>
                <!-- </el-select> -->
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input type="number" v-model="formModel.age" />
            </el-form-item>
            <el-form-item label="民族" prop="nation">
                <el-input v-model="formModel.nation" />
            </el-form-item>
            <el-form-item label="住址" prop="city">
                <el-input v-model="formModel.city" />
            </el-form-item>
            <el-form-item label="联系方式" prop="email">
                <el-input v-model="formModel.email" />
            </el-form-item>
            <el-form-item label="班级" prop="classname">
                <!-- <el-select v-model="formModel.classname" placeholder="请选择班级">
                    <template v-for="(item,index) in classData">
                        <el-option :label="item.classname" :value="item.classname" />
                    </template>
                </el-select> -->

                <el-radio-group v-for="(item,index) in classData" v-model="formModel.classname">
                    <el-radio style="margin-right:15px" :label="item.classname" >{{item.classname}}</el-radio>
                </el-radio-group>

            </el-form-item>



            <el-form-item label="角色权限" prop="roleid">
                <!-- <el-select v-model="formModel.roleid" placeholder="请选择角色权限">
                    <template v-for="(item,index) in roleData">
                        <el-option :label="item.name" :value="item.id" />
                    </template>
                </el-select> -->
                <el-radio-group v-for="(item,index) in roleData" v-model="formModel.roleid">
                    <el-radio style="margin-right:10px" :label="item.id" v-if="item.name != '学生'" disabled >{{item.name}}</el-radio>
                    <el-radio style="margin-right:10px" :label="item.id" v-else>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="学年时间" prop="duration">
                <el-input type="number" v-model="formModel.duration" />
            </el-form-item>
            <el-form-item label="政治面貌" prop="politics">
                <el-input v-model="formModel.politics" />
            </el-form-item>

            <el-form-item label="状态" prop="statu">
                <!-- <el-select v-model="formModel.statu" placeholder="请选择状态">
                        <el-option label="正常" value="1" />
                        <el-option label="禁用" value="0" />
                </el-select> -->
                <el-radio-group v-model="formModel.statu">
                    <el-radio style="margin-right:10px" label="正常" >正常</el-radio>
                    <el-radio style="margin-right:10px" label="禁用" >禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import UploadFile  from 'element-plus'
import store from '~/store'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestListData, RequestSaveData, RequestInfoData, RequestUpdateData, RequestDeleteData, RequestClassListData, RequestRoleListData } from '~/api/student.js'
import { RequestUploads } from '~/api/uploads.js'
 
const Isicons =ref(true)
const uploadImgs = ref(true)
const hideUpload = ref(false)
const avatar = ref()
const handleAvatarSuccess =(file) =>{
 console.log(file)
  if(file.code == 200){
    toast("上传成功")
    formModel.avatar = file.data
    avatar.value = file.data
  }
}
const handleAvataError =(file) =>{
 console.log(file)
    toast("上传失败","error")
}
const uploadOnChange =(file,fileList) =>{
    hideUpload.value = true;
}
const handeleAvatarDelete=(file) =>{
    console.log(file)
    hideUpload.value = false;
}
const current = ref(1)
const size = ref(5)
const total = ref(1)
const handleSizeChange = (val) =>{
    console.log(`每页 ${val} 条`)
    size.value = val
    getListTableData()
}
const handleCurrentChange = (val) =>{
    current.value = val
    getListTableData()
    console.log(`当前页: ${val}`)
}

const searchRef = ref(null)
const searchModel = reactive({
    "searchNickname":""
})
const searchRules = {
    searchNickname:[ { required: true, message: '请输入姓名', trigger: 'blur' } ]
}
const onSearchSubmit = ()=>{
    getListTableData()
    searchModel.searchNickname = ""
}
const getData = () =>{
    getListTableData()
}

console.log("id",store.state.user.id)
//获取列表
const tableData = ref([])
const getListTableData = ()=>{
    RequestListData(current.value, size.value, "student", searchModel.searchNickname,store.state.user.id).then(res =>{
        console.log(res)
        if(res.code == 200){
            tableData.value = res.data.records
            total.value = res.data.total
        }
    })
}
getListTableData()

const classData = ref([])
const roleData = ref([])
const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formDrawerRef = ref(null)
const formRef = ref(null)
const handleCreate = ()=> {
     ResetFields(); 
     if(avatar.value == "" || avatar.value == undefined){
        Isicons.value = false
        uploadImgs.value = true
    }else{
        Isicons.value = true
        uploadImgs.value = false
    }
     ID.value = 0;
     formDrawerRef.value.open() 

     RequestClassListData(store.state.user.id).then(res=>{
        console.log(res)
        if(res.code == 200){
            classData.value = [];// res.data
            const arr = [];
            for(var i = 0; i < res.data.length;i++){
                // console.log(res.data[i])
                if(res.data[i].hasOwnProperty("id")){
                    console.log("存在")
                    classData.value = res.data
                }else{
                    console.log("不存在")
                    arr.push({"id":res.data[i][0],"classname":res.data[i][1]})
                    classData.value = arr
                    console.log(arr)
                }
            }
           
        }
     })
     RequestRoleListData().then(res=>{
        console.log(res)
        if(res.code == 200){
            roleData.value = res.data
        }
     })
}
const roleid = ref(null);
const formModel = reactive({
    "id":'',
    "username":'',
    "nickname":'',
    "sex":'',
    "nation":'',
    "city":'',
    "classid":'',
    "roleid":'',
    "classname":'',
    "duration":'',
    "politics":'',
    "email":'',
    "avatar":'',
    "age":'',
    "email":'',
    "statu":'1',
    "types":'student',
})
const formRules = {
    username: [ { required: true, message: '请输入账号', trigger: 'blur' } ],
    username: [ { min:6 , message: '账号至少是六位', trigger: 'blur' } ],
    nickname: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
    sex: [ { required: true, message: '请选择性别', trigger: 'blur' } ],
    nation: [ { required: true, message: '请输入民族', trigger: 'blur' } ],
    classname: [ { required: true, message: '请选择班级', trigger: 'blur' } ],
    roleid: [ { required: true, message: '请选择角色', trigger: 'blur' } ],
    age: [ { required: true, message: '请输入年龄', trigger: 'blur' } ],
    city: [ { required: true, message: '请输入城市', trigger: 'blur' } ],
    duration: [ { required: true, message: '请输入学年时长', trigger: 'blur' } ],
    politics: [ { required: true, message: '请输入政治面貌', trigger: 'blur' } ],
    email: [ { required: true, message: '请输入联系方式', trigger: 'blur' } ],
}
const ResetFields = () =>{
    formModel.id = ""
    formModel.username = ""
    formModel.nickname = ""
    formModel.sex = ""
    formModel.nation = ""
    formModel.city = ""
    formModel.classid = ""
    formModel.roleid = ""
    roleid.value = ""
    formModel.classname = ""
    formModel.duration = ""
    formModel.politics = ""
    formModel.email = ""
    formModel.avatar = ""
    formModel.age = ""
    formModel.email = ""
    avatar.value = ""

}

//详情
const handleEdit = (row) => {
    console.log(row.id)
    ID.value = row.id
    RequestClassListData(store.state.user.id).then(res=>{
        console.log(res)
        if(res.code == 200){
            classData.value = [];// res.data
            const arr = [];
            for(var i = 0; i < res.data.length;i++){
                // console.log(res.data[i])
                if(res.data[i].hasOwnProperty("id")){
                    console.log("存在")
                    classData.value = res.data
                }else{
                    console.log("不存在")
                    arr.push({"id":res.data[i][0],"classname":res.data[i][1]})
                    classData.value = arr
                    console.log(arr)
                }
            }
           
        }
     })
     RequestRoleListData().then(res=>{
        console.log(res)
        if(res.code == 200){
            roleData.value = res.data
        }
     })
    RequestInfoData(row.id).then(res=>{
        if(res.code == 200){
            formDrawerRef.value.open()
            formModel.id = res.data.id
            formModel.username = res.data.username
            formModel.nickname = res.data.nickname
            formModel.sex = res.data.sex ? "男" : "女"
            formModel.nation = res.data.nation
            formModel.city = res.data.city
            formModel.classid = res.data.classid
            formModel.roleid = res.data.roleid
            roleid.value = res.data.roleid
            formModel.classname = res.data.classname
            formModel.duration = res.data.duration
            formModel.politics = res.data.politics
            formModel.email = res.data.email
            avatar.value = res.data.avatar
            formModel.avatar = res.data.avatar
            formModel.age = res.data.age
            formModel.email = res.data.email
            formModel.statu = res.data.statu ? "正常" : "禁用"
        }
        if(avatar.value == "" || avatar.value == undefined){
                Isicons.value = false
                uploadImgs.value = true
            }else{
                Isicons.value = true
                uploadImgs.value = false
        }
    })
    
}
const handleDrawerSubmit = () => {
    formRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            formDrawerRef.value.showLoading()
            if(formModel.statu == "正常"){
                formModel.statu = 1
            }else if(formModel.statu == "禁用"){
                formModel.statu = 0
            }
            if(formModel.sex == "男"){
                formModel.sex = 1
            }else if(formModel.sex == "女"){
                formModel.sex = 0
            }
            const fun = ID.value ? RequestUpdateData(formModel) : RequestSaveData(formModel)
            fun.then(res=>{
                console.log(res)
                if(res.code == 200){
                    toast("操作成功")
                    ResetFields()
                    formDrawerRef.value.close()
                    getListTableData()
                }
            }).finally(() => {
                formDrawerRef.value.hideLoading()
            })
        }
    })
}

const handleDelete =(id) =>{
    console.log(id)
    RequestDeleteData(id).then(res=>{
        if(res.code == 200){
            toast("删除成功")
            getListTableData()
        }
    })
}
</script>
<style>
    .pages{
        float: right;
        @apply mt-6 mb-6;
    }
    .el-upload--picture-card{
        /* display: none !important; */
    }
    .hide .el-upload--picture-card{
        display: none;
    }

    .demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.icons{
        display: none;
    }
.uploadImg{
    display: none;
}
</style>