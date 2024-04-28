<script setup lang="ts">
import { getWebApis, insertWebApis } from "@/services/webApiService";
import { ElMessageBox } from "element-plus";
import { ref } from "vue";

interface Api {
  Id: number;
  description: string;
  name: string;
  router: string;
  sum: number;
}

const webApis = ref<Api[]>([]);
const newWindow = ref<Window>();
// 调用接口获取数据
const getWebApisData = async () => {
  try {
    const res = await getWebApis();
    if (res.code === 200) {
      if (res.data.length === 0) {
        updateApis();
        return;
      }
      webApis.value = res.data;
    }
  } catch (error) {}
};

const updateApis = () => {
  ElMessageBox.alert("接口更新通知", {
    confirmButtonText: "OK",
    callback: async () => {
      try {
        const res = await insertWebApis();
        if (res.code === 200) {
          getWebApisData();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
};
// 组件挂载时调用接口获取数据
getWebApisData();

const openUrl = (router: string) => {
  const url = router.includes("http")
    ? router
    : "https://api.oioweb.cn/doc/" + router;
  // 检查是否已经存在旧窗口
  if (typeof newWindow.value !== "undefined" && !newWindow.value.closed) {
    newWindow.value.close(); // 如果存在，则关闭旧窗口
  }

  // 打开新窗口
  newWindow.value = window.open(
    url,
    "_blank",
    "width=800,height=600,toolbar=no,location=no"
  );
};
</script>

<template>
  <div class="apis-header m-5">
    <h1 class="text-3xl font-bold">WEBAPI接口列表。</h1>
    <h2 class="text-lg mt-2">
      致力于为开发者提供便捷、免费、稳定、快速的免费Web API数据接口服务。
    </h2>
    <input
      type="text"
      class="email-form-item mt-5 w-full"
      placeholder="serach by name or description"
    />
  </div>
  <div class="apis-content justify-center">
    <div class="api-list text-sm flex flex-wrap w-full h-full">
      <div
        @click="openUrl(api.router)"
        class="api-i hover:cursor-pointer relative p-5 w-[300px] rounded-lg m-3"
        v-for="api in webApis"
        :key="api.Id"
      >
        <h2 class="i-name">{{ api.name }}</h2>
        <div class="i-description">{{ api.description }}</div>
        <div class="i-sum">Response time: {{ api.sum }}</div>
      </div>
    </div>
  </div>
  <div class="apis-footer"></div>
</template>

<style scoped lang="scss">
$afterHeight: 5px;

.api-list .api-i {
  --n: 3;
  --w: 300px;
  --h: 100px;
  --s: calc((100% - var(--w) * var(--n)) / var(--n) / 2);
  margin: 10px var(--s);
  width: var(--w);
  height: var(--h);
  // transform: translateY(-2px);
  // box-shadow: 3px 5px 5px rgba(33, 32, 32, 0.1);
  img {
    background-size: 100% 100%;
  }
  box-shadow: 1px 1px 10px #1d4334;
  transition: 0.2s all;
  &:hover {
    $afterHeight: 100px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    // background: linear-gradient(
    //   to right,
    //   rgba(255, 251, 4, 0.18),
    //   rgba(0, 255, 34, 0.18)
    // );
    animation: api-i-hover 1s cubic-bezier(0.315, 0.605, 0.375, 0.925) forwards;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: $afterHeight;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      rgba(255, 251, 4, 0.18),
      rgba(0, 255, 34, 0.18)
    );
  }
}
@keyframes api-i-hover {
  0% {
    transform: perspective(1600px) rotateX(0) rotateY(0) translateZ(0);
  }
  16% {
    transform: perspective(1600px) rotateX(10deg) rotateY(5deg) translateZ(32px);
  }
  100% {
    transform: perspective(1600px) rotateX(0) rotateY(0) translateZ(65px);
  }
}
</style>
