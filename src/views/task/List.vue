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
            <!-- <el-table-column  prop="ask" label="要求" /> -->
            <el-table-column  prop="ask" label="要求">
                <template #default="scope">
                    <!-- <el-popover
                    placement="bottom"
                    :title="scope.row.title"
                    :width="360"
                    trigger="hover"
                    :content="scope.row.ask">
                    <template #reference> -->
                        <el-button type="success" @click="getViewInfo(scope.row)" plain size="small">查看</el-button>
                    <!-- </template>
                </el-popover> -->
                </template>
            </el-table-column>

            
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
                                <el-text v-html="contentInfo.ask" style="" @click="openImage" class="yq"></el-text>
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
                                        <el-image @click="getImageViews(item)" v-if="item.filetype == 'image/jpeg' || item.filetype == 'image/gif' || item.filetype == 'image/png' ||  item.filetype == 'image/svg'" style="width: 100px; height: 100px;margin-right:10px;cursor: pointer;" :src="item.filepath"  />
                                        <el-image v-else style="width: 100px; height: 100px;margin-right:10px;cursor: pointer;" @click="downLoadFile(item)" src="/src/assets/x.png"  />
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex;">
                            <div style="margin-top:20px;display:flex;">
                                <span class="demonstration" style="margin-top:15px;">内容</span>
                                <div v-html="ascontent" style="margin-left: 45px;" class="ascontentnr">
                                
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top:20px;" v-if="status == 1">
                            <el-text>得分</el-text>
                            <el-tag  style="margin-left: 40px;"  type="danger" effect="dark">
                                {{ score }}
                            </el-tag>
                        </div>
                        <div style="margin-top:20px;" v-if="status == 0">
                            <el-text>得分</el-text>
                            <el-tag style="margin-left: 45px;"  type="info" effect="dark">
                                待批改
                            </el-tag>
                        </div>
                        
                        <div style="margin-top:20px;" v-if="status == 2">
                            <el-text>得分</el-text>
                            <el-tag style="margin-left: 45px;"  type="danger" effect="dark">
                                已驳回
                            </el-tag>
                        </div>
                        <div style="margin-top:20px;" v-if="status == 3">
                            <el-text>得分</el-text>
                            <el-tag style="margin-left: 45px;"  type="warning" effect="dark">
                                驳回修改已提交，等待批改
                            </el-tag>
                        </div>

                    </el-col>

                </el-row>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" @click="rejectInfoData" v-if="status == 3">查看驳回信息</el-button>
                <el-button @click="dialogVisibleInfo = false">取消</el-button>
            </span>
            </template>
        </el-dialog>


        <el-dialog
            v-model="dialogVisibleReject"
            title="驳回修改"
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
                <el-button type="danger" @click="rejectInfoData">查看驳回信息</el-button>
                <el-button type="primary" @click="handleSubmitFormDataReject">提交</el-button>
                <el-button @click="dialogVisibleReject = false">取消</el-button>
              
            </span>
            </template>
        </el-dialog>


        <el-dialog
            v-model="dialogReject"
            title="驳回信息"
            width="90%">
            <div>
                <div class="app-container" style="margin-left:13px;height: 400px;overflow: auto;">
                    <!-- <el-form  label-width="120"> -->
                        <!-- <el-form-item label="内容"> -->
                            <el-row>
                                <el-col :span="10">
                                     <el-text class="txt" truncated v-html="formModelReject.reject"/>
                                </el-col>
                            </el-row>
                            <!-- <el-input v-model-html="formModelReject.reject" disabled type="textarea" /> -->
                            <!-- </el-form-item> -->
                        <!-- </el-form> -->
                </div>
            </div> 
            <template #footer>
            <span class="dialog-footer" >
                <el-button @click="dialogReject = false">取消</el-button>
            </span>
            </template>
         </el-dialog>
    </el-card>

    <el-dialog
            v-model="dialogs"
            title="要求信息"
            width="60%">
                <div>
                    <div style="padding-left:35px;padding-top:6px;font-size: 14px;line-height: 40px;">
                                <div>
                                    <el-text>标题：</el-text>
                                    <el-text>{{Infos.title}}</el-text>
                                </div>
                                <div>
                                    <el-text>分数：</el-text>
                                    <el-text>{{Infos.fraction}}</el-text>
                                </div>
                                <div>
                                    <el-text>要求：</el-text>
                                    
                                    <el-text v-html="Infos.ask" class="yq" @click="openImage"></el-text>
                                    <!-- <div v-html="contentInfo.ask"></div> -->

                                </div>
                                <div>
                                    <el-text>科目：</el-text>
                                    <el-text>{{Infos.subject}}</el-text>
                                </div>
                                <div>
                                    <el-text>班级：</el-text>
                                    <el-text>{{Infos.classname}}</el-text>
                                </div>
                                <div>
                                    <el-text>学期：</el-text>
                                    <el-text>{{Infos.termname}}</el-text>
                                </div>
                                <div>
                                    <el-text>审批人：</el-text>
                                    <el-text>{{Infos.username}}</el-text>
                                </div>
                        
                    </div> 
                </div> 
            <template #footer>
            <span class="dialog-footer" >
                <el-button @click="dialogs = false">取消</el-button>
            </span>
            </template>
         </el-dialog>


         <el-image-viewer  :zoom-rate="1.2" style="height:100px;width:100px" @close="closeImgViewer" :url-list="srcList" v-if="showImageViewer" />
         <el-image-viewer  :zoom-rate="1.2" style="height:100px;width:100px"  @close="closeImgViewers" :url-list="srcLists" v-if="showImageViewers" />
