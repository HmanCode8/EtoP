<script setup lang="ts">
import { ref } from "vue";
// import {getNews} from "@services/homeService"
import { getNews } from "@/services/homeService";

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
const newMessags = ref<Message>({ title: "", data: [], time: "", banner: "" });

const getNew = async () => {
  try {
    const data = await getNews();
    newMessags.value = data;
  } catch (error) {
    console.log(error);
  }
};
getNew();
</script>

<template>
  <div class="p-2 my-5 border-b">
    <h2 class="title mb-3 font-bold flex items-center text-lg">
      {{ newMessags.title }}
    </h2>
    <div class="article flex">
      <!-- float-left -->
      <img class="w-1/3 h-60" :src="newMessags.banner" alt="" />
      <div>
        <p
          class="ml-5 text-sm"
          v-for="(item, index) in newMessags.data"
          :key="index"
        >
          {{ index + 1 }} : {{ item }}
        </p>
      </div>
    </div>
  </div>
  <div>
    <div class="article-list">
      <div class="at-item" v-for="(item, index) in articleList" :key="index">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
