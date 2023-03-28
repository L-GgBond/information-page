<template>
    <el-card shadow="never" class="border-0" style="position: relative;">
        <div class="flex items-center justify-between mb-4">
            <div></div>
            <div>
            <el-tooltip  effect="dark" content="刷新数据" placement="top">
                    <el-button size="small" text @click="getData">
                        <el-icon :size="15">
                        <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
        </div>
        <!-- <el-form ref="searchRef" :model="searchModel" :rules="searchRules" :inline="true"  class="demo-form-inline">
            <el-form-item label="姓名" prop="searchNickname">
                <el-input v-model="searchModel.searchNickname" placeholder="请输入姓名"  />
            </el-form-item>
            <el-form-item>
                <el-button type="success"  @click="onSearchSubmit">搜索</el-button>
            </el-form-item>
        </el-form> -->

        <el-table :data="tableData"  style="width: 1100px;top: 20px;" v-loading="loading" >
            <el-table-column prop="id"  label="#" />
            <el-table-column  prop="uname" label="学号"  />
            <el-table-column  prop="unickname" label="名称" />
            <el-table-column  prop="schoolterm" label="学期" />
            <el-table-column  prop="approver" label="审批人"/>
            <el-table-column prop="statu" label="状态">
                <template #default="scope">
                    <el-tag class="ml-2" v-if="scope.row.status == 1" type="success">已评分</el-tag>
                    <el-tag class="ml-2" v-else type="danger">待评分</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="发布时间" width="180px">
                <template #default="scope">
                {{ scope.row.createtime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')  }}    
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleTaskInfo(scope.row.id)">详情</el-button>
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

   <el-drawer  v-model="formDrawerRef" title="详情"  size="65%"  :with-header="false">
        <el-table :data="tableDataInfo" style="width: 100%">
            <el-table-column prop="kmname" label="科目" width="180" />
            <el-table-column  label="附件" width="180">
                <template #default="scope">
                    <el-image style="width: 50px; height: 50px" :src="scope.row.files"  />
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" />
            <el-table-column label="评分">
                <template #default="scope">
                    <el-text class="mx-1" type="danger" style="color:red">{{ scope.row.grade }}</el-text>
                   
                </template>
            </el-table-column>
            
        </el-table>
        <div style="">
            <el-text style="font-size: 14px;font-weight: 400;margin-top: 10px;">当前总分数：</el-text>
            <el-text class="mx-1" type="danger" style="color:red">{{ totals }}</el-text>
        </div>
       
    </el-drawer>
</template>
<script setup>
import { ref,reactive } from 'vue'
import UploadFile  from 'element-plus'
import store from '~/store'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestListData,RequestDeleteData,RequestInfoData } from '~/api/task.js'

const totals = ref(null)
const current = ref(1)
const size = ref(5)
const total = ref(1)
const formDrawerRef = ref(false)
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
    RequestListData(current.value, size.value, "student", searchModel.searchNickname,store.state.user.id).then(res =>{
        console.log(res)
        if(res.code == 200){
            tableData.value = res.data.data
            total.value = res.data.total

        }
    })
}
getListTableData()

const handleDelete =(id) => {
    console.log(id)
    RequestDeleteData(id).then(res => {
        console.log(res)
        if(res.code == 200){
            toast("删除成功！")
            getListTableData()
        }
    })
}

const infoId = ref(null);
const tableDataInfo = ref(null)
const handleTaskInfo =(id) =>{
    console.log(id)
    infoId.value = id;
    totals.value = 0
    RequestInfoData(id).then(res => {
        console.log(res)
        tableDataInfo.value = res.data
        res.data.forEach(item => {
            console.log(item)
            totals.value += item.grade 
        })
    })
    formDrawerRef.value = true 
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