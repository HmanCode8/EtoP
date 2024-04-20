<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import moment from "moment";
import _ from "lodash";
import { useRouter } from "vue-router";
import {
  getEmail,
  getUsers,
  sendEmail,
  deleteEmail,
} from "@/services/emailService";
import { loginOut } from "@/services/userService";

import ReceivedEmail from "@/components/Email/ReceivedEmail.vue";
import SendEmail from "@/components/Email/SendEmail.vue";
import UserCenter from "@/components/Email/UserCenter.vue";
import Drafts from "@/components/Email/Drafts.vue";

const menuActive = ref("usercenter");

const menus = reactive([
  { label: "个人中心", id: "usercenter", icon: "Edit" },
  { label: "发邮件", id: "sendemail", icon: "Avatar" },
  { label: "收邮件", id: "resiemail", icon: "Comment" },
  { label: "草稿箱", id: "drafts", icon: "Delete" },
]);

const users = ref([]);
const router = useRouter();
const store = useStore();

const userInfo = reactive(JSON.parse(sessionStorage.getItem("userInfo")));
const handleBack = async () => {
  const res = await loginOut();
  if (res.code === 200) {
    ElMessage({
      message: "退出成功",
      type: "success",
    });
    // 使用 router.push() 方法跳转到指定路由
    router.push("/login");
    store.commit("setUserInfo", null);
    store.commit("setAvatar", null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
  }
};

/**
 * 获取用户列表
 */
const handleGetUsers = async () => {
  try {
    const res = await getUsers();
    if (res.code === 200) {
      users.value = res.data; // 假设 messages 是一个 ref 或 reactive 对象
    }
  } catch (error) {
    console.error(error);
  }
};

const menuChange = (id) => {
  menuActive.value = id;
};

onMounted(() => {
  handleGetUsers();
});
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex justify-between items-center h-10">
      <div
        class="avatar flex justify-center items-center border w-10 h-10 bg-white rounded-full"
      >
        <el-icon><UserFilled /></el-icon>
      </div>
      <div class="user-name text-white font-bold ml-5" v-if="userInfo">
        你好，{{ userInfo.username }}
      </div>
      <div
        class="back flex items-center text-white absolute right-5 hover:cursor-pointer"
      >
        <span>返回</span>
        <el-icon class="text-lg" @click="handleBack"> <Right /></el-icon>
      </div>
    </div>
    <div class="contain flex flex-1 rounded-md">
      <div class="w-40 m-3 rounded-sm">
        <!-- 侧边菜单栏 -->
        <div class="flex flex-col h-full email-br-color">
          <div class="menu-title font-bold p-5">我的站内信</div>
          <ul>
            <li
              v-for="m in menus"
              :key="m.id"
              @click="menuChange(m.id)"
              :class="`p-2 hover:cursor-pointer hover:text-fontColor shadow-sm ${
                menuActive === m.id ? 'email-item-active-bg' : ''
              }`"
            >
              <div class="flex items-center">
                <el-icon><component :is="m.icon" /></el-icon>
                <div class="ml-4">{{ m.label }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="calc-h flex-1 ml-0 m-3 flex">
        <UserCenter v-if="menuActive === 'usercenter'" />
        <SendEmail
          type="sendEmail"
          :users="users"
          :userInfo="userInfo"
          :menuActive="menuActive"
          v-else-if="menuActive === 'sendemail'"
        />
        <ReceivedEmail
          :userInfo="userInfo"
          v-else-if="menuActive === 'resiemail'"
        />
        <Drafts
          v-else
          type="draft"
          :userInfo="userInfo"
          :users="users"
          :menuActive="menuActive"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  margin: 10px auto;
}
.header {
  background-image: url("../assets/title-bg.png");
}
.calc-h {
  height: calc(100vh - 100px);
}
</style>
