<template>
   <el-card>
    <el-form ref="formRef" :model="formModel" :rules="formRules"  label-width="auto">
      <el-form-item label="学期" prop="schoolterm">
        <el-select  v-model="formModel.schoolterm" placeholder="请选择学期">
            <template v-for="(item,index) in tableTermDate" >
                <el-option :label="item.termname" :value="item.termname" />
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
                    <el-upload :action="RequestUploads" list-type="picture-card" multiple="false" name="f" :limit=1 
                    :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :class="{hide:hideUpload}" :on-progress="uploadOnChange">
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
                <el-form-item :prop="'content'+item.id">
                    <el-input type="textarea" :model="item.id" placeholder="详细内容"/>
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
import { RequestTermListData,RequestSubjectListData } from '~/api/task.js'
import { RequestUploads } from '~/api/uploads.js'
import { forEach } from 'lodash'

const formModel = reactive({
    "schoolterm":"",
    "subject":[],
    "files":[],
    "content":[]
})

console.log(formModel)

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
                // formModel.files.push({
                //     key:item.id,
                //     value:""
                // })
                formModel.content.push({
                   
                })
            })

        }
    }).finally(err => {
    })
}
tableSubjecDateFunc()

const hideUpload = ref(false)
const avatar = ref()
const handleAvatarSuccess =(file) =>{
 console.log(file)
  if(file.code == 200){
    toast("上传成功")

    formModel.files = file.data
    avatar.value = file.data
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
function onHandleSubmit() {
    console.log(formModel)
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
  