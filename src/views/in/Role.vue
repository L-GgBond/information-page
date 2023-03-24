<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleRoleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="#" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="唯一编码" />
            <el-table-column prop="remark" label="描述" />
            <el-table-column prop="statu" label="状态">
                <template #default="scope">
                    <el-tag class="ml-2" v-if="scope.row.statu == 1" type="success">正常</el-tag>
                    <el-tag class="ml-2" v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                <el-button type="warning" size="small" text @click="handleRoleAccact(scope.row)">分配权限</el-button>
                <el-button type="primary" size="small" text @click="handleRoleEdit(scope.row)">修改</el-button>
                <el-popconfirm title="是否要删除？" confirmButtonText="确认" cancelButtonText="取消"
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

    <form-drawer ref="formRoleAccactDrawerRef" title="分配权限" size="45%" destroyOnClose @submit="handleRoleAccactDrawerSubmit" >
        <el-form ref="ruleRoleAccactFormRef">
            <el-tree
                ref="permTree"
                :data="ThreeData"
                show-checkbox
                node-key="id"
                :props="{ label: 'name', children: 'children' }" :default-expanded-keys="defaultExpandedKeys" :current-node-key="checkTree"
                :default-checked-keys="defaultCheckedKeys" check-strictly="true"/>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import { computed } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { getRoleListData,getRoleSaveData,getRoleUpdateData,getRoleDeleteData,getRoleUpdateDataInfo,getPermRoleData } from '~/api/role.js'
import { getMenuListData } from "~/api/menu.js"
//getRoleListData
const current = ref(1)
const size = ref(5)
const total = ref(0)
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}
const tableData = ref([])
const getRoleListTableData = ()=>{
    getRoleListData(current.value, size.value).then(res =>{
        console.log(res)
        if(res.code == 200){
            tableData.value = res.data.records
            size.value = res.data.size
            current.value = res.data.current
            total.value = res.data.total
        }
    })
}
getRoleListTableData()

const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formRoleDrawerRef = ref(null)
const ruleRoleFormRef = ref(null)
const handleRoleCreate = ()=> { ID.value = 0;formRoleDrawerRef.value.open() }
const ruleRoleForm = reactive({
    "id":'',
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

const handleRoleEdit = (row) => {
    console.log("handleRoleEdit")
    console.log(row.id)
    ID.value = row.id
    getRoleUpdateDataInfo(row.id).then(res=>{
        if(res.code == 200){
            formRoleDrawerRef.value.open()
            ruleRoleForm.id = row.id
            ruleRoleForm.name = row.name
            ruleRoleForm.code = row.code
            ruleRoleForm.remark = row.remark
            ruleRoleForm.statu = row.statu
        }
    })
    
}
const handleRoleDrawerSubmit = () => {
    console.log(1)
    ruleRoleFormRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            formRoleDrawerRef.value.showLoading()
            const fun = ID.value ? getRoleUpdateData(ruleRoleForm) : getRoleSaveData(ruleRoleForm)
            fun.then(res=>{
                console.log(res)
                if(res.code == 200){
                    formRoleDrawerRef.value.close()
                    getRoleListTableData()
                    formRoleDrawerRef.value.hideLoading()
                }
            })
        }
    })
}

//删除
const handleDelete =(id) =>{
    console.log(id)
    var ids = []
    ids.push(id)
    getRoleDeleteData(ids).then(res=>{
        if(res.code == 200){
            toast("删除成功")
            getRoleListTableData()
        }
    })
}

//分配权限
onMounted(() => {
   
})
const ThreeData = ref([])
const permTree = ref(null)
const defaultExpandedKeys = ref([])
const defaultCheckedKeys = ref([])
const ruleRoleAccactFormRef = ref(null)
const formRoleAccactDrawerRef = ref(null)
const checkTree = ref([])
const roleid = ref(null)
const handleRoleAccact =(id) => {
    console.log("handleRoleAccact")
    console.log(id.id)
    getRoleUpdateDataInfo(id.id).then(r => {
        console.log("r",r)
        defaultCheckedKeys.value = r.data.menuIds
        roleid.value = r.data.id
    })
    getMenuListData().then(res =>{
        if(res.code == 200){
            console.log("getMenuListData")
            console.log(res)
            ThreeData.value = res.data
            AdddefaultExpandedKeysId(res.data)
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


const handleRoleAccactDrawerSubmit = ()=>{
    console.log("分配权限")
    console.log(permTree.value.getCheckedKeys())
    console.log(roleid.value)
    getPermRoleData(roleid.value,permTree.value.getCheckedKeys()).then(res => {
        console.log(res)
        if(res.code == 200){
            toast("权限分配成功")
            formRoleAccactDrawerRef.value.close()
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