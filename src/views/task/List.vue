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
            <el-table-column prop="createtime" label="发布时间">
                <template #default="scope">
                {{ scope.row.createtime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')  }}    
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <el-button type="danger" size="small" text @click="datasIfView(scope.row)">详情</el-button>
                    <!-- <el-button type="danger" size="small" text @click="answer(scope.row)">答题</el-button>
                    <el-button type="primary" size="small" text @click="handleInfo(scope.row)">详情</el-button> -->
                </template>
            </el-table-column>
        </el-table>
  
        <div class="pages">
            <div @click="ToBack" style="position:absolute;left:30px;">
                <el-icon style="color: dodgerblue;"><Back /></el-icon>  
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
            width="90%">
            <div>
                <el-row>
                    <el-col :span="8">
                        <el-form :model="formModelInfo" label-width="120">
                            <el-form-item label="附件">
                                <el-upload
                                    v-model:file-list="fileList"
                                    class="upload-demo"
                                    multiple="false" name="f" 
                                    :action="RequestUp"
                                    :data="{id:aid,uid:store.state.user.id}"
                                    :on-success="handleAvatarSuccess"
                                    :before-remove="beforeRemove">
                                    <el-button type="primary">点击上传</el-button>
                                    <template #tip>
                                    <div class="el-upload__tip">
                                       图片支持 jpg / png / jpeg /svg / gif .
                                    </div>
                                    <div class="el-upload__tip">
                                       文件大小不可超过50MB .
                                    </div>

                                    </template>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2">
                    </el-col>
                    <el-col :span="14">
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
        

        <el-dialog
            v-model="dialogVisibleInfo"
            title="详情"
            width="90%">
            <div>
                <el-row>
                    <el-col :span="8">
                        <div style="padding-left:35px;padding-top:6px;font-size: 14px;line-height: 40px;">
                            <div>
                                <el-text>标题：</el-text>
                                <el-text>{{contentInfo.title}}</el-text>
                            </div>
                            <div>
                                <el-text>分数：</el-text>
                                <el-text>{{contentInfo.fraction}}</el-text>
                            </div>
                            <div>
                                <el-text>要求：</el-text>
                                <el-text v-html="contentInfo.ask"></el-text>
                                <!-- <div v-html="contentInfo.ask"></div> -->

                            </div>
                            <div>
                                <el-text>科目：</el-text>
                                <el-text>{{contentInfo.subject}}</el-text>
                            </div>
                            <div>
                                <el-text>班级：</el-text>
                                <el-text>{{contentInfo.classname}}</el-text>
                            </div>
                            <div>
                                <el-text>学期：</el-text>
                                <el-text>{{contentInfo.termname}}</el-text>
                            </div>
                            <div>
                                <el-text>审批人：</el-text>
                                <el-text>{{contentInfo.username}}</el-text>
                            </div>
                            
                            <div>
                                <el-text>答题时间：</el-text>
                                <el-text>{{createtime}}</el-text>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="2">
                    </el-col>
                    <el-col :span="14">
                        <div style="display:flex;">
                            <span class="demonstration"  style="  width:70px">文件列表</span>
                            <div style="margin-left: 20px;"> 
                                <div class="demo-image" style="display:flex;flex-wrap:wrap">
                                    <div v-for="(item,index) in dataFile"  class="block">
                                        <el-image v-if="item.filetype == 'image/jpeg' || item.filetype == 'image/gif' || item.filetype == 'image/png' ||  item.filetype == 'image/svg'" style="width: 100px; height: 100px;margin-right:10px" :src="item.filepath"  />
                                        <el-image v-else style="width: 100px; height: 100px;margin-right:10px;cursor: pointer;" @click="downLoadFile(item)" src="/src/assets/x.png"  />
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex;">
                            <div style="margin-top:20px;display:flex;">
                                <span class="demonstration" style="margin-top:15px;">内容</span>
                                <div v-html="ascontent" style="margin-left: 45px;" >
                                
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top:20px;" v-if="status == 1">
                            <el-text>得分</el-text>
                            <el-tag  style="margin-left: 40px;"  type="danger" effect="dark">
                                {{ score }}
                            </el-tag>
                        </div>
                        <div style="margin-top:20px;" v-else>
                            <el-text>得分</el-text>
                            <el-tag  style="margin-left: 40px;"  type="info" effect="dark">
                                待批改
                            </el-tag>
                         
                        </div>


                    </el-col>

                </el-row>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisibleInfo = false">取消</el-button>
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
import { RequestTasklistListData,RequestTaskSaveData,RequestTasklistListInfoData,RequestIfViewsInfoData } from '~/api/as.js'
import { useRouter,useRoute } from 'vue-router'
import { RequestUp } from '~/api/uploads.js'
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
 


const downLoadFile =(files) => {
    console.log(files)
    window.location.href = files.filepath
}
const dialogVisible = ref(false) 
const dialogVisibleInfo = ref(false)
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
    "termid":"",//学期
    "bid":"",//班级
    "kid":"",//科目
    "tid":"",//审核人
    "title":"",//作业
    "fraction":"",//分数
    "ask":"",//要求
})
//打开详情
const dataFile = ref(0)
const dataInfo = ref(0)
const ascontent = ref(0)
const score = ref(0)
const status = ref(0)
const contentInfo = ref("")
const createtime = ref("")
const handleInfo =(item) => {
    fileList.value = []
    fileLists.value = []
    formModel.ascontent = ""
    
    console.log(item)
    dialogVisibleInfo.value = true
    RequestTasklistListInfoData(item.id,store.state.user.id).then(res => {
        console.log(res)
        dataFile.value = res.data.filelist
        dataInfo.value = res.data.list[0]
        ascontent.value = res.data.list[0].ascontent
        score.value = res.data.list[0].score
        status.value = res.data.list[0].status
        createtime.value = res.data.list[0].createtime
        contentInfo.value = res.data.info
    })
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
const ToBack = () => {
    router.push({name:'task:task:list',query:{}})
}
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


//根据判断 来显示添加或者是详情
const datasIfView =(rows) => {
    console.log("rows",rows.id)
    formModel.ascontent =  ''
    RequestIfViewsInfoData(rows.id,store.state.user.id).then(res => {
        console.log("res",res)
        if(res.data.result == 0){
            //暂未上传作业
            answer(rows)
        }else{
            //已上传
            handleInfo(rows)
        }
    })
}


const tinymceHtml = ref("请输入内容");
const init = {
  //初始化数据
  language_url: "/skins/langs/zh-Hans.js", // 引入语言包（该语言包在public下，注意文件名称）
  language: "zh-Hans", // 这里名称根据 zh-Hans.js 里面写的名称而定
  skin_url: "/skins/ui/oxide", // 这里引入的样式
  height: 400, // 限制高度
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
    display:flex;padding-top:6px
    @apply mt-6 mb-6;
}

/* .hide .el-upload--picture-card{
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
} */
/* avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
} */
</style>