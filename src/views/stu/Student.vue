<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData"/>
        <el-form ref="searchRef" :model="searchModel" :rules="searchRules" :inline="true"  class="demo-form-inline">
            <el-form-item label="姓名" prop="searchNickname">
                <el-input v-model="searchModel.searchNickname" placeholder="请输入姓名"  />
            </el-form-item>

            <el-form-item>
                <el-button type="success"  @click="onSearchSubmit">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="#" />
            <el-table-column  prop="username" label="账号" />
            <el-table-column label="头像">
                <template #default="scope">
                    <el-avatar :size="50" :src="scope.row.avatar" />
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="姓名" />
            <el-table-column  label="性别">
                <template #default="scope">
                    <el-text v-if="scope.row.sex == 1">男</el-text>
                    <el-text v-else>女</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="class_name" label="班级" />
            <el-table-column prop="age" label="年纪" />
            <el-table-column label="操作" width="220" align="center">
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
       
        <div class="pages">
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
            <el-form-item label="学号" prop="username">
                <el-input v-model="formModel.username" />
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
                <el-input v-model="formModel.nickname" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="formModel.sex" placeholder="请选择性别">
                        <el-option label="男" value="1" />
                        <el-option label="女" value="0" />
                </el-select>
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
            <el-form-item label="班级" prop="class_id">
                <el-select v-model="formModel.class_id" placeholder="请选择班级">
                    <template v-for="(item,index) in classData">
                        <el-option :label="item.classname" :value="item.classname" />
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="学年时间" prop="duration">
                <el-input type="number" v-model="formModel.duration" />
            </el-form-item>
            <el-form-item label="政治面貌" prop="politics">
                <el-input v-model="formModel.politics" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formModel.email" />
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
// import   UploadFile  from 'element-plus'
import store from '~/store'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestListData, RequestSaveData, RequestInfoData, RequestUpdateData, RequestDeleteData, RequestClassListData } from '~/api/student.js'

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
//获取列表
const tableData = ref([])
const getListTableData = ()=>{
    RequestListData(current.value, size.value, "student", searchModel.searchNickname).then(res =>{
        console.log(res)
        if(res.code == 200){
            tableData.value = res.data.records
            total.value = res.data.total
        }
    })
}
getListTableData()

const classData = ref([])

const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formDrawerRef = ref(null)
const formRef = ref(null)
const handleCreate = ()=> {
     ResetFields(); 
     ID.value = 0;
     formDrawerRef.value.open() 
     RequestClassListData().then(res=>{
        console.log(res)
        if(res.code == 200){
            classData.value = res.data
        }
     })
}
const formModel = reactive({
    "id":'',
    "username":'',
    "nickname":'',
    "sex":'',
    "nation":'',
    "city":'',
    "class_id":'',
    "class_name":'',
    "duration":'',
    "politics":'',
    "email":'',
    "avatar":'',
    "age":'',
    "email":'',
})
const formRules = {
    username: [ { required: true, message: '请输入账号', trigger: 'blur' } ],
    nickname: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
    sex: [ { required: true, message: '请输入性别', trigger: 'blur' } ],
    class_id: [ { required: true, message: '请选择班级', trigger: 'blur' } ],
    age: [ { required: true, message: '请输入年龄', trigger: 'blur' } ],
}
const ResetFields = () =>{
    formModel.id = ""
    formModel.username = ""
    formModel.nickname = ""
    formModel.sex = ""
    formModel.nation = ""
    formModel.city = ""
    formModel.class_id = ""
    formModel.class_name = ""
    formModel.duration = ""
    formModel.politics = ""
    formModel.email = ""
    formModel.avatar = ""
    formModel.age = ""
    formModel.email = ""
}

//详情
const handleEdit = (row) => {
    console.log(row.id)
    ID.value = row.id
    RequestInfoData(row.id).then(res=>{
        if(res.code == 200){
            formDrawerRef.value.open()
            formModel.id = ""
            formModel.username = ""
            formModel.nickname = ""
            formModel.sex = ""
            formModel.nation = ""
            formModel.city = ""
            formModel.class_id = ""
            formModel.class_name = ""
            formModel.duration = ""
            formModel.politics = ""
            formModel.email = ""
            formModel.avatar = ""
            formModel.age = ""
            formModel.email = ""
        }
    })
    
}
const handleDrawerSubmit = () => {
    formRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            formDrawerRef.value.showLoading()
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
</style>