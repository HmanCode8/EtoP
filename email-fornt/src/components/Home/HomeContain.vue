<script setup lang="ts">
import { ref } from "vue";
import { getApisCateNews } from "@/services/homeService";
import _ from "lodash";
interface Message {
  title: string;
  data: string[];
  time: string;
  banner: string;
}

const sixNews = ref<Message>({ title: "", data: [], time: "", banner: "" });
// const hotAll = ref<Message>({ title: "", data: [], time: "", banner: "" });

const handleGetNews = async () => {
  try {
    let result = [];
    const {
      data: { sixNews: six },
    } = await getApisCateNews({
      new_keys: ["sixNews"],
    });
    result = six;
    if (_.isEmpty(result)) {
      const res = await fetch("https://api.vvhan.com/api/60s");
      result = await res.json();
    }
    sixNews.value = result;
  } catch (error) {
    console.log(error);
  }
};
handleGetNews();
</script>

<template>
  <div class="p-2 my-5" v-if="sixNews.title">
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
  <div class="p-2 my-5" v-if="sixNews.title">
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
  <div class="p-2 my-5 flex justify-center items-center" v-else>暂无数据</div>
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
