<script setup lang="ts">
import { ref, reactive } from "vue";

// 使用 ref 创建响应式数据
const allchecked = ref(0);
const mails = ref([
  {
    id: 1,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 2,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 3,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 4,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 5,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 3,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 4,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 5,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 5,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
  {
    id: 5,
    subject: "邮件主题",
    sender: "发送者",
    date: "发送日期",
    mail: "123@qq,com",
  },
]);
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="border-b p-4">草稿箱</div>
    <div class="p-4">
      <el-button class="border-[#ee6155] text-[#ee6155]">删除邮件</el-button>
    </div>
    <div class="bg-[#f8f8f8] pl-4">
      <el-checkbox v-model="allchecked" label="全选" size="large" />
    </div>
    <ul class="drafts pl-1 overflow-auto">
      <li
        v-for="m in mails"
        :key="m.id"
        class="border-b d-item flex p-3 items-center"
      >
        <el-checkbox v-model="allchecked" size="large" />
        <div class="pl-4">{{ m.subject }} {{ m.mail }}</div>
        <div class="pl-10">{{ m.sender }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
