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
 import { RequestListData } from '~/api/class.js'

 function indexInit(){
  RequestGetNumberData(store.state.user.id).then(res => {
    console.log(res)
  })
 }
 indexInit()

 const mainData = ref([])
//  function classInit(){
//    RequestListData(1, 100,store.state.user.id).then(res =>{
//         console.log(res)
//         res.data.records.forEach(item => {
//            mainData.value.push({name:item.classname,value:item.total})
//         })
 
//     })
//  }



 const main = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
 onMounted(() => {
  console.log("1",store.state.user.id)
   init();
   brokenlineInit();
 });

//  setTimeout(() => {
//     init();
//   }, 500);
 
 function init() {
    console.log("init")
    console.log( mainData.value)
    console.log("inits")

   // 基于准备好的dom，初始化echarts实例
   const myChart = echarts.init(main.value);
   const schoolData =// mainData.value

   [
     {
       name:"五年级三班",
       value:1
     },
     {
       name:"五年级一班",
       value:2
     },
     {
       name:'三年级一班',
       value:2
     },
     {
       name:'二年级一班',
       value:1
     },
     {
       name:'一年级二班',
       value:2
     }]
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
  console.log("initss")
 }
</script>