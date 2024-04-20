<script setup>
import { ref } from 'vue'
const scrollContainer = ref(null)

// 处理滚动事件
const handleScroll = () => {
  console.log('滚动中...')
}
</script>

<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <slot></slot>
  </div>
</template>

<style scoped>
.custom-scroll {
  /* overflow: auto; */
  
}
</style>
