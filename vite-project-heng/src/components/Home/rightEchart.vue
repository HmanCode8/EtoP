<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

const initChart = () => {
  // 基于准备好的 dom，初始化 echarts 实例
  let myChart = echarts.init(document.querySelector('#chart3'))
  // 绘制图表
  const option = {
   backgroundColor:'#0b1a2f',
   tooltip: {
      trigger: "axis",
      axisPointer: {
         type: "cross",
         crossStyle: {
            color: "#999"
         }
      }
   },
   grid: {
      containLabel: true,
      top: "20%",
      left: "8%",
      right: "8%",
      bottom: "5%"
   },
   legend: {
      data: ["入库数量", "计划入库数量"],
      top: '10%',
      textStyle: {
         fontSize: 14, //字体大小
         color: "#ffffff" //字体颜色
      }
   },
   xAxis: [
      {
         name: "(时)",
         type: "category",
         data: [
            "2",
            "4",
            "6",
            "8",
            "10",
            "12",
            "14",
            "16",
            "18",
            "20",
            "22",
            "24"
         ],
         axisLine: {
            show: true,
            lineStyle: {
               color: "#3c4553"
            }
         },
         axisTick: {
            show: false
         },
         axisLabel: {
            color: "#838b9e",
            fontSize: 14
         },
         splitLine: {
            show: false,
            lineStyle: {
               color: "#e7e9ef",
               type: "dashed"
            }
         }
      }
   ],
   yAxis: [
      {
         type: "value",
         name: "单位(个)",
         min: 0,
         interval: 5,
         axisLine: {
            show: true,
            lineStyle: {
               color: "#3c4553"
            }
         },
         axisTick: {
            show: false
         },
         axisLabel: {
            color: "#838b9e",
            fontSize: 14
         },
         splitLine: {
            show: true,
            lineStyle: {
               color: "#3c4553",
               type: "dashed"
            }
         }
      }
   ],
   series: [
      {
         name: "入库数量",
         type: "bar",
         data: [0, 0, 0, 2, 3, 4, 5, 6, 17, 20, 9, 15],
         color: "#2df1e3",
         barWidth: "13px",
         itemStyle: {
            barBorderRadius: [5, 5, 5, 5],
            color: {
               type: "linear",
               x: 0,
               y: -0.2,
               x2: 0,
               y2: 1,
               colorStops: [
                  {
                     offset: 0,
                     color: "#2ef3e6"
                  },
                  {
                     offset: 1,
                     color: "#0c605b"
                  }
               ]
            }
         }
      },
      {
         name: "计划入库数量",
         type: "line",
         data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
         color: "#e3b80b",
         symbol: "circle",
         symbolSize: 13
      }
   ]
};
  myChart.setOption(option)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div id="chart3" style="width: 100%; height: 98%" class=" pt-5"></div>
</template>

<style scoped></style>
