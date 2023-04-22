<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-tree :data="tableDatas" :props="{ label: 'name', children: 'children' }" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <!-- v-loading="loading"  -->
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <el-tag v-if="data.type === 0" size="small">目录</el-tag>
                    <el-tag v-else-if="data.type === 1" size="small" type="success">菜单</el-tag>
                    <el-tag v-else-if="data.type === 2" size="small" type="info">按钮</el-tag>
                    <!-- <el-icon class="ml-2" v-if="data.icon" :size="16">
                        <component :is="data.icon" />
                    </el-icon> -->
                    <span class="ml-2"> {{ data.name }}</span>
                    <span class="ml-2"> {{ data.perms }}</span>
                    <div class="ml-auto">
                        <el-tag class="ml-2" v-if="data.statu == 1" type="success">正常</el-tag>
                        <el-tag class="ml-2" v-else type="danger">禁用</el-tag>
                        <!-- <el-switch :model="data.statu" :active-value="1" :inactive-value="0"/> -->
                        <el-button class="ml-8" text type="primary" size="small"
                            @click.stop="handleUpdateMenu(data.id)">编辑</el-button>
                        <el-popconfirm width="220" confirm-button-text="YES" cancel-button-text="No" :icon="InfoFilled"
                            icon-color="#626AEF" title="确定要删除吗" @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button class="ml-8" text type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>

    <form-drawer ref="formDrawerRef" :title="drawerTitle" size="45%" destroyOnClose @submit="handleFormMenu">
        <el-form ref="ruleMenuFormRef" :model="ruleMenuForm" :rules="menuRules" label-width="120px" class="demo-ruleForm"
            :size="formSize" status-icon>
            <el-form-item label="上级菜单" prop="parentId">
                <el-select v-model="ruleMenuForm.parentId" placeholder="请选择上级菜单">
                    <template v-for="item in tableDatas">
                        <el-option :label="item.name" :value="item.id" />
                        <template v-for="items in item.children">
                            <el-option :label="items.name" :value="items.id">
                                <span class="ml-4">{{ '' + items.name }} </span>
                            </el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="ruleMenuForm.name" />
            </el-form-item>
            <el-form-item label="权限编码" prop="perms">
                <el-input v-model="ruleMenuForm.perms" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="ruleMenuForm.icon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单URL" prop="path">
                <el-input v-model="ruleMenuForm.path" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单组件" prop="component">
                <el-input v-model="ruleMenuForm.component" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="ruleMenuForm.type">
                    <el-radio :label=0>目录</el-radio>
                    <el-radio :label=1>菜单</el-radio>
                    <el-radio :label=2>按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="statu">
                <el-radio-group v-model="ruleMenuForm.statu">
                    <el-radio :label=0>禁用</el-radio>
                    <el-radio :label=1>正常</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序号" prop="orderNum">
                <el-input-number v-model="ruleMenuForm.orderNum" :min="1" label="排序号">1</el-input-number>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref, reactive } from "vue";
import { computed } from "@vue/reactivity";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { getMenuListData, getMenuSaveData, getMenuUpdateDataInfo, getMenuUpdateData, getMenuDeleteData } from "~/api/menu.js"
import {
    useInitTable
} from "~/composables/useCommon.js"
import { toast } from '~/utils/common'
//获取列表
const tableDatas = ref([])
const defaultExpandedKeys = ref([])
function getMenuListDatas() {
    getMenuListData().then(res => {
        if (res.code == 200) {
            tableDatas.value = res.data
            AdddefaultExpandedKeysId(res.data)
        }
    }).finally(() => {

    })
}
getMenuListDatas()

const getData = () => { getMenuListDatas() }
function AdddefaultExpandedKeysId(data) {
    for (let i = 0; i < data.length; i++) {
        defaultExpandedKeys.value.push(data[i].id)
        // if(data[i].children){
        //     AdddefaultExpandedKeysId(data[i].children)
        // }
    }
}

const ruleMenuFormRef = ref()
const formDrawerRef = ref(null)
const ruleMenuForm = reactive({
    'id': '',
    'parentId': '',
    'name': '',
    'perms': '',
    'icon': '',
    'path': '',
    'component': '',
    'type': '',
    'orderNum': '',
    'statu': '',
})
const editId = ref(0);
const drawerTitle = computed(() => editId.value ? "修改" : "新增")
const handleCreate = () => {
    console.log("新增")
    editId.value = 0
    ruleMenuForm.id = ""
    ruleMenuForm.parentId = ""
    ruleMenuForm.name = ""
    ruleMenuForm.perms = ""
    ruleMenuForm.icon = ""
    ruleMenuForm.path = ""
    ruleMenuForm.component = ""
    ruleMenuForm.type = ""
    ruleMenuForm.orderNum = ""
    ruleMenuForm.statu = ""
    formDrawerRef.value.open()
    ruleMenuFormRef.value.resetFields();
    formRoleDrawerRef.value.hideLoading()
}

const menuRules = {
    // parentId: [
    //     {required: true, message: '请选择上级菜单', trigger: 'blur'}
    // ],
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    perms: [
        { required: true, message: '请输入权限编码', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    orderNum: [
        { required: true, message: '请填入排序号', trigger: 'blur' }
    ],
    statu: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ]
}


//编辑
const handleUpdateMenu = (id) => {
    editId.value = id
    console.log(id)
    getMenuUpdateDataInfo(id).then(res => {
        if (res.code == 200) {
            const r = res.data
            ruleMenuForm.id = r.id
            ruleMenuForm.name = r.name
            ruleMenuForm.parentId = r.parentId
            ruleMenuForm.perms = r.perms
            ruleMenuForm.icon = r.icon
            ruleMenuForm.path = r.path
            ruleMenuForm.component = r.component
            ruleMenuForm.type = r.type
            ruleMenuForm.orderNum = r.orderNum
            ruleMenuForm.statu = r.statu
            formDrawerRef.value.open()
        }
    })

}

const handleFormMenu = () => {
    ruleMenuFormRef.value.validate((valid) => {
        if (ruleMenuForm.parentId == '') {
            ruleMenuForm.parentId = 0
        }
        if (valid) {
            formDrawerRef.value.showLoading()
            const fun = editId.value ? getMenuUpdateData(ruleMenuForm) : getMenuSaveData(ruleMenuForm)
            fun.then(res => {
                console.log(res)
                if (res.code == 200) {
                    toast("操作成功")
                    formDrawerRef.value.hideLoading()
                    formDrawerRef.value.close()
                    getMenuListDatas()
                }
            }).finally(() => {
                formRoleDrawerRef.value.hideLoading()
            })
        }
    })
}


//删除
const handleDelete = (id) => {
    console.log(id)
    getMenuDeleteData(id).then(res => {
        if (res.code == 200) {
            toast("操作成功")
            getMenuListDatas()
        }
    })
}
</script>
<style>
.el-tree {
    position: unset;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 8px;
}

.el-tree-node__content {
    padding: 22px;
}
</style>