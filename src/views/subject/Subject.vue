<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="#" />
            <el-table-column  prop="subjectname" label="科目" />
            <el-table-column  prop="subjectdesc" label="描述" />
            <el-table-column  prop="status" label="状态">
                <template #default="scope">
                        <el-tag type="danger" v-if="scope.row.status == 1">禁用</el-tag>
                        <el-tag type="success" v-else>正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="更新时间">
                <template #default="scope">
                {{ scope.row.createtime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')  }}    
                </template>
            </el-table-column>
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
            <el-form-item label="科目名称" prop="subjectname">
                <el-input v-model="formModel.subjectname" />
            </el-form-item>
            <el-form-item label="描述" prop="subjectdesc">
                <el-input v-model="formModel.subjectdesc" type="textarea" />
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-select v-model="formModel.status" placeholder="请选择状态">
                        <el-option label="正常" value="0" />
                        <el-option label="禁用" value="1" />
                </el-select>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import store from '~/store'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestListData, RequestSaveData, RequestInfoData, RequestUpdateData, RequestDeleteData } from '~/api/subject.js'
import { Check, Close } from '@element-plus/icons-vue'

const switchTrue = ref(true)
const switchFalse = ref(false)
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
const getData = () =>{
    getListTableData()
}

const tableData = ref([])
const getListTableData = ()=>{
    RequestListData(current.value, size.value).then(res =>{
        console.log(res)
        // if(res.code == 200){
            tableData.value = res.records
            total.value = res.total
        // }
    })
}
getListTableData()

const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formDrawerRef = ref(null)
const formRef = ref(null)
const handleCreate = ()=> { ResetFields(); ID.value = 0;formDrawerRef.value.open() }
const formModel = reactive({
    "id":'',
    "subjectname":'',
    "subjectdesc":'',
    "status":'',
})
const formRules = {
    subjectname: [ { required: true, message: '请输入科目名称', trigger: 'blur' } ],
}
const ResetFields = () =>{
    formModel.id = ""
    formModel.subjectname = ""
    formModel.subjectdesc = ""
    formModel.status = ""
}

//详情
const handleEdit = (row) => {
    console.log(row.id)
    ID.value = row.id
    RequestInfoData(row.id).then(res=>{
        if(res.code == 200){
            formDrawerRef.value.open()
            formModel.id = res.data.id
            formModel.subjectname = res.data.subjectname
            formModel.subjectdesc = res.data.subjectdesc
            formModel.status = res.data.status ? "禁用" : "正常"
        }
    })
    
}
const handleDrawerSubmit = () => {
    formRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            formDrawerRef.value.showLoading()
            if(formModel.status  == "正常"){
                formModel.status  = 0
            }else if(formModel.status  == "禁用"){
                formModel.status  = 1
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
</style>