<template>
    <el-card>
        <div style="display:flex">
          <div ref="main" style="width: 50%; height: 280px;border: px solid red;"></div>
          <div style="width: 50%; height: 280px;border: px solid red;"></div>
        </div>
        <div ref="brokenline" style="width: 100%; height: 300px;border: px solid red;">
        </div>
    </el-card>
  <router-view></router-view>
</template>
<script setup>
 import { ref, onMounted } from "vue";
 import * as echarts from "echarts";
 import store from '~/store'
 import { RequestGetNumberData } from '~/api/index.js'
import { forEach } from "lodash";


// const arrData = ref([])
const mainData = ref([])
const mainDataTotal = ref(0)
const toDay1 = ref(0)
const toDay2 = ref("")
const toDay3 = ref(0)
const toDay4 = ref(0)
const toDay5 = ref(0)
const toDay6 = ref(0)
const toDay7 = ref(0)

var day = 0;
var arrData = []
// const arrData = ref([])
 function indexInit(){
  RequestGetNumberData(store.state.user.id).then(res => {
    mainDataTotal.value = res.data.total
    day = res.data.toDay1
    toDay1.value = res.data.toDay1
    toDay2.value = res.data.toDay2
    toDay3.value = res.data.toDay3
    toDay4.value = res.data.toDay4
    toDay5.value = res.data.toDay5
    toDay6.value = res.data.toDay6
    toDay7.value = res.data.toDay7

    res.data.records.forEach(item => {
      mainData.value.push(item)
      // arrData.value.push(item.name)
      arrData.push(item.name)
   })
  })
 }
 console.log("mainData",mainData.value)
 console.log("mainData",mainDataTotal.value)
 console.log("arrData",arrData)



 indexInit()

 
 const main = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
 onMounted(() => {
  console.log("1",store.state.user.id)
  //  init();
  //  brokenlineInit();
 });

 setTimeout(() => {
    init();
    brokenlineInit();
  }, 500);
 
 function init() {
   // 基于准备好的dom，初始化echarts实例
   const myChart = echarts.init(main.value);
   var schoolData;
   if(mainDataTotal.value == 0){
     schoolData = [{name:"班级",value:0}]
   }else{
     schoolData = mainData.value
   }
   

   // 指定图表的配置项和数据
   const option = {
     title: {
      //  text: '个人存款',
       left: 'center'
     },
     tooltip: {
       trigger: 'item',
       formatter: '<br/>{b} : {c} ({d}%)'
     },
     legend: {
       orient: 'vertical',
       left: 'left',
       data: []
     },
     series: [
       {
         type: 'pie',
         radius: '65%',
         center: ['50%', '50%'],
         data: [{ value: 335, name: '' }]
       }
     ]
   };
 // 赋值
   option.series = [
   {
     type: 'pie',
     radius: '60%',
     center: ['50%', '45%'],
    //  data: res.data.map((v) => {
    //    return { name: v.classname, value: v.total }
    //  }),
     data: schoolData,
   }
 ]
 // 赋值
 // option.legend = [
 //   {
 //    data: schoolData.map((a) => a.name)
 //   }
 // ]
 // 赋值
 option.legend.data = schoolData.map((a) => a.name)
   // 使用刚指定的配置项和数据显示图表。
   myChart.setOption(option);
 }


 function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+"-"+m+"-"+d;
}

 const brokenline = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
 function brokenlineInit(){
  // alert(day)
  // alert(toDay2.value)
  const myCharts = echarts.init(brokenline.value);
    const options = {
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ['product', '2023'],
          // [GetDateStr(-6), toDay7.value ? toDay7.value + Math.ceil(Math.random()*10) : toDay7.value ],
          // [GetDateStr(-5), toDay6.value ? toDay6.value + Math.ceil(Math.random()*10) : toDay6.value ],
          // [GetDateStr(-4), toDay5.value ? toDay5.value + Math.ceil(Math.random()*10) : toDay5.value ],
          // [GetDateStr(-3), toDay4.value ? toDay4.value + Math.ceil(Math.random()*10) : toDay4.value ],
          // [GetDateStr(-2), toDay3.value ? toDay3.value + Math.ceil(Math.random()*10) : toDay3.value ],
          // [GetDateStr(-1), toDay2.value ? toDay2.value + Math.ceil(Math.random()*10) : toDay2.value ],
          // [GetDateStr(-0), toDay1.value ? toDay1.value + Math.ceil(Math.random()*10) : toDay1.value ],


          [GetDateStr(-6), toDay7.value ],
          [GetDateStr(-5), toDay6.value ],
          [GetDateStr(-4), toDay5.value ],
          [GetDateStr(-3), toDay4.value ],
          [GetDateStr(-2), toDay3.value ],
          [GetDateStr(-1), toDay2.value ],
          [GetDateStr(-0), toDay1.value ],
        ]
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [
        { type: 'bar' },
        { type: 'bar' },
        { type: 'bar' }
      ]
  };
  myCharts.setOption(options);
  console.log("initss")
 }
</script>