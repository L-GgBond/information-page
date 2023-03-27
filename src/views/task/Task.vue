<template>
   <el-card>
    <el-form ref="formRef" :model="formModel" :rules="formRules"  label-width="auto">
      <el-form-item label="学期" prop="schoolterm"  >
        <el-select  v-model="formModel.schoolterm" placeholder="请选择学期">
            <template v-for="(item,index) in tableTermDate" >
                <el-option :label="item.termname" :value="item.termname"/>
            </template>
        </el-select>
      </el-form-item>

      <el-form-item label="审批" prop="approver">
        <el-select  v-model="formModel.approver" placeholder="请选择审批人">
            <template v-for="(item,index) in tableTeacherDate" >
                <el-option :label="item.nickname" :value="item.id" />
            </template>
        </el-select>
      </el-form-item>

      <el-form-item label="科目" v-for="(item,index) in tableSubjectDate" class="subjectlabel">
            <el-col :span="6">
                <el-form-item :prop="'subject'+item.id" :key="item.id">
                    <el-input type="text" :model="'subject'+item.id" :placeholder="item.subjectname" />
                </el-form-item>
            </el-col>
        <el-col class="text-center" :span="1" >-</el-col>
            <el-col :span="6" style="text-align: center;">
                <el-form-item label="附件" :prop="'files'+item.id.key">
                    <el-upload :action="RequestUploadsApi+'?id='+index"  :before-upload="beforeUpload"  list-type="picture-card" multiple="false" name="f" :limit=1 
                    :on-success="handleAvatarSuccess"  :on-error="handleAvatarError" :class="{hide:hideUpload[index]}" :on-progress="uploadOnChange">
                        <el-icon><Plus /></el-icon>
                        <template>
                            <div>
                                <img class="el-upload-list__item-thumbnail" :src="item.id.value" alt="" />
                            </div>
                        </template>
                    </el-upload>
                 </el-form-item>
            </el-col>
            <el-col class="text-center" :span="1" >-</el-col>
            <el-col :span="6">
                <el-form-item prop="content">
                    <el-input type="textarea" v-model="formModel.content[index].value" placeholder="详细内容"   />
                    <!-- @change="specifiName($event)" -->
                </el-form-item>
            </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onHandleSubmit">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </template>
  
<script  setup>
import { ref,reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { RequestTermListData,RequestSubjectListData,RequestTeacherListData,RequestTaskSaveData } from '~/api/task.js'
import { RequestUploads,RequestUploadsApi } from '~/api/uploads.js'
import { forEach } from 'lodash'
import store from '~/store/index'

const formModel = reactive({
    "schoolterm":"",
    "approver":"",
    "subject":[],
    "files":[],
    "content":[],

})
const uploadData = ref(null)
console.log(formModel)
function specifiName(e){
console.log('e',e)
}

const tableTermDate = ref([])
function tableTermDateFunc(){
    RequestTermListData().then(res => {
        console.log(res)
        if(res.code == 200){
            tableTermDate.value = res.data
        }
    }).finally(err => {
    })
}
tableTermDateFunc()

const tableSubjectDate = ref([])
function tableSubjecDateFunc(){
    RequestSubjectListData().then(res => {
        console.log(res)
        if(res.code == 200){
            tableSubjectDate.value = res.data
            console.log(res.data)
            res.data.forEach(item =>{
                console.log("item"+item.id)
                formModel.subject.push({
                    key:item.id,
                    value:item.subjectname
                })
                formModel.files.push({
                    key:item.id,
                    value:""
                })
                formModel.content.push({
                    key:item.id,
                    value:""
                })
                
            })
            console.log(tableSubjectDate.value.length)
            // for(var i = 0;i <  tableSubjectDate.value.length;i++){
            //     console.log(i)
            //     // const hideUpload[i] = ref(false)
            // }

        }
    }).finally(err => {
    })
}
tableSubjecDateFunc()


function beforeUpload(){
    
}

const tableTeacherDate = ref([])
function tableTeacherDateFunc(){
    RequestTeacherListData().then(res => {
        console.log("teachder"+res)
        if(res.code == 200){
            tableTeacherDate.value = res.data
        }
    })
}
tableTeacherDateFunc()

const hideUpload = ref(false)

const avatar = ref()
const handleAvatarSuccess =(file) =>{
 console.log(file)
  if(file.code == 200){
    formModel.files[file.data.id].value = file.data.url
    hideUpload[file.data.id] = true
    // avatar.value = file.data.url

  }
}
const handleAvataError =(file) =>{
 console.log(file)
    toast("上传失败","error")
}
const uploadOnChange =(file,fileList) =>{
    hideUpload.value = true;
}

const loading = ref(false);
const formRef = ref(null)

const IsContent =(rule,value,callback) =>{
    console.log(rule)
    console.log(value)
    console.log(callback)
    for(var i =0;i<value.length;i++){
       if(content[i].value == '' || content[i].value == undefined){
        callback(new Error('请输入内容'))
       }else{
        callback()
       }
    }
}

const formRules = {
    schoolterm:[{required:true,message:"请选择学期",trigger:'blur'}],
    approver:[{required:true,message:"请选择审批人",trigger:'blur'}],
    // content:[{validator:IsContent,message:"请输入内容",trigger:'blur'}],
    
}
function onHandleSubmit (){
    console.log(formModel)
    formRef.value.validate((valid) => {
        console.log(valid)
        console.log(store.state.user.id)

        if(valid){
            console.log(formModel.content)
            RequestTaskSaveData({uid:store.state.user.id,subject:formModel.subject,schoolterm:formModel.schoolterm,approver:formModel.approver,files:formModel.files,content:formModel.content})
            .then(res => {
                console.log(res)
            })
        }
    })
   

}
</script>
  
<style>
    .el-radio-group {
        margin-right: 12px;
    }
    .el-upload--picture-card{
        --el-upload-picture-card-size: 68px;
    }
    .el-upload-list--picture-card{
        --el-upload-list-picture-card-size: 68px;
    }
    .el-upload-dragger{
        height: 60px;
        padding: unset !important;
    }
    .hide .el-upload--picture-card{
        display: none;
    }
    .subjectlabel .el-form-item__label-wrap .el-form-item__label{
        line-height: 70px;
    }
</style>
  