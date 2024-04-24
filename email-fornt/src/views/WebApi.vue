<script setup lang="ts">
import { ref, defineProps } from "vue";
import { getWebApis } from "@/services/webApiService";

interface Api {
  Id: number;
  description: string;
  name: string;
  router: string;
  sum: number;
}
// 定义 props
const props = defineProps({
  message: String,
});

const webApis = ref<Api[]>([]);

// 调用接口获取数据
const getWebApisData = async () => {
  const res = await getWebApis();
  webApis.value = res.data;
};

// 组件挂载时调用接口获取数据
getWebApisData();
</script>

<template>
  <div class="apis-header m-10">
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
  <div class="apis-content h-4/5 flex overflow-auto justify-center">
    <div class="api-list flex flex-wrap w-full h-full">
      <a
        :href="
          api.router.includes('http')
            ? api.router
            : 'https://api.oioweb.cn/doc/' + api.router
        "
        class="api-i p-5 w-[300px] rounded-lg m-3"
        v-for="api in webApis"
        :key="api.Id"
      >
        <h2 class="i-name">{{ api.name }}</h2>
        <div class="i-description">{{ api.description }}</div>
        <div class="i-sum">Response time: {{ api.sum }}</div>
      </a>
    </div>
  </div>
  <div class="apis-footer"></div>
</template>

<style scoped lang="scss">
.api-list .api-i {
  --n: 4;
  --space: calc(100vw - var(--n) * 230px);
  --h: calc(var(--space) / var(--n) / 2);
  margin: 10px var(--h);
  box-shadow: 1px 1px 10px #1d4334;
  transition: 0.2s all;
  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    background: linear-gradient(
      to right,
      rgba(255, 251, 4, 0.18),
      rgba(0, 255, 34, 0.18)
    );
    animation: api-i-hover 1s cubic-bezier(0.315, 0.605, 0.375, 0.925) forwards;
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
