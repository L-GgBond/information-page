<template>
    <el-card>
        <div style="display:flex">
          <div ref="main" style="width: 50%; height: 280px;border: px solid red;"></div>
          <!-- <div ref="broken" style="width: 50%; height: 280px;border: px solid red;"></div> -->

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
 import { RequestListData } from '~/api/class.js'
 
 function indexInit(){
  RequestGetNumberData(store.state.user.id).then(res => {
    console.log(res)
  })
 }
 indexInit()


 const mainData = ref([])
 function classInit(){
   RequestListData(1, 100,store.state.user.id).then(res =>{
        console.log(res)
        res.data.records.forEach(item => {
           mainData.value.push({name:item.classname,value:item.total})
          //  console.log(mainData.value)
        })
 
    })
 }
 classInit()
 onMounted(() => {
  brokenlineInit();
   brokeninit()
   init();
 });
//  setTimeout(() => {
//    brokenlineInit();
//    brokeninit()
//    init();
//   }, 500);


const main = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
 function init() {

   // 基于准备好的dom，初始化echarts实例
   const myChart = echarts.init(main.value);
   const schoolData = [
     {
       name:'张三',
       value:4253
     },
     {
       name:'李四',
       value:5691
     },
     {
       name:'王五',
       value:4536
     },
     {
       name:'赵六',
       value:4369
     },
     {
       name:'周七',
       value:5124
     }]////mainData.value
   
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
     // data: res.data.map((v) => {
     //   return { name: v.name, value: v.value }
     // })
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



 const broken = ref()
 function brokeninit(){
  const myChart = echarts.init(broken.value)
 const option = {
  title: {
    // text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};
myChart.setOption(option);
}


 
 const brokenline = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
 function brokenlineInit(){
  const myCharts = echarts.init(brokenline.value);
    const options = {
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ['product', '2015', '2016', '2017'],
          ['Matcha Latte', 43.3, 85.8, 93.7],
          ['Milk Tea', 83.1, 73.4, 55.1],
          ['Cheese Cocoa', 86.4, 65.2, 82.5],
          ['Walnut Brownie', 72.4, 53.9, 39.1]
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
 }
</script>