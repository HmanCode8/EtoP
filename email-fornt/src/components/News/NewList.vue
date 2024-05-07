<script setup lang="ts">
import { ref } from "vue";
import { getApisCateNews } from "@/services/homeService";
import { newBases } from "@/assets/base64";
import _ from "lodash";
const hotAllnews = ref<any>([]);
const handleGetNews = async () => {
  try {
    const res = await getApisCateNews({
      new_keys: [
        "hotAll",
        // "sistentryNews",
        // "weiboHot",
        // "hupuHot",
        // "zhihuHot",
        // "baiduHot",
      ],
    });
    const hotAllNews = res.data.hotAll.data ?? [];
    hotAllnews.value = _.map(hotAllNews, (d: any, index: number) => ({
      ...d,
      img: newBases[index],
    }));
  } catch (error) {
    console.log(error);
  }
};
handleGetNews();

const openUrl = (url: string) => {
  window.open(url, "_blank", "width=800,height=600,toolbar=no,location=no");
};
</script>

<template>
  <div
    ref="target"
    @click="handleGetNews"
    class="title relative bg-white h-12 hover:cursor-pointer rounded-lg mx-2 my-5 flex justify-center items-center"
  >
    今日热点
  </div>
  <div v-if="hotAllnews.length > 0" class="new-list text-sm flex flex-wrap">
    <div
      class="new-item flex flex-col email-car-bg-color rounded-md items-center"
      v-for="item in hotAllnews"
      :key="item.name"
    >
      <div
        class="new-item-title border-b flex justify-between rounded-t items-center h-10 w-full p-2"
      >
        <div class="flex items-center">
          <img
            class="new-item-img h-4 w-4 mr-2 object-contain rounded-md"
            :src="item.img"
            alt="img"
          />
          <span> {{ item.name }}</span>
        </div>
        <div>{{ item.subtitle }}</div>
      </div>
      <div class="new-item-content w-full overflow-auto px-2">
        <ul>
          <li
            @click="openUrl(d.url)"
            class="flex hover:cursor-pointer flex-nowrap overflow-hidden py-1 items-center"
            v-for="(d, dIndex) in item.data"
            :key="d.index"
          >
            <div
              :class="`top-${
                dIndex + 1
              } w-4 h-4 bg-slate-500  text-white flex items-center justify-center rounded-sm`"
            >
              {{ dIndex + 1 }}
            </div>
            <div
              :title="d.title"
              class="text-ellipsis ml-2 flex-1 overflow-hidden nowrap mr-auto"
            >
              {{ d.title }}
            </div>
            <div v-if="d.hot" class="ml-auto text-xs text-red-500">
              {{ d.hot }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="no-data flex justify-center items-center h-20" v-else>
    暂无数据
  </div>
</template>

<style scoped lang="scss">
.title {
  &::after {
    content: "今日热点";
    position: absolute;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 8px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 0%;
    height: 100%;
    background: linear-gradient(to right, #75fbfd, #182c25);
  }
  &:hover {
    &::after {
      opacity: 1;
      width: 100%;
      transition: width 1s; // 添加过渡效果
    }
  }
}

.new-list {
  font-size: 12px;
  .new-item {
    --n: 4;
    --w: 330px;
    --h: 300px;
    --s: calc((100% - var(--w) * var(--n)) / var(--n) / 2);
    margin: 10px var(--s);
    width: var(--w);
    height: var(--h);
    // transform: translateY(-2px);
    box-shadow: 3px 5px 5px rgba(33, 32, 32, 0.1);
  }
  @for $i from 1 through 3 {
    $colors: #e65b3e, #ec944a, #ebc259; // 创建一个颜色列表

    .top-#{$i} {
      background-color: nth($colors, $i); // 使用 nth 函数从列表中获取颜色
    }
  }
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
