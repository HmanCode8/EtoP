<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

const initChart = () => {
  // 基于准备好的 dom，初始化 echarts 实例
  let myChart = echarts.init(document.querySelector('#chartBottom1'))
  // 绘制图表
  const colorList = [
    [
      '#ff7f50',
      '#87cefa',
      '#da70d6',
      '#32cd32',
      '#6495ed',
      '#ff69b4',
      '#ba55d3',
      '#cd5c5c',
      '#ffa500',
      '#40e0d0',
      '#1e90ff',
      '#ff6347',
      '#7b68ee',
      '#d0648a',
      '#ffd700',
      '#6b8e23',
      '#4ea397',
      '#3cb371',
      '#b8860b',
      '#7bd9a5',
    ],
    [
      '#ff7f50',
      '#87cefa',
      '#da70d6',
      '#32cd32',
      '#6495ed',
      '#ff69b4',
      '#ba55d3',
      '#cd5c5c',
      '#ffa500',
      '#40e0d0',
      '#1e90ff',
      '#ff6347',
      '#7b68ee',
      '#00fa9a',
      '#ffd700',
      '#6b8e23',
      '#ff00ff',
      '#3cb371',
      '#b8860b',
      '#30e0e0',
    ],
    [
      '#929fff',
      '#9de0ff',
      '#ffa897',
      '#af87fe',
      '#7dc3fe',
      '#bb60b2',
      '#433e7c',
      '#f47a75',
      '#009db2',
      '#024b51',
      '#0780cf',
      '#765005',
      '#e75840',
      '#26ccd8',
      '#3685fe',
      '#9977ef',
      '#f5616f',
      '#f7b13f',
      '#f9e264',
      '#50c48f',
    ],
  ][2]

  const option = {
    // 图表标题
    title: {
      show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
      text: '"2020年11月份第1周各单品被特采次数   ', //主标题文本，'\n'指定换行
      x: 'center', // 水平安放位置，默认为左对齐，可选为：
      // 'center' ¦ 'left' ¦ 'right'
      // ¦ {number}（x坐标，单位px）
      y: 'bottom', // 垂直安放位置，默认为全图顶端，可选为：
      // 'top' ¦ 'bottom' ¦ 'center'
      // ¦ {number}（y坐标，单位px）
      //textAlign: null          // 水平对齐方式，默认根据x设置自动调整
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#ccc', // 标题边框颜色
      borderWidth: 0, // 标题边框线宽，单位px，默认为0（无边框）
      padding: 5, // 标题内边距，单位px，默认各方向内边距为5，
      // 接受数组分别设定上右下左边距，同css
      itemGap: 10, // 主副标题纵向间隔，单位px，默认为10，
      textStyle: {
        fontSize: 18,
        fontWeight: 'bolder',
        color: '#333', // 主标题文字颜色
      },
      subtextStyle: {
        color: '#aaa', // 副标题文字颜色
      },
    },
    backgroundColor: '#fff',
    tooltip: {},
    animationDurationUpdate: function (idx) {
      // 越往后的数据延迟越大
      return idx * 100
    },
    animationEasingUpdate: 'bounceIn',
    color: ['#fff', '#fff', '#fff'],
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 500,
          edgeLength: 10,
        },
        roam: true,
        label: {
          normal: {
            show: true,
          },
        },
        data: [
          {
            name: '生菜\n\n1次',
            value: 1,
            symbolSize: 150,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[5],
                color: colorList[5],
              },
            },
          },
          {
            name: '章鱼爪\n\n1次',
            value: 1,
            symbolSize: 150,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[8],
                color: colorList[8],
              },
            },
          },
          {
            name: '鲷鱼片\n\n1次',
            value: 2,
            symbolSize: 150,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[12],
                color: colorList[12],
              },
            },
          },
          {
            name: '乳山鲜生蚝(盒)\n\n1次',
            value: 2,
            symbolSize: 150,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[13],
                color: colorList[13],
              },
            },
          },
          {
            name: '莲藕\n\n1次',
            value: 3,
            symbolSize: 150,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[14],
                color: colorList[14],
              },
            },
          },
          {
            name: '淮山\n\n2次',
            value: 5,
            symbolSize: 200,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[16],
                color: colorList[16],
              },
            },
          },
          {
            name: '长鲜鱿(盒)\n\n2次',
            value: 7,
            symbolSize: 200,
            draggable: true,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: colorList[19],
                color: colorList[19],
              },
            },
            url: 'https://gallery.echartsjs.com/preview.html?c=xPLngHx_Z&v=1',
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
  <div id="chartBottom1" style="width: 100%; height: 98%" class=" pt-5"></div>
</template>

<style scoped></style>
