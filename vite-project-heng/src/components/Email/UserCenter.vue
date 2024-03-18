<script setup lang="ts">
import { ref } from "vue";

// 使用 ref 创建响应式数据
const circleUrl = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="border-b p-4">个人中心</div>
    <div
      class="user-content border mr-auto w-5/6 h-screen items-center flex flex-col"
    >
      <div class="flex w-1/2 justify-around items-center p-4">
        <el-avatar :size="50" :src="circleUrl" />
        <div class="">2022年22月22日</div>
        <div>早上好，张三</div>
      </div>
      <div class="flex w-1/2 justify-around p-4">
        <el-badge :value="12" class="item text-[#dddddd]">
          <ChatLineRound />
          <div class="">未读邮件</div>
        </el-badge>
        <el-badge :value="12" class="item text-[#dddddd]">
          <ChatLineRound />
          <div class="">提醒邮件</div>
        </el-badge>
      </div>
      <div class="w-1/2 justify-around p-4">
        <div class="font-bold">消息中心</div>
        <ul class="flex flex-col">
          <li class="flex justify-between p-4 border-b">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4 border-b">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4 border-b">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4 border-b">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4 border-b">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
