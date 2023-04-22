<template>
    <el-card shadow="never" class="border-0" style="position: relative;">
        <ListHeader @create="handleCreate" @refresh="getData"/>
        <el-table :data="tableData"  style="width: 1100px;top: 20px;" v-loading="loading" >
            <el-table-column prop="id"  label="#" />
            <el-table-column label="头像"  width="120px">
                <template #default="scope">
                    <el-avatar style="cursor: pointer;" @click="getImageViewss(scope.row.avatar)" :size="50" :src="scope.row.avatar" />
                </template>
            </el-table-column>
            
            <el-table-column prop="title" label="用户名">
                <template #default="scope">
                    <el-tag :key="scope.row.id" type="info" effect="dark">
                        {{ scope.row.nickname }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag class="ml-2" v-if="scope.row.status == 1" type="success">已批改</el-tag>
                    <el-tag class="ml-2" v-if="scope.row.status == 0" type="danger">待批改</el-tag>
                    <el-tag class="ml-2" v-if="scope.row.status == 2" type="danger">已驳回</el-tag>
                    <el-tag class="ml-2" v-if="scope.row.status == 3" type="warning">驳回已更改</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createtime"  label="时间">
                 <template #default="scope">
                {{ scope.row.createtime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')  }}    
                </template>
            </el-table-column>
            
            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="detailedInformation(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pages" style="display:flex;padding-top:6px">
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
    </el-card>

   <el-drawer  v-model="formDrawerRef" title="详情"  size="65%"  :with-header="false">
    <el-form ref="formRef" :model="formModel" :rules="formRules"  label-width="auto">
        <el-table :data="tableDataInfo" style="width: 100%" type="index">
          
            <el-table-column prop="kmname" label="科目" width="180" />

            <el-table-column  label="附件" width="180">
                <template #default="scope">
                    <el-image style="width: 50px; height: 50px" :src="scope.row.files"  />
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" />
           
            <el-table-column label="评分">
                <template #default="scope">
                    <el-form-item prop="grade">
                        <!-- {{ scope.row }} -->
                        <el-input type="number" v-model="formModel.grade[scope.row.id]" @blur="InputBlur(scope.row.id)" 
                        :placeholder="scope.row.grade" v-if="scope.row.grade != 0" disabled="" />

                        <el-input type="number" v-model="formModel.grade[scope.row.id]" @blur="InputBlur(scope.row.id,scope.row.tid)" 
                        :placeholder="scope.row.grade" v-else />
                    </el-form-item>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
    </el-drawer>

    <!-- 添加作业 -->
    <form-drawer ref="formDrawerRefAddData" :title="t"  size="50%"  destroyOnClose @submit="handleDrawerSubmitAdd">
        <el-form ref="formRefAdd" :model="formModelAdd" :rules="formRulesAdd"  label-width="auto">
            <el-row>
                <!-- <el-col :span="10"> -->
                    <div style="padding:10px">
                       
                        <el-form-item label="学期" prop="termid">
                            <el-radio-group v-for="(item,index) in termData" v-model="formModelAdd.termid">
                                <el-radio style="margin-right:15px" :label="item.id" >{{item.termname}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="班级" prop="bid">
                            <el-radio-group v-for="(item,index) in classData" v-model="formModelAdd.bid" @change="changeRadioClass(item)">
                                <el-radio style="margin-right:15px" :label="item.id" >{{item.classname}}</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="科目" prop="kid">
                            <el-radio-group v-for="(item,index) in subData" v-model="formModelAdd.kid">
                                <el-radio style="margin-right:15px" :label="item.id" v-if="item.status == 1" disabled>{{item.subjectname}}</el-radio>
                                <el-radio style="margin-right:15px" :label="item.id" v-else>{{item.subjectname}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="formModelAdd.title" />
                        </el-form-item>
                        <el-form-item label="分数" prop="fraction">
                            <el-input type="number" v-model="formModelAdd.fraction" />
                        </el-form-item>

                        <div class="grid-content bg-purple-light" style="display:flex">
                            <el-text style="font-size:14px;width:30px;color: var(--el-text-color-regular);margin-left:10px">
                                要求
                            </el-text>
                            <div class="app-container" style="margin-left:13px;">
                                <editor id="tinymce" v-model="formModelAdd.ask" :init="init"></editor>
                            </div>
                        </div> 
                    </div>
            </el-row>
        </el-form>
    </form-drawer>


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
                                <el-text v-html="contentInfo.ask" @click="openImage" class="yq"></el-text>
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
                                <el-text>{{contentInfo.createtime}}</el-text>
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
                                        <!-- <el-image v-if="filetype = 'image/jpeg'" style="width: 100px; height: 100px;margin-right:10px" :src="item.filepath"  /> -->
                                        <el-image  @click="getImageViews(item)" v-if="item.filetype == 'image/jpeg' || item.filetype == 'image/gif' || item.filetype == 'image/png' ||  item.filetype == 'image/svg'" style="cursor: pointer;width: 100px; height: 100px;margin-right:10px" :src="item.filepath"  />
                                        <el-image v-else style="width: 100px; height: 100px;margin-right:10px;cursor: pointer;" @click="downLoadFile(item)" src="/src/assets/x.png"  />
                                        
                                        <!-- <el-image v-else style="width: 100px; height: 100px;margin-right:10px" src="/src/assets/x.png"  /> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex;">
                            <div style="margin-top:15px;display:flex;">
                                <span class="demonstration" style="margin-top:15px;">内容</span>
                                <div v-html="ascontent" style="margin-left: 45px;" class="ascontentnr">
                                </div>
                            </div>
                        </div>
                        <div style="margin-top:20px;" v-if="statusIf == 1">
                            <el-text >得分</el-text>
                            <el-tag  style="margin-left: 45px;" type="success" effect="dark">
                                {{ score }}
                            </el-tag>
                        </div>
                        <div style="margin-top:20px;" v-if="statusIf == 0">
                            <el-text>得分</el-text>
                            <el-tag style="margin-left: 45px;"  type="info" effect="dark">
                                待批改
                            </el-tag>
                        </div>
                        
                        <div style="margin-top:20px;" v-if="statusIf == 2">
                            <el-text>得分</el-text>
                            <el-tag style="margin-left: 45px;"  type="danger" effect="dark">
                                已驳回,等待学生重新上传
                            </el-tag>
                        </div>
                        <div style="margin-top:20px;" v-if="statusIf == 3">
                            <el-text>得分</el-text>
                            <el-tag style="margin-left: 45px;"  type="warning" effect="dark">
                                驳回已修改
                            </el-tag>
                        </div>

                        <div style="margin-top:20px;margin-left: 20px;" v-if="statusIf == 0 || statusIf == 3">
                            <el-form ref="formRefSubmit" :model="formModelSubmit" :rules="formRulesSubmit">
                                <el-form-item label="打分" prop="score">
                                    <el-input type="number"   v-model="formModelSubmit.score"  />
                                </el-form-item>
                            </el-form>
                        </div>

                    </el-col>
                </el-row>
            </div>
            <template #footer>
            <span class="dialog-footer" >
                 <el-button type="danger"  @click="reject()" v-if="statusIf != 1 && statusIf != 2">驳回</el-button>
                 <el-button type="danger" @click="rejectInfoData" v-if="statusIf == 2">查看驳回信息</el-button>
                 <el-button type="primary"  @click="grade()" v-if="statusIf == 0 || statusIf == 3">提交</el-button>
                <el-button @click="dialogVisibleInfo = false">取消</el-button>
            </span>
            </template>
        </el-dialog>



        <el-dialog
            v-model="dialogReject"
            title="驳回"
            width="90%">
            <div>
                <div class="app-container" style="margin-left:13px;">
                        <editor id="tinymce" v-model="formModelReject.reject" :init="init"></editor>
                </div>
            </div> 
            <template #footer>
            <span class="dialog-footer" >
                 <el-button type="primary"  @click="rejectSubmit()">提交</el-button>
                <el-button @click="dialogReject = false">取消</el-button>
            </span>
            </template>
         </el-dialog>


         <el-dialog
            v-model="dialogRejectInfo"
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
                <el-button @click="dialogRejectInfo = false">取消</el-button>
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
import { computed } from "@vue/reactivity";
import { toast } from '~/utils/common'
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { RequestDeleteData,RequestInfoData,RequestSaveData,RequestCreateData } from '~/api/tea.js'
import { RequestAssListData, RequestSubmitAssListData,RequestSubmitInfoData,RequestSubmitInfoSaveData,RequestReject,rejectInfos } from '~/api/as.js'
import { RequestClassListData } from '~/api/student.js'
import { RequestListData,RequestInfoDataClass } from '~/api/class.js'
import { RequestListDatas } from '~/api/subject.js'
import { createRouter, useRouter,useRoute } from 'vue-router'
import { RequestUploads } from '~/api/uploads.js'
import request from "~/utils/request.js";
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce/tinymce";
import  "~/components/tinymce.js"  


const showImageViewer = ref(false)
const showImageViewers = ref(false)
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
const getImageViews =(item) => {
    console.log(item)
    srcLists.value = [item.filepath];
    showImageViewers.value = true;
}
const getImageViewss =(item) => {
    console.log(item)
    srcLists.value = [item];
    showImageViewers.value = true;
}
const closeImgViewers =() => {
    showImageViewers.value = false;
}

const dialogReject = ref(false)
const formRefReject = ref(null)
const formModelReject = reactive({
    "reject":""
})
const reject =() => {
    dialogVisibleInfo.value = false
    dialogReject.value = true    
}
const rejectSubmit =() => {
    console.log(saveId.value)
    console.log(formModelReject.reject)
    console.log(formModelReject.reject.length)
    if(formModelReject.reject.length < 1){
        toast("驳回内容不可为空","error")
        return false;
    }
    RequestReject(saveId.value,formModelReject.reject).then(res => {
        console.log(res)
        if(res.code == 200){
            toast("驳回成功")
            dialogReject.value = false    
            getListTableData()
        }
    })

}

const dialogRejectInfo = ref(false)
const rejectid = ref(0)
const rejectuid = ref(0)
const rejectInfoData =() => {
    console.log(rejectid.value)
    console.log(rejectuid.value)
    rejectInfos(rejectid.value,rejectuid.value).then(res => {
        console.log(res)
        if(res.code == 200){
            formModelReject.reject = res.data.info.reject
           
        }
    })
    dialogRejectInfo.value = true
    dialogVisibleInfo.value = false
}


const formDrawerRefAddData = ref(false)
const downLoadFile =(files) => {
    console.log(files)
    window.location.href = files.filepath
}
const changeRadioClass =(item) => {
    RequestInfoDataClass(item.id).then(res => {
        let arrSubData = [];
        subData.value.forEach((rows ,index)=> {
             if(res.data.subjects.filter(obj => obj.id == rows.id).length > 0){
                console.log(rows)
                rows.status = 0;
                arrSubData.push(rows)
             }else{
                rows.status = 1;
                arrSubData.push(rows)
             }
        })
        subData.value = arrSubData
    })
}

const router = useRouter()
const route = useRoute()
const id = route.query.id
const rid = route.query.rid
const aid = route.query.aid
console.log("id"+id)
console.log("rid"+rid)
console.log("aid"+aid)

const saveId = ref(0)
const formRefSubmit = ref(null)
const formModelSubmit = reactive({
    "score":'',
})

const formRulesSubmit = {
    score: [ { required: true, message: '请填写分数', trigger: 'blur' } ],
}

const grade =() => {
    formRefSubmit.value.validate((valid) => {
        console.log(valid)
        console.log(saveId.value)
        console.log(formModelSubmit.score)
        if(valid){
            RequestSubmitInfoSaveData(saveId.value,formModelSubmit.score).then(res => {
                console.log(res)
                if(res.code == 200){
                    toast("打分成功！！")
                    dialogVisibleInfo.value = false
                    getListTableData()
                    
                }
            })
        }

    })
}
const dialogVisibleInfo = ref(false)
const contentInfo = ref([])
const dataFile = ref([])
const ascontent = ref(null)
const statusIf = ref("")
const score = ref(0)
const detailedInformation =(rows) =>{
    console.log(rows)
    rejectid.value = rows.aid
    rejectuid.value = rows.userid
    contentInfo.value = []
    RequestSubmitInfoData(rows.aid,rows.userid).then(res => {
        console.log(res)
        if(res.code == 200){
            dataFile.value = res.data.filelist
            contentInfo.value = res.data.info
            ascontent.value = res.data.list[0].ascontent
            statusIf.value = res.data.list[0].status
            score.value = res.data.list[0].score
            saveId.value = res.data.list[0].id
        }
    })
    dialogVisibleInfo.value = true
}

const ToBack = () => {
    router.push({name:'Assignment',query:{id:id,rid:rid}})
}

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
    RequestSubmitAssListData(current.value,size.value,aid).then(res => {
        console.log(res)
        if(res.code == 200){
            tableData.value = res.data.list
        }
    })

}
getListTableData()





//添加作业
const t = ref("发布作业");
const formModelAdd = reactive({
    "tid":"",
    "termid":"",
    "bid":"",
    "kid":"",
    "title":"",
    "ask":"",
    "fraction":"",
})
const formRulesAdd = {
    termid:[{ required: true, message: '请选择学期', trigger: 'blur' }],
    bid:[{ required: true, message: '请选择班级', trigger: 'blur' }],
    kid:[{ required: true, message: '请选择科目', trigger: 'blur' }],
    title:[{ required: true, message: '请填写标题', trigger: 'blur' }],
    fraction:[{ required: true, message: '请填写分数', trigger: 'blur' }],
    ask:[{ required: true, message: '请填写要求', trigger: 'blur' }],
};
const handleDrawerSubmitAdd =() =>{
    console.log(formModelAdd)
    formRefAdd.value.validate((valid) => {
        console.log(valid)
        if(valid){
            RequestCreateData(store.state.user.id,formModelAdd).then(res => {
                console.log(res)
                if(res.code == 200){
                    toast("发布作业成功")
                    getListTableData()
                    formDrawerRefAddData.value.close()
                }
            })
        }
    })

}

const OpenView =(row) => {
    console.log(row)
    router.addRoute('admin',{
        path: "/tea/assignment",
        name:"Assignment",
        component: () => import("~/views/tea/Assignment.vue")
    })
    
    router.push({name:'Assignment',query:{id:row.bid}})
    // router.go(-1)
}

const formRefAdd = ref(null);

const classData = ref([])
const termData = ref([])
const subData = ref([])
const handleCreate =() => {
    formModelAdd.termid = ""
    formModelAdd.tid = ""
    formModelAdd.bid = ""
    formModelAdd.kid = ""
    formModelAdd.title = ""
    formModelAdd.ask = ""
    formModelAdd.fraction = ""
    classData.value = ""
    subData.value = ""
    formDrawerRefAddData.value.open()
    RequestListDatas(store.state.user.id).then(res => {
        console.log(res)
        let subs = []
        res.data.records.forEach(item => {
            item.status = 1
            subs.push(item)
        })
        subData.value = subs
        termData.value = res.data.term
    })
    RequestClassListData(store.state.user.id).then(res=>{
        if(res.code == 200){
            classData.value = [];// res.data
            const arr = [];
            for(var i = 0; i < res.data.length;i++){
                // console.log(res.data[i])
                if(res.data[i].hasOwnProperty("id")){
                    console.log("存在")
                    classData.value = res.data
                }else{
                    console.log("不存在")
                    arr.push({"id":res.data[i][0],"classname":res.data[i][1]})
                    classData.value = arr
                    console.log(arr)
                }
            }
           
        }
     })
}








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

const formModel = reactive({
    "grade":[]
})
const infoId = ref(null);
const tableDataInfo = ref(null)
const handleTaskInfo =(id) =>{
    console.log(id)
    infoId.value = id;

    RequestInfoData(id).then(res => {
        console.log(res)
        res.data.forEach(item => {
            // formModel.grade.push({
            //     item.id:item.grade
            // })
            formModel.grade[item.id] = ''
        })
        tableDataInfo.value = res.data
        
    })
    formDrawerRef.value = true 
}

const InputBlur =(id,tid) =>{
   console.log(id)
   console.log(formModel.grade[id])
   var a = Number(formModel.grade[id])
   if(a !== 0 && a !== " " && a != "0" && a > 0){
        RequestSaveData(id,{grade:formModel.grade[id],tid:tid}).then(res => {
            if(res.code == 200){
                toast("评分成功！")
                getListTableData()
            }
    })
   }else{
    toast("默认是0分","error")
   }
}



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
        @apply mt-6 mb-6;
        padding-top:6px;
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

    /* .demonstration{
        width:100px
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
</style>