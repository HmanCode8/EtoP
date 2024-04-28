<script setup lang="ts">
import { ref } from "vue";
// import {getApisCateNews} from "@services/homeService"
import { getApisCateNews } from "@/services/homeService";

interface Message {
  title: string;
  data: string[];
  time: string;
  banner: string;
}
const ARTICLE_LIST = [
  {
    title: "最新文章",
    data: [
      "尊敬的用户，欢迎使用本系统！",
      "本系统由XXX团队开发，专注于XXX业务。",
    ],
    time: "2022-01-01 12:00:00",
    banner: "https://www.xxx.com/static/images/banner.png",
  },
  {
    title: "热门文章",
    data: [
      "尊敬的用户，欢迎使用本系统！",
      "本系统由XXX团队开发，专注于XXX业务。",
      "本系统由XXX团队开发，专注于XXX业务。",
    ],
    time: "2022-01-01 12:00:00",
    banner: "https://www.xxx.com/static/images/banner.png",
  },
  {
    title: "最新评论",
    data: [
      "尊敬的用户，欢迎使用本系统！",
      "本系统由XXX团队开发，专注于XXX业务。",
      "本系统由XXX团队开发，专注于XXX业务。",
    ],
    time: "2022-01-01 12:00:00",
    banner: "https://www.xxx.com/static/images/banner.png",
  },

  {
    title: "热门评论",
    data: [
      "尊敬的用户，欢迎使用本系统！",
      "本系统由XXX团队开发，专注于XXX业务。",
      "本系统由XXX团队开发，专注于XXX业务。",
    ],
    time: "2022-01-01 12:00:00",
    banner: "https://www.xxx.com/static/images/banner.png",
  },
];
const articleList = ref<Message[]>(ARTICLE_LIST);
const sixNews = ref<Message>({ title: "", data: [], time: "", banner: "" });
const hotAll = ref<Message>({ title: "", data: [], time: "", banner: "" });

const handleGetNews = async () => {
  try {
    const res = await getApisCateNews({
      new_keys: ["sixNews", "hotAll"],
    });
    const { sixNews: six, hotAll: h } = res.data;
    sixNews.value = six;
    hotAll.value = h.data;
  } catch (error) {
    console.log(error);
  }
};
handleGetNews();
</script>

<template>
  <div class="p-2 my-5">
    <h2 class="title mb-3 font-bold flex items-center text-lg">
      {{ sixNews.title }}
    </h2>
    <div class="article flex">
      <!-- float-left -->
      <img class="w-1/3 h-60" :src="sixNews.banner" alt="" />
      <div>
        <p
          class="ml-5 text-sm"
          v-for="(item, index) in sixNews.data"
          :key="index"
        >
          {{ index + 1 }} : {{ item }}
        </p>
      </div>
    </div>
  </div>
  <div>
    <!-- <div class="article-list">
      <div class="at-item" v-for="(item, index) in articleList" :key="index">
        {{ item.title }}
      </div>
      <div>{{ hotAll }}</div>
    </div> -->
  </div>
</template>

<style scoped lang="scss"></style>
