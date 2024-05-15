<script setup lang="ts">
import { ref, defineComponent } from "vue";
import { Editor, Viewer } from "@bytemd/vue-next";

// 定义组件
defineComponent({
  name: "Markdowm",
});

// 使用 ref 创建响应式数据
const value = ref("");

// 监听编辑器内容变化
function onChange(v: string) {
  value.value = v;
}
</script>

<template>
  <div class="markdown mt-40">
    <Editor class="editos" @change="onChange" />
    <Viewer class="viewer" :tabindex="2" :value="value"></Viewer>
  </div>
</template>

<style scoped lang="scss"></style>
