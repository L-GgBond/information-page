import { ref,reactive,onMounted} from 'vue'
import { RequestUploads } from '~/api/uploads.js'
import request from "~/utils/request.js";
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
// import "tinymce/plugins/pagebreak";
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


const tinymceHtml = ref("请输入内容");

export function inits(){
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
        
} 

