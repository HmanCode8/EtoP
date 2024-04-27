<!-- 工具组件弹窗 -->
<script setup lang="ts">
import { ref } from "vue";

const dialogVisible = ref(false); // 弹窗显示状态
</script>

<template>
  <el-dialog v-model="dialogVisible" title="图片详情" width="80%" draggable>
    <!-- 默认插槽内容 -->
    <slot></slot>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
