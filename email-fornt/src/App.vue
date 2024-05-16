<script setup>
import { provide } from 'vue';
import gsap from 'gsap';
provide('gsap', gsap); // 提供gsap实例给子组件
</script>

<template>
  <router-view></router-view>
  <Theme />
  <!-- <div class="app-footer">底部</div> -->
</template>

<style scoped lang="scss"></style>
