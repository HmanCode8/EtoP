<script setup lang="ts">
import { ref, defineProps } from "vue";
const chartVal = ref("");

// 使用 ref 创建响应式数据
const count = ref(0);
count.value++; // 修改 count 的值
</script>

<template>
  <div class="h-full bg-[#343540] text-white">
    <div class="chart-contain">
      <div class="user"></div>
      <div class="root"></div>
    </div>
    <el-input class="h-40 bg-[#f00] bg-inherit border" v-model="chartVal" />
    <button>drawer</button>
    <!-- <el-drawer v-model="drawer" :direction="direction">
      <template #header>
        <h4>set title by slot</h4>
      </template>
      <template #default>
        <div>dada</div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-input></el-input>
        </div>
      </template>
    </el-drawer> -->
  </div>
</template>

<style scoped lang="scss"></style>
