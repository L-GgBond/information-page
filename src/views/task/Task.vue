<template>
    <el-card shadow="never" class="border-0" style="position: relative;">
        <!-- <ListHeader @create="handleCreate" @refresh="getData"/> --> 
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
        <el-table :data="tableData"  style="width: 1100px;top: 20px;" v-loading="loading" >
            <el-table-column prop="id"  label="#" />
            <!-- <el-table-column  prop="subjectname" label="科目" /> -->
            <el-table-column prop="subjectname" label="科目">
                <template #default="scope">
                    <el-tag :key="scope.row.id" type="info" effect="dark">
                        {{ scope.row.subjectname }}
                    </el-tag>
                </template>
            </el-table-column>
            <!-- <el-table-column  prop="" label="完成率">
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception"></el-progress>
            </el-table-column> -->

            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="OpenView(scope.row)">详情</el-button>
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
</template>
<script setup>
import { ref,reactive } from 'vue'
import UploadFile  from 'element-plus'
import store from '~/store'
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestListData } from '~/api/t.js'
import { createRouter, useRouter,useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const rid = route.query.id

const current = ref(1)
const size = ref(5)
const total = ref(1)
const formDrawerRef = ref(false)
const handleSizeChange = (val) =>{
    size.value = val
    getListTableData()
}
const handleCurrentChange = (val) =>{
    current.value = val
    getListTableData()
}
const getData = () =>{
    getListTableData()
}
const tableData = ref([])
tableData.value = [];
const getListTableData = ()=>{
    RequestListData(current.value, size.value,store.state.user.id).then(res =>{
        console.log(res)
            tableData.value = res.data.subjectlist
            total.value = res.data.total
    })
}
getListTableData()


const OpenView =(row) => {
    console.log(row)
    router.push({name:'Tasklist',query:{id:row.id,rid:rid}})
    // router.go(-1)
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