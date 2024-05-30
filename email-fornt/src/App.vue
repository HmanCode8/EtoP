<script setup>
import { provide } from 'vue';
import gsap from 'gsap';
provide('gsap', gsap); // 提供gsap实例给子组件

// 美化打印实现方法
// const prettyLog = () => {
//   const isEmpty = (value) => {
//     return value == null || value === undefined || value === '';
//   };
//   const prettyPrint = (title, text, color) => {
//     console.log(
//       `%c ${title} %c ${text} %c`,
//       `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
//       `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
//       'background:transparent'
//     );
//   };
//   // 基础信息打印
//   const info = (textOrTitle, content = '') => {
//     const title = isEmpty(content) ? 'Info' : textOrTitle;
//     const text = isEmpty(content) ? textOrTitle : content;
//     prettyPrint(title, text, '#102d25');
//   };
//   return {
//     info
//   };
// };

// // 创建打印对象
// const log = prettyLog();

// // 不带标题
// log.info('这是基础信息!');

// //带标题
// log.info('注意看', '这是个男人叫shihenghe!');

console.log('%c 这是个男人叫shihenghe', 'color: #102d25; font-size: 20px;');
</script>

<template>
  <router-view></router-view>
  <Theme />
  <el-backtop :right="40" :bottom="100" />

  <!-- <div class="app-footer">底部</div> -->
</template>

<style scoped lang="scss"></style>
