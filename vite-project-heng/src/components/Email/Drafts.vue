<script setup lang="ts">
import { ref } from "vue";

// 使用 ref 创建响应式数据
const count = ref(0);
count.value++; // 修改 count 的值
</script>

<template>
  <div>默认值</div>
</template>

<style scoped lang="scss"></style>
