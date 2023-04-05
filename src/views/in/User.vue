<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleRoleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="#" />
            <el-table-column label="头像">
                <template #default="scope">
                    <el-avatar :size="50" :src="scope.row.avatar" />
                </template>
            </el-table-column>
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="nickname" label="姓名" />
            <el-table-column prop="email" label="联系方式" />
            <el-table-column label="角色名称">
                <template #default="scope">
                    <el-tag class="mt-1" size="small" style="margin-right:5px" type="default" v-for="item in scope.row.inRoles">{{ item.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="statu" label="状态">
                <template #default="scope">
                    <el-tag class="ml-2" v-if="scope.row.statu == 1" type="success">正常</el-tag>
                    <el-tag class="ml-2" v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                <el-button type="warning" size="small" v-if="scope.row.id != 1" text @click="handleRoleAccact(scope.row)">分配角色</el-button>
                <el-button type="primary" size="small" text @click="handleRoleEdit(scope.row)">修改</el-button>
               
                <el-popconfirm title="是否要删除？" v-if="scope.row.id != 1" confirmButtonText="确认" cancelButtonText="取消"
                    @confirm="handleDelete(scope.row.id)">
                    <template #reference>
                        <el-button text type="danger" size="small">删除</el-button>
                    </template>
                </el-popconfirm>


                </template>
            </el-table-column>
        </el-table>

        <div class="pages">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 20, 30]"
                    :current-page="current"
                    :page-size="size"
                    :total="total">
            </el-pagination>
        </div>
    </el-card>

    <form-drawer ref="formRoleDrawerRef" :title="drawerTitle" size="45%" destroyOnClose @submit="handleRoleDrawerSubmit" >
        <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" 
        class="demo-ruleForm"   :size="formSize" status-icon>
        <el-form-item label="头像" prop="avatar">
            <el-upload :action="RequestUploads" list-type="picture-card" multiple="false" name="f" :limit=1 
            :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :class="{hide:hideUpload}" :on-progress="uploadOnChange">
                <el-icon :class="{icons:Isicons}" ><Plus /></el-icon>
                <!-- <template> -->
                    <div>
                        <img :class="['el-upload-list__item-thumbnail',{uploadImg:uploadImgs}]" :src="avatar" alt="" />
                        <!-- <img class="el-upload-list__item-thumbnail" :src="avatar" alt="" /> -->
                    </div>
                    
                <!-- </template> -->
            </el-upload>
            <!-- <div>{{ avatar }}</div> -->
           

         </el-form-item>

         <el-form-item label="账号" prop="username">
            <el-input v-model="formModel.username" />
            <el-alert
                v-if="ID == 0"
                title="默认密码123456"
                type="info"
                close-text="知道了">
            </el-alert>
        </el-form-item>



        <el-form-item label="姓名" prop="nickname">
            <el-input v-model="formModel.nickname" />
        </el-form-item>
        <el-form-item label="联系方式" prop="email">
            <el-input v-model="formModel.email" />
        </el-form-item>
        <el-form-item label="班级" prop="classid">
            <el-select v-model="formModel.classid" placeholder="请选择管理班级">
                <template v-for="(item,index) in classData">
                    <el-option :label="item.classname" :value="item.id" />
                </template>
            </el-select>
        </el-form-item>


        <el-form-item label="状态" prop="statu">
            <!-- <el-select v-model="formModel.statu" placeholder="请选择状态">
                    <el-option label="正常" value="1" />
                    <el-option label="禁用" value="0" />
            </el-select> -->
            <el-radio-group v-model="formModel.statu">
                <el-radio label="正常" value="1"></el-radio>
                <el-radio label="禁用" value="0"></el-radio>
            </el-radio-group>

        </el-form-item>
        </el-form>
    </form-drawer>

    <form-drawer ref="formRoleAccactDrawerRef" title="分配角色" size="45%" destroyOnClose @submit="handleRoleAccactDrawerSubmit" >
        <el-form ref="ruleRoleAccactFormRef">
            <el-tree
                :data="ThreeData"
                show-checkbox
                ref="roleTree"
                node-key="id"
                check-strictly="true"
                :props="{ label: 'name', children: 'children' }" default-expand-all="true" />
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import UploadFile  from 'element-plus'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import store from '~/store'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { getUserListData,getUserSaveData,getUserUpdateData,getUserDeleteData,getUserUpdateDataInfo,getUserRole,getUserClass} from '~/api/user.js'
import { getRoleListData } from "~/api/role.js"
import { RequestUploads } from '~/api/uploads.js'
import { RequestRoleListData } from '~/api/student.js'

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

const current = ref(1)
const size = ref(5)
const total = ref(1)
console.log(store.state.user.types)
const handleSizeChange = (val) =>{
    console.log(`每页 ${val} 条`)
    size.value = val
    getUserListTableData()
}
const handleCurrentChange = (val) =>{
    current.value = val
    getUserListTableData()
    console.log(`当前页: ${val}`)
}

const loading = ref(false)
const tableData = ref([])
const getUserListTableData = ()=>{
    loading.value = true
    getUserListData(current.value,size.value,store.state.user.types).then(res =>{
        console.log(res)
        if(res.code == 200){
            tableData.value = res.data.records
            size.value = res.data.size
            current.value = res.data.current
            total.value = res.data.total
        }
    }).finally(()=>{
        loading.value = false
    })
}
getUserListTableData()
const classData = ref([])
const getData =() => { getUserListTableData() }
const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formRoleDrawerRef = ref(null)
const ruleRoleFormRef = ref(null)
const formRef = ref()
const roleData = ref([])
const handleRoleCreate = ()=> { 
    getUserClass().then(res => {
        console.log(res)
        if(res.code == 200){
            classData.value = res.data
        }
    })
    ResetFields()
    console.log(avatar.value)
    if(avatar.value == "" || avatar.value == undefined){
        Isicons.value = false
        uploadImgs.value = true
    }else{
        Isicons.value = true
        uploadImgs.value = false
    }
   
    ID.value = 0;formRoleDrawerRef.value.open() 
    RequestRoleListData().then(res=>{
        console.log(res)
        if(res.code == 200){
            roleData.value = res.data
        }
     })
}


const formModel = reactive({
    "id":'',
    "username":'',
    "nickname":'',
    "classid":'',
    // "roleid":'',
    "email":'',
    "avatar":'',
    "email":'',
    "statu":'',
    "types":'teacher',
})
const formRules = {
    username: [ { required: true, message: '请输入账号', trigger: 'blur' }, { min:6 , message: '账号至少是六位', trigger: 'blur' } ],
    nickname: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
    // roleid: [ { required: true, message: '请选择角色', trigger: 'blur' } ],
    classid: [ { required: true, message: '请选择管理班级', trigger: 'blur' } ],
    email: [ { required: true, message: '请输入联系方式', trigger: 'blur' } ],
    statu: [ { required: true, message: '请选择状态', trigger: 'blur' } ],
}
const ResetFields = () =>{
    formModel.id = ""
    formModel.username = ""
    formModel.nickname = ""
    // formModel.roleid = ""
    formModel.email = ""
    formModel.avatar = ""
    formModel.classid = ""
    avatar.value = ""
}
const handleRoleEdit = (row) => {
    getUserClass().then(res => {
        console.log(res)
        if(res.code == 200){
            classData.value = res.data
        }
    })
    console.log(row.id)
    ID.value = row.id
    RequestRoleListData().then(res=>{
        console.log(res)
        if(res.code == 200){
            roleData.value = res.data
        }
     })
    getUserUpdateDataInfo(row.id).then(res=>{
        if(res.code == 200){
            formRoleDrawerRef.value.open()
            formModel.id = row.id
            formModel.username = row.username
            formModel.nickname = row.nickname
            // formModel.roleid = row.roleid
            formModel.classid = row.classid
            formModel.email = row.email
            formModel.avatar = row.avatar
            avatar.value = row.avatar
            formModel.statu = res.data.statu ? "正常" : "禁用"
            if(avatar.value == "" || avatar.value == undefined){
                Isicons.value = false
                uploadImgs.value = true
            }else{
                Isicons.value = true
                uploadImgs.value = false
            }
        }
    })
    
}





const handleRoleDrawerSubmit = () => {
    formRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            if(formModel.statu == "正常"){
                formModel.statu = 1
            }else if(formModel.statu == "禁用"){
                formModel.statu = 0
            }
            formRoleDrawerRef.value.showLoading()
            const fun = ID.value ? getUserUpdateData(formModel) : getUserSaveData(formModel)
            fun.then(res=>{
                console.log(res)
                if(res.code == 200){
                    formRoleDrawerRef.value.close()
                    toast("操作成功")
                    ResetFields()
                    getUserListTableData()
                    formRoleDrawerRef.value.hideLoading()
                }else{
                    loading.value = false
                }
            }).finally(() => {
                loading.value = false
                formDrawerRef.value.hideLoading()
            })
        }
    })
}

