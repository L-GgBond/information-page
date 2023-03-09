<template>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <Menu></Menu>
            </el-aside>
            <div>
                <el-main>
                    <tag-list></tag-list>
                    <router-view></router-view>
                </el-main>
            </div>
        </el-container>
    </el-container>
</template>
<script setup>
import Header from './components/Header.vue'
import Menu  from './components/Menu.vue'
import tagList from './components/TagList.vue'
</script>

<style>
.el-aside{
    transition: all 0.2s;
}
.fade-enter-from{
    opacity: 0;
}
.fade-enter-to{
    opacity: 1;
}
.fade-leave-from{
    opacity: 1;
}
.fade-leave-to{
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
    transition: all 0.3s;
}
.fade-enter-active{
    transition-delay: 0.3s;
}
</style>