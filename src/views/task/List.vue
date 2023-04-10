<template>
    <el-card shadow="never" class="border-0" style="position: relative;">
        <div class="flex items-center justify-between mb-4">
            <div> </div>
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
            <el-table-column prop="title" label="作业"  width="120px">
                <template #default="scope">
                    <el-tag :key="scope.row.id" type="info" effect="dark">
                        {{ scope.row.title }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column  prop="fraction" label="满分" />
            <el-table-column  prop="ask" label="要求" />
            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="answer(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
  
        <div class="pages" style="display:flex;padding-top:6px">
            <div @click="ToBack" style="position:absolute;left:30px;">
                <el-icon><Back /></el-icon>  
            </div>
            <div  >
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
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="答题"
            width="90%"
            :before-close="handleClose">
            <div>
                <el-row>
                    <el-col :span="10">
                        <el-form :model="formModelInfo" label-width="120">
                            <el-form-item label="学期" prop="termid" >
                                <el-input  disabled v-model="formModelInfo.termid" />
                            </el-form-item>
                            <el-form-item label="班级" prop="bid">
                                <el-input  disabled v-model="formModelInfo.bid" />
                            </el-form-item>
                            <el-form-item label="科目" prop="kid">
                                <el-input  disabled v-model="formModelInfo.kid  " />
                            </el-form-item>
                            <el-form-item label="审核人" prop="tid">
                                <el-input  disabled v-model="formModelInfo.tid" />
                            </el-form-item>
                            <el-form-item label="作业" prop="title">
                                <el-input  disabled v-model="formModelInfo.title" />
                            </el-form-item>
                            <el-form-item label="分数" prop="fraction">
                                <el-input  disabled v-model="formModelInfo.fraction" />
                            </el-form-item>
                            <el-form-item label="要求" prop="ask">
                                <el-input type="textarea" disabled v-model="formModelInfo.ask" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2">
                    </el-col>
                    <el-col :span="12">
                        
                        <el-form ref="formRef" :model="formModel" :rules="formRules"  label-width="">
                            <el-form-item label="附件" prop="ascontent">
                                <el-upload
                                    v-model:file-list="fileList"
                                    class="upload-demo"
                                    multiple="false" name="f" 
                                    :action="RequestUp"
                                    :data="{id:aid,uid:store.state.user.id}"
                                    :on-success="handleAvatarSuccess"
                                    :before-remove="beforeRemove"
                                    :on-exceed="handleExceed">
                                    <el-button type="primary">Click to upload</el-button>
                                    <template #tip>
                                    <div class="el-upload__tip">
                                        jpg/png or word files with a size less than 500KB.
                                    </div>
                                    </template>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                        <div class="app-container">
                            <editor id="tinymce" v-model="formModel.ascontent" :init="init"></editor>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitFormData">
                提交
                </el-button>
            </span>
            </template>
        </el-dialog>
    </el-card>
</template>
<script setup>
import { ref,reactive,onMounted } from 'vue'
import UploadFile  from 'element-plus'
import store from '~/store'
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestTasklistListData,RequestTaskSaveData } from '~/api/as.js'
import { createRouter, useRouter,useRoute } from 'vue-router'
import { RequestUp } from '~/api/uploads.js'
const dialogVisible = ref(false)
const fileList = ref([])
const fileLists = ref([])
const aid = ref(0)
const handleAvatarSuccess =(file) =>{
 console.log(file)
  if(file.code == 200){
    toast("上传成功")
    fileLists.value.push({name:file.data.name,type:file.data.type,url:file.data.url})
   
  }
}
const beforeRemove =(file) => {
    console.log(file.name)
    console.log(fileLists.value)
    const deleteIndex = fileLists.value.findIndex( item => {
        return item.name === file.name 
    })
    fileLists.value.splice(deleteIndex, 1) 
    console.log(fileLists.value)
}

const formModel = reactive({
    "ascontent":""
})
const handleSubmitFormData =() => {
    RequestTaskSaveData(aid.value,store.state.user.id,formModel.ascontent,fileLists.value).then(res => {
        console.log(res)
        if(res.code == 200){
            toast("提交成功");
            dialogVisible.value = false
        }
    })
}


const formModelInfo = reactive({
    "termid":"学期",//学期
    "bid":"班级",//班级
    "kid":"科目",//科目
    "tid":"teacher5",//审核人
    "title":"作业",//作业
    "fraction":"分数",//分数
    "ask":"要求",//要求
})
const formDrawerRef = ref(false)
//打开详情
const answerDrawer =(item) => {
    formDrawerRef.value = true
} 
const answer =(item) => {
    console.log(item)
    aid.value = item.id
    tinymce.init({});
    dialogVisible.value = true
}
const router = useRouter()
const route = useRoute()
const kid = route.query.id
const ToBack = () => router.push({name:'task:task:list',query:{}})
const current = ref(1)
const size = ref(5)
const total = ref(1)
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
    RequestTasklistListData(current.value, size.value,store.state.user.id,kid).then(res =>{
        console.log(res)
            tableData.value = res.data.data
            total.value = res.data.total
    })
}
getListTableData()




import Editor from "@tinymce/tinymce-vue"; // 引入组件
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
// 都是富文本插件
import "tinymce/icons/default";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
const tinymceHtml = ref("请输入内容");
const init = {
  //初始化数据
  language_url: "/skins/langs/zh-Hans.js", // 引入语言包（该语言包在public下，注意文件名称）
  language: "zh-Hans", // 这里名称根据 zh-Hans.js 里面写的名称而定
  skin_url: "/skins/ui/oxide", // 这里引入的样式
  height: 200, // 限制高度
  plugins: "link lists image code table wordcount", // 富文本插件
  toolbar:
    "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
  branding: false, // //是否禁用“Powered by TinyMCE”
  menubar: true, //顶部菜单栏显示
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  content_css: "/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  images_upload_handler: (blobInfo) =>
        new Promise((resolve, reject) => {
          // console.log(blobInfo.blob());
          // 上传图片需要，FormData 格式的文件；
          const formDataUp = new FormData();
         // img  是接口需要的上传的属性名，一般属性名是 file
          formDataUp.append("img", blobInfo.blob());
          // // console.log(formDataUp);
          axios.post("xxxx", formDataUp).then((res) => {
              resolve("返回的上传图片后的地址");
            });
        }),
    };
onMounted(() => {
  tinymce.init({}); // 初始化富文本
});

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
avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>