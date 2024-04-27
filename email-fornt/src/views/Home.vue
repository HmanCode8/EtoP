<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { loginOut } from "@/services/userService";
import HomeContain from "@/components/Home/HomeContain.vue";
import HomeUser from "@/components/Home/HomeUser.vue";
import WebApi from "@/views/WebApi.vue";
import WallpaperList from "@/components/Wallpaper/WallpaperList.vue";
import News from "@/components/News/NewList.vue";

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
const navActive = ref<any>(navList[2].navPath);
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
watch(navActive, (newVal) => {
  console.log("newVal", newVal);
});
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
              'nav-item group mx-5 py-3  hover:text-[#9999ff] hover:scale-110 relative  text-center  hover:cursor-pointer',
              navActive === item.navPath ? 'active' : '',
            ]"
            @click="onNavClick(item.navPath)"
            v-for="item in navList"
            :key="item.navName"
          >
            {{ item.navName }}
            <div
              :class="`nav-bar w-13 h-0.5 rounded-br-xl rounded-bl-xl scale-0 group-hover:scale-100 ${
                navActive === item.navPath ? 'active' : ''
              }`"
            ></div>
          </div>
        </div>
      </div>
      <div class="group relative">
        <div class="">设置</div>
        <ul
          class="ml-auto absolute top-0 text-center right-3 w-40 scale-0 group-hover:scale-100 duration-500 origin-top-right bg-gray-300 m-5 rounded-lg"
        >
          <li
            class="py-2 hover:cursor-pointer hover:bg-gray-200"
            @click="onNavClick('/email')"
          >
            邮箱
          </li>
          <li class="py-2 hover:cursor-pointer hover:bg-gray-200">个人中心</li>
          <li
            class="py-2 hover:cursor-pointer hover:bg-gray-200"
            @click="handleBack"
          >
            退出
          </li>
        </ul>
      </div>
    </div>
    <div class="home-content m-10 mt-[70px] flex">
      <div class="c-main h-calc-height overflow-auto w-calc-width">
        <HomeContain v-if="navActive === '/home'" />
        <WebApi v-if="navActive === '/webApis'" />
        <WallpaperList
          :pathkey="navActive"
          v-if="navActive === '/wallpaper' || navActive === '/video'"
        />
        <News v-if="navActive === '/news'" />
      </div>
      <div class="c-user ml-10 flex-grow">
        <HomeUser />
      </div>
    </div>
    <div class="home-footer"></div>
  </div>
</template>

<style scoped lang="scss">
$active-color: #9999ff;
.home-bg {
  // background-color: #f5f5f5;
  // height: 100vh;
  // background-image: url("@/assets/logo.jpg");
  // background-size: cover;
  // background-position: center;
}

.c-main {
  // box-shadow: 2px 3px 4px #677489;
}

.nav-item {
  position: relative;
  &.active {
    color: $active-color;
  }
  .nav-bar {
    // position: absolute;
    // bottom: 0;
    background-color: $active-color;
    transition: all 0.3s;
    // opacity: 0;
    &.active {
      transform: scale(1);
    }
  }
}
</style>
