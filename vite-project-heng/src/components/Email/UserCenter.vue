<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import _ from "lodash";
import moment from "moment";
import AvatarUpload from "@/components/Upload/AvatarUpload.vue";
import { getAvatar } from "@/services/userService";
import { getEmailCount } from "@/services/emailService";

import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const store = useStore();
const info = JSON.parse((sessionStorage as any).getItem("user"));
const userInfo = reactive(info || store.state.userInfo);
const pendingValue = ref(0);
const messageTotal = ref(0);

const timePeriods = [
  { name: "上午", startTime: "06:00", endTime: "12:00" },
  { name: "中午", startTime: "12:00", endTime: "14:00" },
  { name: "下午", startTime: "14:00", endTime: "18:00" },
  { name: "晚上", startTime: "18:00", endTime: "24:00" },
];

console.log(" 用户还: ", import.meta.env.VITE_BASE_URL);
const handlegetAvatar = async () => {
  const result = await getAvatar();
  store.commit("setAvatar", result.data.avatar);
};

const getEmailCountFun = async () => {
  try {
    const res = await getEmailCount();
    if (res.code === 200) {
      pendingValue.value = res.data.count;
      messageTotal.value = res.data.total;
    }
  } catch (error) {
    ElMessage.error("获取未读邮件失败");
  }
};

getEmailCountFun();
onMounted(() => {
  handlegetAvatar();
});
const computers = computed(() => {
  return {
    nowTime: moment(new Date()).format("YYYY-MM-DD"),
    timeWelcome: () => {
      const currentTime = moment(new Date()).format("HH:mm");
      const t = _.find(timePeriods, (i) => {
        const t1 = moment(currentTime, "HH:mm");
        const t2 = moment(i.startTime, "HH:mm");
        const t3 = moment(i.endTime, "HH:mm");
        return t1.isBetween(t2, t3);
      });
      return _.get(t, "name");
    },
  };
});
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="p-4">个人中心</div>
    <div class="user-content mr-auto w-5/6 h-screen items-center flex flex-col">
      <div class="flex w-1/2 justify-around items-center p-4">
        <!-- <input type="file" name="" id="" style="display: none" />
        <el-avatar :size="50" :src="circleUrl" /> -->
        <AvatarUpload :userInfo="userInfo" />
        <div class="">{{ computers.nowTime }}</div>
        <div>{{ computers.timeWelcome() }}好，张三</div>
      </div>
      <div class="flex w-1/2 justify-around p-4">
        <el-badge :value="pendingValue" class="item">
          <ChatLineRound />
          <div class="">未读邮件</div>
        </el-badge>
        <el-badge :value="messageTotal" class="item">
          <ChatLineRound />
          <div class="">提醒邮件</div>
        </el-badge>
      </div>
      <div class="w-1/2 justify-around p-4">
        <div class="font-bold">消息中心</div>
        <ul class="flex flex-col">
          <li class="flex justify-between p-4">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
          <li class="flex justify-between p-4">
            <div>邮箱容量已经升级256G</div>
            <div>2022年2月2日</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
