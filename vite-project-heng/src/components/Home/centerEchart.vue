<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

const initChart = () => {
  // 基于准备好的 dom，初始化 echarts 实例
  let myChart = echarts.init(document.querySelector('#chart') || null)
  // 绘制图表
  const option = {
    backgroundColor: '#0c2d55',
    series: [
      {
        name: '空调温度',
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '98%',
        min: 16,
        max: 30,
        startAngle: 180,
        endAngle: 0,
        splitNumber: 2,
        axisLine: {
          lineStyle: {
            color: [
              [0.35, '#ff7f50'],
              [1, '#91dff1'],
            ],
            width: 0,
          },
        },
        splitLine: {
          // 分隔线
          show: true,
          length: -16,
          distance: 10,
          lineStyle: {
            width: 7,
            color: 'auto',
          },
        },
        axisTick: {
          // 刻度线样式（及短线样式）
          show: true,
          splitNumber: 7,
          lineStyle: {
            width: 7,
            color: 'auto',
          },
          length: -10,
          distance: 10,
        },
        axisLabel: {
          show: true,
          color: '#91dff1',
          fontSize: 22,
          distance: -54,
          formatter: '{value}℃',
        },
        detail: {
          fontSize: '40',
          formatter: '{value}℃',
          color: 'auto',
          offsetCenter: ['0', '0%'],
        },
        pointer: {
          show: true,
          width: 20,
          length: 30,
          icon: 'arrow',
          offsetCenter: [0, '-98%'],
          itemStyle: {
            color: '#ff7f50', // 箭头颜色
            shadowColor: '#ff7f50',
            shadowBlur: 10,
          },
        },
        data: [
          {
            value: 20,
            name: '当前温度',
            title: {
              show: true,
              color: '#ff7f50',
              offsetCenter: [0, '-25%'],
              fontSize: 24,
            },
          },
        ],
      },
    ],
  }
  myChart.setOption(option)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div id="chart" style="width: 100%; height: 98%" class=" pt-5"></div>
</template>

<style scoped></style>
