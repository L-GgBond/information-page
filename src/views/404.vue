<template>
    <div>
        <el-result
            icon="warning"
            title="404"
            sub-title="404 Not Found">
            <template #extra>
                <el-button type="primary" @click="$router.push('/index')">
                    回到首页
                </el-button>
            </template>
        </el-result>
    </div>
</template>