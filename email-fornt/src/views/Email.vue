<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
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

import ReceivedEmail from "@/components/Email/ReceivedEmail.vue";
import SendEmail from "@/components/Email/SendEmail.vue";
import UserCenter from "@/components/Email/UserCenter.vue";
import Drafts from "@/components/Email/Drafts.vue";
import { useUserStore } from "@/store";

const menuActive = ref("usercenter");

const menus = reactive([
  { label: "个人中心", id: "usercenter", icon: "Edit" },
  { label: "发邮件", id: "sendemail", icon: "Avatar" },
  { label: "收邮件", id: "resiemail", icon: "Comment" },
  { label: "草稿箱", id: "drafts", icon: "Delete" },
]);

const users = ref([]);
const router = useRouter();
const userStore = useUserStore();
const userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")));
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

const onHome = () => {
  userStore.setNavActive("/home");
  router.push("/home");
};
onMounted(() => {
  handleGetUsers();
});
</script>

<template>
  <div class="email-box h-screen flex flex-col">
    <div class="contain flex flex-1 rounded-md">
      <div class="w-40 email-card-shadow m-3 rounded-sm">
        <!-- 侧边菜单栏 -->
        <div class="email-car-bg-color flex flex-col h-full email-br-color">
          <div class="menu-title font-bold p-5 hover:cursor-pointer " @click="onHome"><el-icon><ArrowLeftBold /></el-icon>首页</div>
          <ul>
            <li
              v-for="m in menus"
              :key="m.id"
              @click="menuChange(m.id)"
              :class="`p-2 hover:cursor-pointer shadow-sm ${
                menuActive === m.id ? 'email-bb-color' : ''
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
      <div class="flex-1 ml-0 m-3 flex">
        <UserCenter :userInfo="userInfo" v-if="menuActive === 'usercenter'" />
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
.email-box {
  /* background-image: url("../assets/logo.jpg"); */
  background-size: cover;
  background-position: center;
  height: 100vh;
}
.logo {
}
.calc-h {
  height: calc(100vh - 100px);
}
</style>
