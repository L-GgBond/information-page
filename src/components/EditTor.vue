<template>
    <div class="tinymce-editor">
      <editor
         v-model:myValue="state.inputValue"
         :myValue="myValue"
        :init="init"
        :api-key="apiKey"
        :disabled="disabled"
      />
    </div>
  </template>
   
  <script>
  import { ref,defineExpose,reactive } from 'vue'
  import request from "~/utils/request.js";
  import { RequestUploads } from '~/api/uploads.js'

  // import { fileUpload } from '@/api/cms'
  import tinymce from "tinymce/tinymce";
  import Editor from "@tinymce/tinymce-vue";
   
  // import 'tinymce/themes/modern/theme'
  import "tinymce/themes/silver/theme";
  import "tinymce/icons/default/icons";
  import "tinymce/plugins/image"; // 插入上传图片插件
  import "tinymce/plugins/media"; // 插入视频插件
  import "tinymce/plugins/table"; // 插入表格插件
  import "tinymce/plugins/link"; // 超链接插件
  import "tinymce/plugins/code"; // 代码块插件
  import "tinymce/plugins/lists"; // 列表插件
//   import "tinymce/plugins/contextmenu"; // 右键菜单插件
  import "tinymce/plugins/wordcount"; // 字数统计插件
  import "tinymce/plugins/colorpicker"; // 选择颜色插件
  import "tinymce/plugins/textcolor"; // 文本颜色插件
  import "tinymce/plugins/fullscreen"; // 全屏
  import "tinymce/plugins/help"; // 帮助
  import "tinymce/plugins/charmap";
  import "tinymce/plugins/paste";
  import "tinymce/plugins/print"; // 打印
  import "tinymce/plugins/preview"; // 预览
  import "tinymce/plugins/hr"; // 水平线
  import "tinymce/plugins/anchor";
  import "tinymce/plugins/pagebreak";
  import "tinymce/plugins/spellchecker";
  import "tinymce/plugins/searchreplace";
  import "tinymce/plugins/visualblocks";
  import "tinymce/plugins/visualchars";
  import "tinymce/plugins/insertdatetime";
  import "tinymce/plugins/nonbreaking";
  import "tinymce/plugins/autosave";
  import "tinymce/plugins/fullpage";
  import "tinymce/plugins/toc";
  import "tinymce/plugins/advlist";
  import "tinymce/plugins/autolink";
  import "tinymce/plugins/codesample";
  import "tinymce/plugins/directionality";
  import "tinymce/plugins/imagetools";
  import "tinymce/plugins/noneditable";
  import "tinymce/plugins/save";
  import "tinymce/plugins/tabfocus";
  import "tinymce/plugins/textpattern";
  import "tinymce/plugins/template";
  import axios from "axios";


  export default {
    components: {
      Editor,
    },
    setup(){
        const state = reactive({
            inputValue: ""
        });
        return {
            state
        };
    },
    props: {
      names:"12312312",
      // 传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: "",
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      plugins: {
        type: [String, Array],
        default:
          "lists image media table textcolor wordcount contextmenu preview",
      },
      toolbar: {
        type: [String, Array],
        default:
          "undo redo |formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat table",
      },
    },
   
    data() {
      return {
        apiKey: "jzlds2e6urz6akm9wxp4f70mnwg83d8fovsialqazxowyity",
        // 初始化配置
        init: {
          placeholder: "在这里输入文字",
          language_url: "/skins/langs/zh-Hans.js", // 引入语言包（该语言包在public下，注意文件名称）
          language: "zh-Hans", // 这里名称根据 zh-Hans.js 里面写的名称而定
          skin_url: "/skins/ui/oxide",
          height: 500,
          end_container_on_empty_block: true,
          powerpaste_word_import: "clean",
          advlist_bullet_styles: "square",
          advlist_number_styles: "default",
          imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
          default_link_target: "_blank",
          link_title: false,
          media_live_embeds: true,
          content_style: "img {max-width:100%;}", // 直接自定义可编辑区域的css样式
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          // plugins: this.plugins,
          // toolbar: this.toolbar,
          // @ts-nocheckplugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          plugins:
            "advlist anchor autolink autosave code codesample   hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount",
          // toolbar:'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat | table',
          toolbar: [
            "searchreplace bold italic underline strikethrough fontselect fontsizeselectalignleft aligncenter alignright outdent indentblockquote undo redo removeformat subscript superscript code codesample",
            "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen",
          ],
          font_formats:
            "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
          branding: false,
          menubar: true,
          file_picker_types: "media",
          // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_url:"http://localhost:8086"+RequestUploads, //指定上传图片的后端处理程序的URL。
          images_upload_base_path: "/demo",
          images_upload_handler: async (blobInfo, success, failure) => {
            const formData = new FormData();
            formData.append("f", blobInfo.blob());
            request.post("http://localhost:8086"+RequestUploads, formData).then((res) => {
              console.log(res);
              success(res.data); //将图片展示到编辑器中
            });
            // this.handleImgUpload(blobInfo, success, failure)
          },
        },
        myValue: this.value,
      };
    },
    watch: {
      value(newValue) {
        this.myValue = newValue;
        this.$emit("datas",this.myValue) 
      },
      myValue(newValue) {
        this.$emit("input", newValue);
        this.$emit("datas",this.myValue) 
      },
    },
    mounted() {
      tinymce.init({});
    },
    methods: {
      /**
       * @description 上传文件
       * @param {File} file - 要上传的文件
       * @param {string} type - 文件类型
       * @returns {Object}
       */
      async uploadFile(file, type = "images") {
        /* const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        }); */
        const formData = new FormData();
        formData.append("f", file);
        // request.post("/manage/upload", formData).then((res) => {
        //   success(res);
        // });
        request({
            url: "http://localhost:8086"+RequestUploads,
            method: "post",
            // params: param
            data: formData,
            success(res) {
                success(res.data)
                return {
                    url: res.data,
                    title: "请求成功",
                };
                },
        }); 
        /* request({
          url: "/manage/upload",
          method: "post",
          // params: param
          data: formData,
          success(res) {
            return {
              url: res,
              title: "请求成功",
            };
          },
        }); */
      },
      // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      // 需要什么事件可以自己增加
      onClick(e) {
        this.$emit("onClick", e, tinymce);
      },
      // 可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.myValue = "";
      },
    },
  };
const myValues = ref(100)
let sex=ref('男')
let info=reactive({
    like:'1',
    age:18
})
defineExpose({sex, info})
  </script>
