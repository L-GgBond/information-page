<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="#" />
            <el-table-column  prop="classname" label="班级名称" />
            <!-- <el-table-column prop="classname" label="班级"  width="120px">
                <template #default="scope">
                    <el-tag :key="scope.row.id" type="info" effect="dark">
                        {{ scope.row.classname }}
                    </el-tag>
                </template>
            </el-table-column> -->

            <el-table-column   label="工作人员"  width="120px" v-if="store.state.user.id == 1">
                <template #default="scope">
                    <el-tag v-for="(item,index) in scope.row.users"  style="margin:5px" effect="dark">
                            {{ item.nickname}}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column  label="人数"  width="120px">
                <template #default="scope">
                    <el-tag :key="scope.row.id" type="danger" effect="plain">
                        {{ scope.row.total }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column  prop="classdesc" label="描述" />
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

            <el-form-item label="班级">
                <!-- prop="classid" -->
                <!-- <template> -->
                    <!-- formModel.classid -->

                    <el-checkbox-group v-model="subList">
                            <el-checkbox  v-for="item in subData" :label="item.id"
                        :key="item.id" >{{item.subjectname}}</el-checkbox>
                        <!-- @change="changeCheckbox(item)"  -->
                    </el-checkbox-group>
                <!-- </template>     -->
                <!-- <el-tree
                    :data="classData"
                    show-checkbox
                    ref="classTree"
                    node-key="id"
                    check-strictly="true"
                    :props="{ label: 'classname', children: 'children' }" default-expand-all="true" /> -->
            </el-form-item>


            <el-form-item label="班级名称" prop="classname">
                <el-input v-model="formModel.classname" />
            </el-form-item>
            <el-form-item label="描述" prop="classdesc">
                <el-input v-model="formModel.classdesc" type="textarea" />
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
import { RequestListData, RequestSaveData, RequestInfoData, RequestUpdateData, RequestDeleteData } from '~/api/class.js'
import { RequestListDatas } from '~/api/subject.js'


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
tableData.value = [];
const getListTableData = ()=>{
    RequestListData(current.value, size.value,store.state.user.id).then(res =>{
        console.log(res)
        tableData.value = res.data.records
        total.value = res.data.total
        size.value = res.data.size
        current.value = res.data.current
    })
}
getListTableData()

const ID = ref(0)
const drawerTitle = computed(()=> ID.value ? "修改" : "新增")
const formDrawerRef = ref(null)
const formRef = ref(null)
const subList = ref([])
const subData = ref([])
const handleCreate = ()=> {
    ResetFields(); ID.value = 0;formDrawerRef.value.open()
    RequestListDatas(store.state.user.id).then(res => {
        console.log(res)
        subData.value = res.data.records
    })
}
const formModel = reactive({
    "id":'',
    "uid":'',
    "classname":'',
    "classdesc":'',
    "users":[],
    "cids":[],
})
const formRules = {
    classname: [ { required: true, message: '请输入班级名称', trigger: 'blur' } ],
}
const ResetFields = () =>{
    formModel.id = ""
    formModel.classname = ""
    formModel.classdesc = ""
    subList.value = []
}

//详情
const handleEdit = (row) => {
    subList.value = []
    console.log(row.id)
    ID.value = row.id
    RequestListDatas(store.state.user.id).then(res => {
        console.log(res)
        subData.value = res.data.records
    })
    RequestInfoData(row.id).then(res=>{
        if(res.code == 200){
            formDrawerRef.value.open()
            formModel.id = res.data.id
            formModel.classname = res.data.classname
            formModel.classdesc = res.data.classdesc
            res.data.subjects.forEach(item => {
                subList.value.push(item.id) 
            })
            console.log(subList.value)
            
        }
    })
    
}
const handleDrawerSubmit = () => {
    console.log(subList.value)
    formModel.cids = subList.value
    formRef.value.validate((valid) => {
        console.log(valid)
        if(valid){
            
            if(formModel.cids.length == 0){
                toast("请选择科目",'error')
                return;
            }
            formDrawerRef.value.showLoading()
            formModel.uid = store.state.user.id
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
    RequestDeleteData(id,store.state.user.id).then(res=>{
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