<script setup lang="ts">
import HomeContain from "@/components/Home/HomeContain.vue";
// import HomeUser from "@/components/Home/HomeUser.vue";
import WebApi from "@/components/Home/WebApi.vue";
import WallpaperList from "@/components/Wallpaper/WallpaperList.vue";
import News from "@/components/News/NewList.vue";
import UpLoad from "@/components/Home/UpLoad.vue";
import MarkDown from "@/components/Home/Markdowm.vue";
import AiEditor from "@/components/Home/AiEditor.vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { loginOut } from "@/services/userService";
import { useUserStore } from "@/store";

const navList = reactive([
  {
    navName: "首页",
    navPath: "/home",
    desc: "flex布局",
  },
  // {
  //   navName: "邮箱",
  //   navPath: "/email",
  // },
  {
    navName: "api",
    navPath: "/webApis",
    desc: "封装BFF层数据加工",
  },
  {
    navName: "壁纸",
    navPath: "/wallpaper",
    desc: "长列表渲染，分页获取数据渲染",
  },
  {
    navName: "今日热点",
    navPath: "/news",
    desc: "封装BFF层数据加工",
  },
  {
    navName: "上传",
    navPath: "/upload",
    desc: "大文件分片上传，并发上传",
  },
  {
    navName: "水果列表",
    navPath: "/markdowm",
    desc: "数据列表的增删改查功能",
  },
  {
    navName: "AiEditor",
    navPath: "/aieditor",
    desc: "AI编辑器",
  },
]);
// 注入gsap动画库
// const { gsap } = inject("gsap");
const router = useRouter();
const userStore = useUserStore();
const navRef = ref(null);
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

const done = (path: string) => {
  userStore.setNavActive(path);
  if (path === "/email") {
    router.push(path);
  }
};

const onNavClick = (path: string) => {
  // const index = navList.findIndex((item) => item.navPath === path);
  // toggleTheme(index % 2 !== 0);
  if (userStore.uploadState === "uploading") {
    ElMessageBox.confirm("文件正在上传，是否确认退出?")
      .then(() => {
        done(path);
        userStore.setUploadState("done");
      })
      .catch(() => {
        // catch error
      });
    return;
  }
  done(path);
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
      <div ref="navRef" class="nav-list flex">
        <el-popover
          placement="top-start"
          :width="200"
          trigger="hover"
          :content="`技术凸显：${item.desc}`"
          v-for="item in navList"
          :key="item.navName"
        >
          <template #reference>
            <div
              @click="onNavClick(item.navPath)"
              :class="[
                'nav-item group mx-5 py-3  hover:text-[#9999ff] hover:scale-110 relative  text-center  hover:cursor-pointer',
                userStore.navActive === item.navPath ? 'active' : '',
              ]"
            >
              {{ item.navName }}
              <div
                :class="`nav-bar w-13 h-0.5 rounded-br-xl rounded-bl-xl scale-0 group-hover:scale-100 ${
                  userStore.navActive === item.navPath ? 'active' : ''
                }`"
              ></div>
            </div>
          </template>
        </el-popover>
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
  <div class="home-content rounded-md mx-5 my-20">
    <HomeContain v-if="userStore.navActive === '/home'" />
    <WebApi v-if="userStore.navActive === '/webApis'" />
    <WallpaperList v-if="userStore.navActive === '/wallpaper'" />
    <News v-if="userStore.navActive === '/news'" />
    <UpLoad v-if="userStore.navActive === '/upload'" />
    <MarkDown v-if="userStore.navActive === '/markdowm'" />
    <AiEditor v-if="userStore.navActive === '/aieditor'" />
  </div>
  <!-- <div class="c-user ml-10 flex-grow">
      <HomeUser />
    </div> -->
  <div
    class="email-car-bg-color shadow-xl rounded-md clear-both p-5 mx-10 my-10 home-footer py-5 text-center"
  >
    <!-- 行高：1.5rem; -->
    <div class="font-bol">He Web Design ©2022</div>
    <!-- 给我这个网站给个说明 -->
    <div class="text-sm my-5">
      这是一个基于Vue3.x的个人网站，主要用于记录平时学习的心得体会，分享一些个人项目，以及一些技术文章。
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
    <!-- <div class="text-sm my-5">
      网站源码：
      <a href="https://github.com/HmanCode8/email/tree/master" target="_blank">https://github.com/heshiheng/email-fornt</a>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.home-content {
  // box-shadow: inset 0 0 10px rgba(236, 210, 210, 0.5);
}

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
  @media (max-width: 768px) {
    .nav-item {
      display: none;
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
