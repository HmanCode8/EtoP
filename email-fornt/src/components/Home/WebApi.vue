<script setup lang="ts">
import { getWebApis, insertWebApis } from "@/services/webApiService";
import { ElMessageBox } from "element-plus";
import { ref, watch, inject, onMounted, nextTick } from "vue";
import _ from "lodash";

interface Api {
  Id: number;
  description: string;
  name: string;
  router: string;
  sum: number;
}
const gsap: any = inject("gsap");
const apiItemList = ref<HTMLDivElement>();
const webApis = ref<Api[]>([]);
const filterApis = ref<Api[]>([]);
const newWindow = ref<Window>();
const searchVal = ref<string>("");
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
  ) as any;
};
const apis = webApis.value;
watch(searchVal, (val) => {
  filterApis.value = _.isEmpty(val)
    ? apis
    : _.filter(apis, (i) => _.includes(i.name, val));
});

watch(webApis, () => {
  nextTick(() => {
    gsap.fromTo(
      ".api-i",
      { opacity: 0, x: 200 },
      { opacity: 1, x: 0, duration: 3, ease: "bounce" }
    );
    gsap.fromTo(
      ".api-i-reverse",
      { opacity: 0, y: 200 },
      { opacity: 1, y: 0, duration: 3, ease: "back" }
    );
  });
});

onMounted(() => {
  // gsap.fromTo(newSixRef.value, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 1 })
  // let tween = gsap.fromTo(apiItemList.value, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 3, ease: 'elastic' })
  // tween.pause()
  // tween.seek(1)
  // tween.progress(0.1)
  // tween.play()
});
</script>

<template>
  <div class="apis-header m-5">
    <h1 class="text-3xl font-bold">WEBAPI接口列表。</h1>
    <h2 class="text-lg mt-2">
      致力于为开发者提供便捷、免费、稳定、快速的免费Web API数据接口服务。
    </h2>
    <!-- <div style="font-size: 12px">转载自：（韩小韩的个人博客）</div> -->
    <input
      v-model="searchVal"
      type="text"
      class="email-form-item mt-5 w-full"
      placeholder="serach by name or description"
    />
  </div>
  <div class="apis-content justify-center">
    <div ref="apiItemList" class="api-list flex flex-wrap w-full h-full">
      <div
        @click="openUrl(api.router)"
        :class="`${
          index % 3 === 0 ? 'api-i' : 'api-i-reverse'
        } p-3 text-sm relative flex flex-col hover:cursor-pointer rounded-lg shadow-xl`"
        v-for="(api, index) in webApis"
        :key="api.Id"
      >
        <div class="api-contain flex items-center h-10">
          <div class="i-sum">{{ api.name }}</div>
          <div class="i-name p-2 ml-auto r text-sm">Hot:{{ api.sum }}</div>
        </div>
        <div class="i-description mb-auto overflow-auto">
          {{ api.description }}
        </div>
      </div>
    </div>
  </div>
  <div class="apis-footer"></div>
</template>

<style scoped lang="scss">
// $afterHeight: 15px;

.api-list .api-i,
.api-i-reverse {
  --n: $count;
  --w: 300px;
  --h: 120px;
  --s: calc((100% - var(--w) * var(--n)) / var(--n) / 2);
  margin: 10px var(--s);
  width: var(--w);
  height: var(--h);
  box-shadow: 1px 1px 3px #1d4334;
  &:hover {
    &::after {
      border-radius: 5px;
      height: 100%;
      transition: height 0.5s; // 添加过渡效果
    }
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }
  &::after {
    content: "";
    position: absolute;
    border-radius: 0 5px 0 5px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 0%;
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