</template>
<script setup>
import { ref,reactive,onMounted } from 'vue'
import UploadFile  from 'element-plus'
import store from '~/store'
import { toast } from '~/utils/common'
import {
     RequestTasklistListData,RequestTaskSaveData,RequestTasklistListInfoData,RequestIfViewsInfoData,
     rejectInfos,RequestTaskSaveDataReject,RequestViewsInfoData} from '~/api/as.js'
import { useRouter,useRoute } from 'vue-router'
import { RequestUp } from '~/api/uploads.js'
import { RequestUploads } from '~/api/uploads.js'
import request from "~/utils/request.js";
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce/tinymce";
import  "~/components/tinymce.js"  



const showImageViewer = ref(false)
const showImageViewers = ref(false)
const Infos = ref([])
const dialogs = ref(false)
const getViewInfo = (item) => {
    console.log(item)
    RequestViewsInfoData(item.id,store.state.user.id).then(res => {
        console.log(res)
        if(res.code == 200){
            Infos.value = res.data.info
        }else{
            toast("数据获取失败","error")
        }
    })
    dialogs.value = true
}
const srcList = ref([])
const srcLists = ref([])
const openImage =(e) => {
    console.log(e)
    if (e.target.tagName == 'IMG') {
        console.log(e.target.src)
        let src = event.target.currentSrc;
        srcList.value = [src];
        showImageViewer.value = true;
    }
}
const closeImgViewer =() => {
    showImageViewer.value = false;
}

const closeImgViewers =() => {
    showImageViewers.value = false;
}


const getImageViews =(item) => {
    console.log(item)
    srcLists.value = [item.filepath];
    showImageViewers.value = true;
}
const formDrawerRefAddData = ref(false)
const rejectid = ref(0)
const rejectuid = ref(0)
const dialogReject = ref(false)
const formRefReject = ref(null)
const formModelReject = reactive({
    "reject":"",
})
const downLoadFile =(files) => {
    console.log(files)
    window.location.href = files.filepath
}

const rejectInfoData =() => {
    console.log(rejectid.value)
    console.log(rejectuid.value)
    rejectInfos(rejectid.value,store.state.user.id).then(res => {
        console.log(res)
        if(res.code == 200){
            formModelReject.reject = res.data.info.reject
           
        }
    })
    dialogReject.value = true
    dialogVisibleReject.value = false
}
const dialogVisibleReject = ref(false) 
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
const handleSubmitFormDataReject =() => {
    console.log(aid.value)
    console.log(formModel.ascontent)
    console.log(store.state.user.id)
    console.log(fileLists.value)
    console.log(formModelReject.reject)
    RequestTaskSaveDataReject(aid.value,store.state.user.id,formModel.ascontent,fileLists.value,formModelReject.reject).then(res => {
        console.log(res)
        if(res.code == 200){
            toast("提交成功");
            dialogVisibleReject.value = false
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
    rejectid.value = item.id
    rejectuid.value = store.state.user.id
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

const rejectView =(item) => {
    fileLists.value = []
    fileList.value = []
    aid.value = item.id
    rejectid.value = item.id
    rejectuid.value = item.tid
    console.log(item)
    rejectInfos(rejectid.value,store.state.user.id).then(res => {
        console.log(res)
        if(res.code == 200){
            formModel.ascontent  = res.data.info.ascontent
            formModelReject.reject  = res.data.info.reject
            console.log(res.data.info.reject)
            console.log(formModel.ascontent)
            res.data.imgarr.forEach(item => {
                console.log(item)
                fileLists.value.push({name:item.filename,type:item.filetype,url:item.filepath})
                fileList.value.push({name:item.filename,type:item.filetype,url:item.filepath})
            })
        }
    })
    dialogVisibleReject.value = true
}

const answer =(item) => {
    ascontent.value = ""
    dataFile.value = ""
    fileList.value = []
    fileLists.value = []
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


//根据判断 来显示添加或者是详情或驳回页
const datasIfView =(rows) => {
    console.log("rows",rows.id)
    console.log("rows",rows)
    formModel.ascontent =  ''
    RequestIfViewsInfoData(rows.id,store.state.user.id).then(res => {
        console.log("res",res)
        if(res.data.result == 0){
            //暂未上传作业
            answer(rows)
        }else if(res.data.result == 1 || res.data.result == 3){
            //已上传
            handleInfo(rows)
        }else{
            //驳回
            rejectView(rows)
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
plugins: "advlist anchor autolink autosave code codesample   hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount",
toolbar: [
          "searchreplace bold italic underline strikethrough fontselect fontsizeselectalignleft aligncenter alignright outdent indentblockquote undo redo removeformat subscript superscript code codesample",
          "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen",
        ],
font_formats:
"微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",

branding: false, // //是否禁用“Powered by TinyMCE”
menubar: true, //顶部菜单栏显示
// paste_convert_word_fake_lists: false, // 插入word文档需要该属性
content_css: "/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
images_upload_url: '/demo/upimg.php',
images_upload_handler: async (blobInfo, success, failure) => {
  const formData = new FormData();
  formData.append("f", blobInfo.blob());
  request.post("http://localhost:8086"+RequestUploads, formData).then((res) => {
      console.log(res);
      success(res.data); //将图片展示到编辑器中
  });
  // this.handleImgUpload(blobInfo, success, failure)
  },
};

onMounted(() => {
tinymce.init({}); // 初始化富文本
});
</script>
<style>
.pages{
    float: right;
    display:flex;padding-top:6px;
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
.yq {
    margin-left: 120px;
}
.yq img{
    max-height: 80px;
    max-width: 100px;
}

.ascontentnr img{
    max-height: 80px;
    max-width: 100px;

}
.txt img{
    max-height: 70%;
    max-width: 70%;
}  
.el-image-viewer__canvas img{
    max-height: 80% !important;
    max-width: 80% !important;
}
</style>