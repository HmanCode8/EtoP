<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { loginOut } from "@/services/userService";
import HomeContain from "@/components/Home/HomeContain.vue";
import HomeUser from "@/components/Home/HomeUser.vue";
import WebApi from "@/views/WebApi.vue";

const navList = reactive([
  {
    navName: "首页",
    navPath: "/home",
  },
  {
    navName: "邮箱",
    navPath: "/email",
  },
  {
    navName: "api",
    navPath: "/webApis",
  },
  {
    navName: "壁纸",
    navPath: "/wallpaper",
  },
  {
    navName: "消息",
    navPath: "/message",
  },
]);
const navActive = ref(navList[0].navPath);
const router = useRouter();
const store = useStore();
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

const onNavClick = (path: string) => {
  navActive.value = path;
  if (path === "/email") {
    router.push(path);
    return;
  }
};
</script>

<template>
  <div class="home-bg h-full overflow-hidden w-full">
    <div
      class="home-header email-car-bg-color pl-10 pr-10 fixed z-10 right-0 left-0 flex justify-between items-center h-[60px] border-gray-400"
    >
      <div>
        <div class="logo"></div>
        <div class="nav-list flex">
          <div
            :class="[
              'nav-item relative w-[100px] text-center    hover:cursor-pointer',
              navActive === item.navPath ? 'email-nav-active1' : '',
            ]"
            @click="onNavClick(item.navPath)"
            v-for="item in navList"
            :key="item.navName"
          >
            {{ item.navName }}
          </div>
        </div>
      </div>
      <div @click="handleBack" class="logout-btn">退出</div>
    </div>
    <div class="home-content m-10 mt-[70px] flex">
      <div
        class="c-main h-calc-height overflow-auto email-car-bg-color w-calc-width"
      >
        <HomeContain v-if="navActive === '/home'" />
        <WebApi v-if="navActive === '/webApis'" />
      </div>
      <div class="c-user ml-10 flex-grow">
        <HomeUser />
      </div>
    </div>
    <div class="home-footer"></div>
  </div>
</template>

<style scoped lang="scss">
.home-bg {
  // background-color: #f5f5f5;
  // height: 100vh;
  // background-image: url("@/assets/logo.jpg");
  // background-size: cover;
  // background-position: center;
}

.c-main {
  box-shadow: 2px 3px 4px #677489;
}

.nav-item::after {
  --theme: #9999ff;
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 3px;
  transition: opacity 0.5s;
  border-radius: 6px 6px 0 0;
  // opacity: 0;
  transform: scaleX(0.5);
  background: var(--theme);
}
</style>
