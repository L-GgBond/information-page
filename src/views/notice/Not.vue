<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleRoleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="#" />
            <el-table-column prop="title" label="标题" />
            <!-- <el-table-column label="附件">
                <template #default="scope">
                    <el-avatar :size="50" :src="scope.row.avatar" />
                </template>
            </el-table-column> -->
            <el-table-column prop="content" label="内容" />
            
            <!-- <el-table-column prop="content" label="内容">
                <template #default="scope">
                    <el-popover
                        placement="top-start"
                        title="标题"
                        width="200"
                        trigger="hover"
                        :content="scope.row.content">
                        <el-button slot="referen1ce">hover 激活</el-button>
                    </el-popover>
                </template>
            </el-table-column> -->


            <el-table-column prop="createtime" label="发布时间">
                <template #default="scope">
                {{ scope.row.createtime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')  }}    
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                <el-button type="primary" size="small" text @click="handleRoleEdit(scope.row)">修改</el-button>
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
                    :page-sizes="[5, 10, 20, 30]"
                    :current-page="current"
                    :page-size="size"
                    :total="total">
            </el-pagination>
        </div>
    </el-card>

    <form-drawer ref="formRoleDrawerRef" :title="drawerTitle" size="45%" destroyOnClose @submit="handleRoleDrawerSubmit" >
        <el-form ref="ruleRoleFormRef" :model="ruleRoleForm" :rules="roleRules" label-width="120px" 
        class="demo-ruleForm"   :size="formSize" status-icon>
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleRoleForm.title" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="ruleRoleForm.content" />
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { getNoticeListData,getNoticeSaveData,getNoticeUpdateData,getNoticeDeleteData,getNoticeUpdateDataInfo } from '~/api/notice.js'
import { getMenuListData } from "~/api/menu.js"

const current = ref(1)
const size = ref(5)
const total = ref(1)

const handleSizeChange = (val) =>{
    console.log(`每页 ${val} 条`)
    size.value = val
    getNoticeListTableData()
}
const handleCurrentChange = (val) =>{
    current.value = val
    getNoticeListTableData()
    console.log(`当前页: ${val}`)
}

//获取列表
const tableData = ref([])
const getNoticeListTableData = ()=>{
    getNoticeListData(size.value,current.value).then(res =>{
        console.log(res)
        // if(res.code == 200){
            tableData.value = res.records
            total.value = res.total
        // }
    })
}
getNoticeListTableData()

const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formRoleDrawerRef = ref(null)
const ruleRoleFormRef = ref(null)
const handleRoleCreate = ()=> { ResetFields(); ID.value = 0;formRoleDrawerRef.value.open() }
const ruleRoleForm = reactive({
    "id":'',
    "title":'',
    "content":'',
})
const roleRules = {
    title: [
        {required: true, message: '请输入标题', trigger: 'blur'}
    ],
    content: [
        {required: true, message: '请输入内容', trigger: 'blur'}
    ]
}
const ResetFields = () =>{
    ruleRoleForm.id = ""
    ruleRoleForm.title = ""
    ruleRoleForm.content = ""
}

//详情
const handleRoleEdit = (row) => {
    console.log(row.id)
    ID.value = row.id
    getNoticeUpdateDataInfo(row.id).then(res=>{
        if(res.code == 200){
            formRoleDrawerRef.value.open()
            ruleRoleForm.id = row.id
            ruleRoleForm.title = row.title
            ruleRoleForm.content = row.content
        }
    })
    
}
const handleRoleDrawerSubmit = () => {
    ruleRoleFormRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            formRoleDrawerRef.value.showLoading()
            const fun = ID.value ? getNoticeUpdateData(ruleRoleForm) : getNoticeSaveData(ruleRoleForm)
            fun.then(res=>{
                console.log(res)
                if(res.code == 200){
                    toast("操作成功")
                    ResetFields()
                    formRoleDrawerRef.value.close()
                    getNoticeListTableData()
                }
            }).finally(() => {
                formRoleDrawerRef.value.hideLoading()
            })
        }
    })
}

//删除
const handleDelete =(id) =>{
    console.log(id)
    getNoticeDeleteData(id).then(res=>{
        if(res.code == 200){
            toast("删除成功")
            getNoticeListTableData()
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