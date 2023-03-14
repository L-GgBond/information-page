<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData"/>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title" label="头像" />
            <el-table-column prop="title" label="角色名称" />
            <el-table-column prop="title" label="邮箱" />
            <el-table-column prop="title" label="手机号" />
            <el-table-column prop="title" label="状态" />
            <el-table-column prop="create_time" label="创建时间" width="380" />
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
    </el-card>
</template>
<script setup>
import ListHeader from "~/components/ListHeader.vue";

const handleCreate =() =>{}

const getData =() =>{}

//获取列表
const getUserList =()=> {

}
getUserList()
</script>