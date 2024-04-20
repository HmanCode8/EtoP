<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

const initChart = () => {
  // 基于准备好的 dom，初始化 echarts 实例
  let myChart = echarts.init(document.querySelector('#chartBottom'))
  // 绘制图表
  const startAngle = 240
const endAngle = -60
const option = {
   backgroundColor: '#333',
   title: [
      {
         text: `{value|${15}}\n{name|${'重大危险源'}}`,
         left: 'center',
         bottom: '42%',
         textStyle: {
            rich: {
               value: {
                  fontSize: '50',
                  color: '#ffffff',
                  padding: [8, 0]
               },
               name: {
                  fontSize: '20',
                  color: '#ffffff'
               }
            }
         }
      }
   ],
   series: [
      {
         name: '最外层-刻度尺',
         type: 'gauge',
         radius: '75%',
         startAngle,
         endAngle,
         axisLine: {
            lineStyle: {
               color: [[1, 'rgba(25, 235, 255, 1)']],
               width: 1
            }
         },
         axisTick: {
            distance: -6,
            length: 7,
            lineStyle: {
               color: 'rgba(25, 235, 255, 1)'
            },
            splitNumber: 10
         },
         splitLine: {
            distance: -11,
            length: 14,
            lineStyle: {
               color: 'rgba(25, 235, 255, 1)',
               width: 1
            }
         },
         axisLabel: {
            show: false
         },
         pointer: {
            show: false
         }
      },
      {
         name: '内层带指针',
         type: 'gauge',
         radius: '72%',
         startAngle,
         endAngle,
         axisLine: {
            lineStyle: {
               color: [[1, 'rgba(25, 235, 255, 0.2)']],
               width: 40
            }
         },
         axisTick: {
            show: false
         },
         splitLine: {
            show: false
         },
         axisLabel: {
            show: false
         },
         detail: {
            show: false
         },
         pointer: {
            show: true,
            length: '76%',
            offsetCenter: [0, '-24%'],
            width: 12,
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            itemStyle: {
               color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                     {
                        offset: 0,
                        color: 'rgba(255, 92, 119, 1)'
                     },
                     {
                        offset: 1,
                        color: 'rgba(255, 92, 119, 0)'
                     }
                  ]
               }
            }
         },
         progress: {
            show: true,
            width: 40,
            itemStyle: {
               color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                     {
                        offset: 0,
                        color: 'rgba(255, 92, 119, 1)'
                     },
                     {
                        offset: 1,
                        color: 'rgba(247, 181, 0, 1)'
                     }
                  ]
               }
            }
         },
         data: [
            {
               value: 43
            }
         ]
      },
      {
         name: '中心效果圆',
         type: 'gauge',
         radius: '44%',
         startAngle: 0,
         endAngle: 360,
         axisLine: {
            lineStyle: {
               color: [[1, '#0AFFE9']],
               width: 1
            }
         },
         axisTick: {
            show: false
         },
         splitLine: {
            show: false
         },
         axisLabel: {
            show: false
         },
         detail: {
            show: false
         },
         pointer: {
            show: false
         },
         progress: {
            show: true,
            width: 80,
            itemStyle: {
               color: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                     {
                        offset: 0,
                        color: 'rgb(0, 224, 205, 0)'
                     },
                     {
                        offset: 0.7,
                        color: 'rgba(0, 224, 205, 0)'
                     },
                     {
                        offset: 1,
                        color: 'rgba(10, 255, 233, 1)'
                     }
                  ]
               }
            }
         },
         data: [
            {
               value: 100
            }
         ]
      },
      {
         type: 'pie',
         radius: ['98%', '89.5%'],
         hoverAnimation: false,
         clockWise: false,
         itemStyle: {
               normal: {
                  color: 'rgba(5, 79, 123, 1)'
               }
         },
         label: {
               show: false
         },
         data: [100]
      }
   ]
}
  myChart.setOption(option)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div id="chartBottom"  style="width: 100%; height: 98%" class=" pt-5"></div>
</template>

<style scoped></style>
