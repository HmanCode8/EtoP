<script setup lang="ts">
import { ref, defineProps } from "vue";

// 定义 props
const props = defineProps({
  message: String,
});

// 使用 ref 创建响应式数据
const count = ref(0);
count.value++; // 修改 count 的值
</script>

<template>
  <div class="title">今日热点</div>
  <div class="new-list">
    <div class="new-item"></div>
  </div>
</template>

<style scoped lang="scss"></style>
