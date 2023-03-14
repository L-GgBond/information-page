<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleRoleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="唯一编码" />
            <el-table-column prop="remark" label="描述" />
            <el-table-column prop="statu" label="状态" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

                <el-popconfirm title="是否要删除该公告？" confirmButtonText="确认" cancelButtonText="取消"
                    @confirm="handleDelete(scope.row.id)">
                    <template #reference>
                        <el-button text type="primary" size="small">删除</el-button>
                    </template>
                </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
       
        <div class="pages">
            <el-pagination
            v-model:current-page="current"
            v-model:page-size="size"
            :page-sizes="[10, 20, 30, 40]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
    </el-card>

    <form-drawer ref="formRoleDrawerRef" :title="drawerTitle" size="45%" destroyOnClose @submit="handleRoleDrawerSubmit" >
        <el-form ref="ruleRoleFormRef" :model="ruleRoleForm" :rules="roleRules" label-width="120px" 
        class="demo-ruleForm"   :size="formSize" status-icon>
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="ruleRoleForm.name" />
            </el-form-item>
            <el-form-item label="唯一编码" prop="code">
                <el-input v-model="ruleRoleForm.code" />
            </el-form-item>
            <el-form-item label="描述" prop="remark">
               <el-input v-model="ruleRoleForm.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="statu">
               <el-radio-group v-model="ruleRoleForm.statu">
                  <el-radio :label=0>禁用</el-radio>
                  <el-radio :label=1>正常</el-radio>
               </el-radio-group>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import { computed } from "@vue/reactivity";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { getRoleListData,getRoleSaveData,getRoleUpdateData } from '~/api/role.js'


//getRoleListData
// const tableData = [
//     {
//         name:'学生',
//         code:'in:role:save',
//         remark:'ssssss',
//         statu:1,
//     },
//     {
//         name:'老师',
//         code:'in:role:save',
//         remark:'ssssss',
//         statu:0,
//     }
// ]
const tableData = reactive([])
const getRoleListTableData = ()=>{
    getRoleListData().then(res =>{
        console.log(res)
    })
}
getRoleListTableData()


//page
const current = ref(1)
const size = ref(10)
const total = ref(0)
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formRoleDrawerRef = ref(null)
const ruleRoleFormRef = ref(null)
const handleRoleCreate = ()=> { ID.value = 0;formRoleDrawerRef.value.open() }
const ruleRoleForm = reactive({
    "name":'',
    "code":'',
    "remark":'',
    "statu":'',
})
const roleRules = {
    name: [
        {required: true, message: '请输入角色名称', trigger: 'blur'}
    ],
    code: [
        {required: true, message: '请输入唯一编码', trigger: 'blur'}
    ],
    remark: [
        {required: true, message: '请输入备注', trigger: 'blur'}
    ],
    statu: [
        {required: true, message: '请选择状态', trigger: 'blur'}
    ]
}
const handleRoleDrawerSubmit = () => {
    ruleRoleFormRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            formRoleDrawerRef.value.showLoading()
            const fun = ID.value ? getRoleUpdateData(ruleRoleForm) : getRoleSaveData(ruleRoleForm)
            fun.then(res=>{
                console.log(res)
            })
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