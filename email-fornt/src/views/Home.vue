<script setup lang="ts">
import HomeContain from "@/components/Home/HomeContain.vue";
// import HomeUser from "@/components/Home/HomeUser.vue";
import WebApi from "@/views/WebApi.vue";
import WallpaperList from "@/components/Wallpaper/WallpaperList.vue";
import News from "@/components/News/NewList.vue";
import UpLoad from "@/views/UpLoad.vue";
import { reactive, onMounted } from "vue";
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
    navName: "上传",
    navPath: "/upload",
  },
]);
// 注入gsap动画库
// const { gsap } = inject("gsap");
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
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    router.push("/login");
  }
};

const onNavClick = (path: string) => {
  userStore.setNavActive(path);
  if (path === "/email") {
    router.push(path);
    return;
  }
};
onMounted(() => {
  // gsap.to(".nav-items", { rotation: 360, duration: 2, ease: "bounce.out" });
});
</script>

<template>
  <div
    class="email-car-bg-color fixed top-0 left-0 w-full h-16 pl-10 pr-10 z-20 flex justify-between items-center"
  >
    <div class="flex items-center">
      <a href="https://www.shihenghe.online/" class="logo flex items-center">
        <div class="text-5xl font-bold">HSH</div>
        <span class="text-sm">blog</span>
      </a>
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
  <div class="flex flex-col h-full">
    <div class="home-content clear-both m-20 flex">
      <div class="c-main w-calc-width">
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
        <UpLoad v-if="userStore.navActive === '/upload'" />
      </div>
      <div class="c-user ml-10 flex-grow">
        <!-- <HomeUser /> -->
      </div>
    </div>
  </div>
  <div class="email-car-bg-color home-footer py-5 text-center">
    <!-- 行高：1.5rem; -->
    <div class="font-bol">He Web Design ©2022</div>
    <!-- 给我这个网站给个说明 -->
    <div class="text-sm my-5">
      这是一个基于Vue3.x+Element-Plus的个人网站，主要用于记录平时学习的心得体会，分享一些个人项目，以及一些技术文章。
    </div>
    <div class="icon-list flex justify-center items-center my-5">
      <!-- <a title="打赏站长" target="_blank" href="/images/reward.webp"></a> -->
      <a
        class="icon-item inline-block w-8 h-8 mr-5"
        title="添加群聊"
        target="_blank"
        rel="nofollow"
        href="https://qm.qq.com/q/tX8dU3hBu0"
      ></a>
      <a
        class="icon-item inline-block w-8 h-8 mr-5"
        title="Github"
        target="_blank"
        rel="nofollow"
        href="https://github.com/HmanCode8"
      ></a>
      <!-- <a title="韩小韩博客" target="_blank" href="https://www.vvhan.com/"></a> -->
    </div>
    <div class="text-sm my-5">
      网站源码：
      <a href="https://github.com/HmanCode8/email/tree/master" target="_blank"
        >https://github.com/heshiheng/email-fornt</a
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  width: 200px;
  height: 40px;
  font-family: math;
  // background-image: url("@/assets/logo.png");

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
.icon-list {
  // background-color: #9999ff;
  .icon-item:nth-child(1) {
    background-size: cover;

    background-image: url("@/assets/images/qq.png");
  }
  .icon-item:nth-child(2) {
    background-size: cover;
    background-image: url("@/assets/images/github.png");
  }
}
</style>
