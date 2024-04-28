<script setup lang="ts">
import HomeContain from "@/components/Home/HomeContain.vue";
import HomeUser from "@/components/Home/HomeUser.vue";
import WebApi from "@/views/WebApi.vue";
import WallpaperList from "@/components/Wallpaper/WallpaperList.vue";
import News from "@/components/News/NewList.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginOut } from "@/services/userService";
import { useUserStore } from "@/store";

const navList = reactive([
  {
    navName: "首页",
    navPath: "/home",
  },
  // {
  //   navName: "邮箱",
  //   navPath: "/email",
  // },
  {
    navName: "api",
    navPath: "/webApis",
  },
  {
    navName: "壁纸",
    navPath: "/wallpaper",
  },
  {
    navName: "今日热点",
    navPath: "/news",
  },
  {
    navName: "消息",
    navPath: "/message",
  },
]);
const router = useRouter();
const userStore = useUserStore();

const handleBack = async () => {
  const res = await loginOut();
  if (res.code === 200) {
    ElMessage({
      message: "退出成功",
      type: "success",
    });
    // userStore.setAvatar(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    router.push("/login");
  }
};
console.log("userStore.navActive1212", userStore.navActive);

const onNavClick = (path: string) => {
  userStore.setNavActive(path);
  if (path === "/email") {
    router.push(path);
    return;
  }
};
</script>

<template>
  <div
    class="email-car-bg-color fixed top-0 left-0 w-full h-16 pl-10 pr-10 z-20 flex justify-between items-center"
  >
    <div class="flex items-center">
      <div class="logo"></div>
      <div class="nav-list flex">
        <div
          :class="[
            'nav-item group mx-5 py-3  hover:text-[#9999ff] hover:scale-110 relative  text-center  hover:cursor-pointer',
            userStore.navActive === item.navPath ? 'active' : '',
          ]"
          @click="onNavClick(item.navPath)"
          v-for="item in navList"
          :key="item.navName"
        >
          {{ item.navName }}
          <div
            :class="`nav-bar w-13 h-0.5 rounded-br-xl rounded-bl-xl scale-0 group-hover:scale-100 ${
              userStore.navActive === item.navPath ? 'active' : ''
            }`"
          ></div>
        </div>
      </div>
    </div>
    <div class="group relative">
      <div class="hover:cursor-pointer">设置</div>
      <ul
        class="ml-auto absolute top-0 text-center right-3 w-40 scale-0 group-hover:scale-100 duration-500 origin-top-right email-car-bg-color m-5 rounded-lg"
      >
        <li class="py-2 hover:cursor-pointer" @click="onNavClick('/email')">
          邮箱
        </li>
        <li class="py-2 hover:cursor-pointer" @click="handleBack">退出</li>
      </ul>
    </div>
  </div>
  <div class="home-content clear-both mx-10 my-20 flex">
    <div
      class="c-main email-car-bg-color max-h-screen overflow-auto w-calc-width"
    >
      <HomeContain v-if="userStore.navActive === '/home'" />
      <WebApi v-if="userStore.navActive === '/webApis'" />
      <WallpaperList
        :userStore.navActivekey="userStore.navActive"
        v-if="
          userStore.navActive === '/wallpaper' ||
          userStore.navActive === '/video'
        "
      />
      <News v-if="userStore.navActive === '/news'" />
    </div>
    <div class="c-user ml-10 flex-grow">
      <HomeUser />
    </div>
  </div>
  <div class="home-footer"></div>
</template>

<style scoped lang="scss">
.logo {
  width: 200px;
  height: 40px;
  background-image: url("@/assets/logo.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.nav-list {
  $active-color: #9999ff;
  .nav-item {
    position: relative;
    &.active {
      color: $active-color;
    }
    .nav-bar {
      background-color: $active-color;
      transition: all 0.3s;
      &.active {
        transform: scale(1);
      }
    }
  }
}
</style>