const handleDelete =(id) =>{
    console.log(id)
    var ids = []
    ids.push(id)
    getUserDeleteData(ids).then(res=>{
        if(res.code == 200){
            toast("删除成功")
            getUserListTableData()
        }
    })
}

//分配角色
const role_id = ref(null)
const ThreeData = ref([])
const defaultExpandedKeys = ref([])
const ruleRoleAccactFormRef = ref(null)
const formRoleAccactDrawerRef = ref(null)
const roleTree = ref(null);
const handleRoleAccact =(id) => {
    console.log(id.id)
    role_id.value = id.id
    getUserUpdateDataInfo(id.id).then(r => {
        console.log(r)
        console.log(roleTree)
        let roleIds = []
        r.data.inRoles.forEach(row =>{
            roleIds.push(row.id)
        })
        roleTree.value.setCheckedKeys(roleIds);
        // this.$refs.roleTree.setCheckedKeys(roleIds)
    })
    getRoleListData(1,20).then(res =>{
        if(res.code == 200){
            ThreeData.value = res.data.records
            // AdddefaultExpandedKeysId(res.data.records)
        }
    })

    formRoleAccactDrawerRef.value.open()
}
function AdddefaultExpandedKeysId(data){
    for(let i = 0; i < data.length; i++){
        defaultExpandedKeys.value.push(data[i].id)
        if(data[i].children){
            AdddefaultExpandedKeysId(data[i].children)
        }
    }
}

const handleRoleAccactDrawerSubmit =() => {
    var roleIds = roleTree.value.getCheckedKeys();
    console.log(roleIds)
    console.log(role_id.value)
    getUserRole(role_id.value,roleIds).then(res => {
        console.log(res)
        if(res.code == 200){
            toast("分配角色成功")
            formRoleAccactDrawerRef.value.close()
            getUserListTableData()
        }else{
            toast("分配角色失败",'error')
        }
    })
}
</script>
<style>
    .pages{
        float: right;
        @apply mt-6 mb-6;
    }
    .hide .el-upload--picture-card{
        display: none;
    }
    .icons{
        display: none;
    }
    .uploadImg{
        display: none;
    }
</style>